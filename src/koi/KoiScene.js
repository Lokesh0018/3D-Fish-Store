import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import MODEL_URL from '../assets/models/fish/hf_20261013_132630_0605aa00-d02f-4d71-9db5-e0d1a8232667.glb?url';

const NS = 32;
const CRUISE = 0.3;
const HIST_STEP = 0.012;

// The GLB is ~18 MB, so load it once per page and share it between mounts
// (React StrictMode mounts effects twice in development).
let modelPromise = null;
const progressListeners = new Set();
function loadModel() {
  if (!modelPromise) {
    modelPromise = new GLTFLoader().loadAsync(MODEL_URL, (e) => {
      if (!e.lengthComputable || !e.total) return;
      const pct = Math.round((e.loaded / e.total) * 100);
      progressListeners.forEach((fn) => fn(pct));
    });
    modelPromise.catch(() => { modelPromise = null; });
  }
  return modelPromise;
}

const VERT_HEAD = /* glsl */`
#define NS 32
uniform vec4 uSpine[NS];
uniform float uLen, uTime, uSweep, uFlutter;
varying float vFin;
vec3 koiP, koiX, koiY, koiZ, koiLocal;
vec4 koiAt(int i){ return uSpine[clamp(i,0,NS-1)]; }
void koiSolve(){
  vec3 lp = position; float al = abs(lp.y);
  float fin = smoothstep(0.07,0.17,al); float tail = smoothstep(0.68,0.98,lp.x); float side = fin*(1.0-tail);
  float sweep = uSweep + 0.09*sin(uTime*1.7 + lp.x*4.0);
  lp.x += side*(al-0.07)*sweep*1.3;
  lp.z += side*sin(uTime*2.6 - al*16.0 + lp.x*5.0)*0.02*(al/0.2)*uFlutter;
  lp.z += tail*sin(uTime*2.2 - lp.x*14.0 + lp.y*9.0)*0.024*uFlutter;
  lp.y *= 1.0 + tail*0.1*sin(uTime*1.3 + lp.x*6.0)*uFlutter;
  vFin = max(fin, smoothstep(0.71,0.8,position.x)); koiLocal = lp;
  float f = clamp(lp.x,0.0,1.0)*float(NS-1); float fi = min(floor(f), float(NS-2)); float t = f-fi; int i = int(fi);
  vec4 p0=koiAt(i-1), p1=koiAt(i), p2=koiAt(i+1), p3=koiAt(i+2);
  vec3 a = -p0.xyz+p2.xyz; vec3 b = 2.0*p0.xyz-5.0*p1.xyz+4.0*p2.xyz-p3.xyz; vec3 c = -p0.xyz+3.0*p1.xyz-3.0*p2.xyz+p3.xyz;
  koiP = 0.5*(2.0*p1.xyz + a*t + b*t*t + c*t*t*t);
  vec3 tangent = normalize(a + 2.0*b*t + 3.0*c*t*t);
  float roll = mix(p1.w,p2.w,t); float cr=cos(roll), sr=sin(roll);
  vec3 flatY = normalize(cross(vec3(0.0,0.0,1.0), tangent)); vec3 flatZ = cross(tangent, flatY);
  koiX = tangent; koiY = flatY*cr + flatZ*sr; koiZ = flatZ*cr - flatY*sr;
}
`;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const angDiff = (a, b) => { let d = (a - b) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; };
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/**
 * Mounts the swimming koi into `canvas`, sized and steered by `hero`.
 * Callbacks: onProgress(pct), onReady(), onError(err). Call dispose() on unmount.
 */
