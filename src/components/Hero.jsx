import { useEffect, useMemo, useRef, useState } from 'react';

const STAR_PATH = 'M12 0c.7 7.2 4.8 11.3 12 12-7.2.7-11.3 4.8-12 12-.7-7.2-4.8-11.3-12-12 7.2-.7 11.3-4.8 12-12z';
const STARS = [[21.6,13.4,34],[83.6,76.6,36],[31,23,13],[30.2,67.4,11],[50.2,81,9],[74.9,30.3,9]];

function makeSparkles() {
  let seed = 7;
  const rand = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  const timing = () => ({ d: 2.4 + rand() * 3.6, o: -rand() * 6 });
  const stars = STARS.map(([left, top, size]) => ({ left, top, size, ...timing() }));
  const dots = Array.from({ length: 16 }, () => {
    const left = 4 + rand() * 92, top = 5 + rand() * 88, size = 2.5 + rand() * 2.5;
    return { left, top, size, ...timing() };
  });
  return { stars, dots };
}

const sparkleStyle = (s) => ({ left: `${s.left}%`, top: `${s.top}%`, '--s': `${s.size}px`, '--d': `${s.d}s`, '--o': `${s.o}s` });

export default function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState({ text: 'Calling koi', hidden: false });
  const [ready, setReady] = useState(false);
  const { stars, dots } = useMemo(makeSparkles, []);

  useEffect(() => {
    // three.js is split into its own chunk so the store renders without waiting on it.
    let scene, cancelled = false;
    const fail = () => setStatus({ text: 'Our koi is unable to appear', hidden: false });
    import('../koi/KoiScene.js').then(({ KoiScene }) => {
      if (cancelled) return;
      scene = new KoiScene({
        hero: heroRef.current,
        canvas: canvasRef.current,
        onProgress: (pct) => setStatus({ text: `Calling koi ${pct}%`, hidden: false }),
        onReady: () => { setStatus((s) => ({ ...s, hidden: true })); setReady(true); },
        onError: fail,
      });
    }, (err) => { console.error(err); fail(); });
    return () => { cancelled = true; scene?.dispose(); };
  }, []);

  return (
    <header className="hero" id="hero" ref={heroRef}>
      <div className="sky" aria-hidden="true">
        {stars.map((s, i) => (
          <svg key={`s${i}`} className="star" viewBox="0 0 24 24" style={sparkleStyle(s)}><path d={STAR_PATH} /></svg>
        ))}
        {dots.map((s, i) => <span key={`d${i}`} className="star dot" style={sparkleStyle(s)} />)}
      </div>

      <a className="brand" href="#hero" aria-label="Finsmith, home">FINSMITH<sup aria-hidden="true">®</sup></a>
      <h1 className="hero__title">Koi</h1>
      <canvas className={`koi${ready ? ' is-ready' : ''}`} ref={canvasRef} aria-hidden="true" />

      <div className="hero__foot">
        <p className="hero__lede">Show-grade bettas and rare ornamentals,<br />shipped live to your door</p>
        <a className="hero__cta" href="#shop">Shop the fish</a>
      </div>

      <p className="status" role="status" hidden={status.hidden}>{status.text}</p>
    </header>
  );
}