export class KoiScene {
  constructor({ hero, canvas, onProgress, onReady, onError }) {
    this.hero = hero;
    this.canvas = canvas;
    this.onReady = onReady;
    this.disposed = false;
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

    this.uniforms = {
      uSpine: { value: new Float32Array(NS * 4) },
      uLen: { value: 1 },
      uTime: { value: 0 },
      uSweep: { value: 0 },
      uFlutter: { value: 0.35 },
    };
    this.view = { w: 1, h: 1, len: 1, bx: 1, by: 1, pxW: 0, pxH: 0 };
    this.fish = { x: 0, y: 0, z: 0, heading: 0, omega: 0, speed: 0, roll: 0, phase: 0, sweep: 0, dartUntil: -1, wake: 0 };
    this.trail = [];
    this.pointer = { x: 0, y: 0, seen: -Infinity, down: false };
    this.spinePts = Array.from({ length: NS }, () => ({ x: 0, y: 0, z: 0, r: 0 }));
    this.started = false;
    this.visible = true;
    this.clock = 0;
    this.born = 0;
    this.last = 0;

    this.initRenderer();

    this.resize = this.resize.bind(this);
    this.frame = this.frame.bind(this);
    this.ro = new ResizeObserver(this.resize);
    this.ro.observe(hero);
    // Stop rendering while the hero is scrolled out of view.
    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (!this.started) return;
      if (this.visible) { this.last = performance.now(); this.renderer.setAnimationLoop(this.frame); }
      else this.renderer.setAnimationLoop(null);
    });
    this.io.observe(hero);
    this.bindPointer();

    this.progressFn = onProgress;
    if (onProgress) progressListeners.add(onProgress);
    loadModel().then((gltf) => {
      if (this.disposed) return;
      this.buildKoi(gltf);
      this.modelReady = true;
      this.tryStart();
    }, (err) => {
      if (this.disposed) return;
      console.error(err);
      onError?.(err);
    });
  }

  initRenderer() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    this.renderer = renderer;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    scene.environment = this.envTarget.texture;
    scene.environmentIntensity = 0.85;
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    this.camera = camera;

    const key = new THREE.DirectionalLight(0xfff0dc, 2.4);
    key.position.set(-3, 5, 8);
    const fill = new THREE.DirectionalLight(0xffb48a, 0.9);
    fill.position.set(5, -3, 4);
    scene.add(key, fill, new THREE.AmbientLight(0xffffff, 0.35));
  }

  makeKoiMaterial(source) {
    const mat = source.clone();
    mat.transparent = true;
    mat.depthWrite = true;
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\n' + VERT_HEAD)
        .replace('#include <beginnormal_vertex>',
          'koiSolve(); vec3 objectNormal = normalize(koiX*normal.x + koiY*normal.y + koiZ*normal.z);\n' +
          '#ifdef USE_TANGENT\nvec3 objectTangent = normalize(koiX*tangent.x + koiY*tangent.y + koiZ*tangent.z);\n#endif')
        .replace('#include <begin_vertex>',
          'vec3 transformed = koiP + (koiY*koiLocal.y + koiZ*koiLocal.z)*uLen;');
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vFin;')
        .replace('#include <map_fragment>', `#include <map_fragment>
  // kohaku koi: the texture's coloured patches become brand red, its pale areas pearl white; luminance keeps the shading
  float koiLum = dot(diffuseColor.rgb, vec3(0.2126,0.7152,0.0722));
  float koiSat = max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b)) - min(diffuseColor.r, min(diffuseColor.g, diffuseColor.b));
  float koiShade = mix(0.72, 1.0, smoothstep(0.05, 0.85, koiLum));
  vec3 koiRed = vec3(0.80, 0.06, 0.07), koiWhite = vec3(1.0, 0.975, 0.95);
  diffuseColor.rgb = mix(koiWhite, koiRed, smoothstep(0.45, 0.62, koiSat)) * koiShade;
  diffuseColor.a *= mix(1.0, 0.84, vFin);`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
  totalEmissiveRadiance += diffuseColor.rgb * vFin * 0.22;`);
    };
    return mat;
  }

  buildKoi(gltf) {
    const root = gltf.scene;
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const len = box.max.z - box.min.z;
    const bake = new THREE.Matrix4().makeScale(1 / len, 1 / len, 1 / len)
      .multiply(new THREE.Matrix4().set(0,0,-1,0, 0,1,0,0, 1,0,0,0, 0,0,0,1))
      .multiply(new THREE.Matrix4().makeTranslation(0, 0, -box.max.z));
    const aniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());

    this.meshes = [];
    root.traverse((obj) => {
      if (!obj.isMesh) return;
      const geometry = obj.geometry.clone().applyMatrix4(bake.clone().multiply(obj.matrixWorld));
      const src = Array.isArray(obj.material) ? obj.material[0] : obj.material;
      for (const k in src) { const v = src[k]; if (v && v.isTexture) v.anisotropy = aniso; }
      const koi = new THREE.Mesh(geometry, this.makeKoiMaterial(src));
      koi.frustumCulled = false;
      this.scene.add(koi);
      this.meshes.push(koi);
    });
    this.renderer.compile(this.scene, this.camera);
  }

  resize() {
    const w = this.hero.clientWidth, h = this.hero.clientHeight;
    if (!w || !h) return;
    const { renderer, camera, view } = this;
    renderer.setPixelRatio(Math.min(devicePixelRatio, w < 700 ? 1.75 : 2));
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    view.pxW = w; view.pxH = h;
    view.h = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(17.5));
    view.w = view.h * aspect;
    view.len = aspect >= 1 ? Math.min(view.w * 0.66, view.h * 1.15) : Math.min(view.w * 1.2, view.h * 0.62);
    view.bx = (view.w / view.len) * 0.5 * 0.8;
    view.by = (view.h / view.len) * 0.5 * 0.74;
    this.uniforms.uLen.value = view.len;
    this.tryStart();
  }

  tryStart() {
    if (this.started || this.disposed || !this.modelReady || !this.view.pxW || !this.view.pxH) return;
    this.started = true;
    this.seedPose();
    this.born = this.clock;
    this.last = performance.now();
    this.onReady?.();
    if (this.visible) this.renderer.setAnimationLoop(this.frame);
    else this.frame(this.last);
  }

  /* ---------- Swim simulation (units: fish lengths) ---------- */

  seedPose() {
    const { view, fish } = this;
    const cx = (view.w / view.len) * 0.055;
    const pts = [[0.52,-0.02],[0.4,0.107],[0.267,0.22],[0.1,0.293],[-0.1,0.287],[-0.227,0.153],[-0.18,0],[-0.033,-0.107],[0.12,-0.2]]
      .map(([x, y]) => new THREE.Vector3(x + cx, y, 0));
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const L = curve.getLength();
    const trail = [];
    const p = new THREE.Vector3();
    for (let d = 0; d < L; d += HIST_STEP) {
      curve.getPointAt(d / L, p);
      trail.push({ x: p.x, y: p.y, z: 0, r: 0, d });
    }
    curve.getPointAt(1, p);
    trail.push({ x: p.x, y: p.y, z: 0, r: 0, d: L });
    this.trail = trail;
    const head = trail[trail.length - 1], back = trail[Math.max(0, trail.length - 5)];
    Object.assign(fish, { x: head.x, y: head.y, z: 0, heading: Math.atan2(head.y - back.y, head.x - back.x), omega: 0.5, speed: 0, roll: 0, phase: 0, sweep: 0 });
  }

  steer(t, dt) {
    const { fish, pointer, view } = this;
    const darting = t < fish.dartUntil;
    const chasing = pointer.down || t - pointer.seen < 2.6;
    let omega = 0.42 * Math.sin(t * 0.31 + 1.3) + 0.3 * Math.sin(t * 0.53 + 4.1) + 0.36 * Math.sin(t * 0.17);
    let speed = CRUISE * (1 + 0.28 * Math.sin(t * 0.37 + 2.0));
    if (chasing) {
      const dx = pointer.x - fish.x, dy = pointer.y - fish.y, dist = Math.hypot(dx, dy);
      if (dist > 0.16) {
        omega = omega * 0.25 + angDiff(Math.atan2(dy, dx), fish.heading) * 2.4;
        speed = CRUISE * 0.8 + Math.min(dist, 1.3) * (darting ? 1.1 : 0.62);
      } else speed = CRUISE * 0.55;
    }
    // soft walls
    const ax = fish.x + Math.cos(fish.heading) * 0.28, ay = fish.y + Math.sin(fish.heading) * 0.28;
    const out = Math.hypot(ax / view.bx, ay / view.by) - 1;
    if (out > 0) {
      const w = Math.min(1, out * 2.5);
      omega += (angDiff(Math.atan2(-ay, -ax), fish.heading) * 1.9 - omega) * w;
    }
    const maxTurn = 1.5 + speed * 2.2;
    omega = clamp(omega, -maxTurn, maxTurn);
    fish.omega += (omega - fish.omega) * Math.min(1, (darting ? 5 : 3.2) * dt);
    fish.speed += (speed - fish.speed) * Math.min(1, (speed > fish.speed ? 2.6 : 0.9) * dt);
  }

  advance(t, dt) {
    const { fish, trail } = this;
    this.steer(t, dt);
    const sn = fish.speed / CRUISE;
    fish.phase += dt * Math.PI * 2 * (0.5 + 0.48 * sn);
    const v = fish.speed * (1 + 0.14 * Math.sin(fish.phase * 2));
    fish.heading += fish.omega * dt;
    const dx = Math.cos(fish.heading) * v * dt, dy = Math.sin(fish.heading) * v * dt;
    fish.x += dx; fish.y += dy;
    const zt = 0.1 * Math.sin(t * 0.23) + 0.07 * Math.sin(t * 0.41 + 2.0);
    fish.z += (zt - fish.z) * Math.min(1, 1.5 * dt);
    fish.roll += (clamp(fish.omega * 0.26, -0.6, 0.6) - fish.roll) * Math.min(1, 4 * dt);
    fish.sweep += (clamp((sn - 1) * 0.22, -0.05, 0.5) - fish.sweep) * Math.min(1, 3 * dt);

    const head = trail[trail.length - 1];
    head.d += Math.hypot(dx, dy);
    head.x = fish.x; head.y = fish.y; head.z = fish.z; head.r = fish.roll;
    if (head.d - trail[trail.length - 2].d >= HIST_STEP) trail.push({ ...head });
    const cutoff = head.d - 1.25;
    let drop = 0;
    while (drop < trail.length - 2 && trail[drop + 1].d < cutoff) drop++;
    if (drop) trail.splice(0, drop);
  }

  sampleTrail(d, out) {
    const { trail } = this;
    let lo = 0, hi = trail.length - 1;
    if (d <= trail[0].d) hi = 0;
    else if (d >= trail[hi].d) lo = hi;
    else while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (trail[mid].d <= d) lo = mid; else hi = mid; }
    const a = trail[lo], b = trail[hi], span = b.d - a.d;
    const k = span > 1e-9 ? (d - a.d) / span : 0;
    out.x = a.x + (b.x - a.x) * k;
    out.y = a.y + (b.y - a.y) * k;
    out.z = a.z + (b.z - a.z) * k;
    out.r = a.r + (b.r - a.r) * k;
  }

  writeSpine() {
    const { fish, spinePts, view } = this;
    const head = this.trail[this.trail.length - 1];
    for (let i = 0; i < NS; i++) this.sampleTrail(head.d - i / (NS - 1), spinePts[i]);
    const sn = fish.speed / CRUISE;
    const amp = (0.45 + 0.55 * Math.min(sn, 2.2)) * fish.wake;
    const len = view.len, arr = this.uniforms.uSpine.value;
    for (let i = 0; i < NS; i++) {
      const s = i / (NS - 1), p = spinePts[i];
      const a = spinePts[Math.max(0, i - 1)], b = spinePts[Math.min(NS - 1, i + 1)];
      let tx = b.x - a.x, ty = b.y - a.y;
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const wave = (0.008 + 0.085 * Math.pow(s, 1.7)) * amp * Math.sin(fish.phase - s * 5.4);
      arr[i * 4] = (p.x - ty * wave) * len;
      arr[i * 4 + 1] = (p.y + tx * wave) * len;
      arr[i * 4 + 2] = p.z * len;
      arr[i * 4 + 3] = p.r * (1 - s * 0.6);
    }
  }

  updateShadow() {
    const lift = 1 + (this.fish.z + 0.17) * 3.2;
    const unit = Math.min(this.view.pxW, this.view.pxH * 1.6) / 100;
    const style = this.canvas.style;
    style.setProperty('--sx', (-0.55 * unit * lift).toFixed(2) + 'px');
    style.setProperty('--sy', (1.25 * unit * lift).toFixed(2) + 'px');
    style.setProperty('--sb', (0.95 * unit * (0.6 + lift * 0.5)).toFixed(2) + 'px');
  }

  frame(now) {
    const dt = clamp((now - this.last) / 1000, 0, 1 / 20);
    this.last = now;
    const { fish, uniforms } = this;
    if (!this.reduceMotion.matches) {
      this.clock += dt;
      fish.wake = smoothstep(0.7, 2.6, this.clock - this.born);
      if (fish.wake > 0) this.advance(this.clock, dt * (0.25 + 0.75 * fish.wake));
      uniforms.uTime.value = this.clock;
      uniforms.uSweep.value = fish.sweep;
      uniforms.uFlutter.value = 0.35 + 0.65 * fish.wake;
    } else {
      uniforms.uFlutter.value = 0;
    }
    this.writeSpine();
    this.updateShadow();
    this.renderer.render(this.scene, this.camera);
  }

  /* ---------- Pointer ---------- */

  bindPointer() {
    const { hero, pointer } = this;
    const toPond = (e) => {
      const r = hero.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * this.view.w / this.view.len;
      pointer.y = (0.5 - (e.clientY - r.top) / r.height) * this.view.h / this.view.len;
    };
    this.onMove = (e) => { toPond(e); pointer.seen = this.clock; };
    this.onDown = (e) => {
      if (e.target.closest('a, button')) return;
      toPond(e);
      pointer.down = e.pointerType !== 'mouse';
      pointer.seen = this.clock;
      this.fish.dartUntil = this.clock + 1.2;
    };
    this.onUp = () => { pointer.down = false; };
    hero.addEventListener('pointermove', this.onMove);
    hero.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onUp);
  }

  dispose() {
    this.disposed = true;
    if (this.progressFn) progressListeners.delete(this.progressFn);
    this.renderer.setAnimationLoop(null);
    this.ro.disconnect();
    this.io.disconnect();
    this.hero.removeEventListener('pointermove', this.onMove);
    this.hero.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onUp);
    // Geometry and materials are per-mount clones; the shared textures stay cached.
    this.meshes?.forEach((m) => { m.geometry.dispose(); m.material.dispose(); });
    this.envTarget.dispose();
    this.renderer.dispose();
  }
}
