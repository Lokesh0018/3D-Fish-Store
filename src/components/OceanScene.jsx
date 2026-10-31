import { PRODUCTS } from '../data/products.js';
import coral from '../assets/images/deco/coral.webp';
import shell from '../assets/images/deco/shell.webp';
import { Ship, Sailboat, FishingBoat, Submarine, Diver } from './Vessels.jsx';

// Decorative underwater scene for the footer background: light rays, fish at three depths,
// swaying seaweed, rising bubbles and a sea floor. Pure CSS animation (transform/opacity only).

const photo = (id) => PRODUCTS.find((p) => p.id === id).image;
// Logo fish silhouette (faces right) for the distant shoal.
const FISH = 'M13 16C10 11.5 6.5 7 3.2 6.6C1.4 10.5 1.4 21.5 3.2 25.4C6.5 25 10 20.5 13 16ZM14.2 11.4C15 7.4 18.6 5.6 22.4 6.6C20.6 7.8 19.6 9 19.2 10.4ZM14.6 20.6C15.6 24.4 18 26 20.6 25.6C19.6 24.2 19.2 22.8 19.2 21.6ZM28.4 15.6C28.4 12.2 24.4 10 19.8 10C16 10 13.2 12.4 11.6 16C13.2 19.6 16 22 19.8 22C24.4 22 28.4 19.2 28.4 15.6Z';

// depth: far (silhouette) | mid (soft photo) | near (sharp photo). dir: which way it swims. Product photos face left.
const SWIMMERS = [
  { depth: 'far', size: 26, top: 14, dur: 46, delay: -8, dir: 'r' },
  { depth: 'far', size: 20, top: 18, dur: 52, delay: -30, dir: 'r' },
  { depth: 'far', size: 22, top: 40, dur: 58, delay: -14, dir: 'l' },
  { depth: 'far', size: 18, top: 44, dur: 50, delay: -40, dir: 'l' },
  { depth: 'far', size: 24, top: 62, dur: 54, delay: -22, dir: 'r' },
  { depth: 'mid', img: photo('turquoise'), size: 64, top: 30, dur: 38, delay: -6, dir: 'l' },
  { depth: 'mid', img: photo('silver-angel'), size: 70, top: 56, dur: 44, delay: -27, dir: 'r' },
  { depth: 'mid', img: photo('eagle-ray'), size: 110, top: 6, dur: 62, delay: -44, dir: 'l' },
  // sharp, close fish keep to the open sea-floor band below the text
  { depth: 'near', img: photo('moorish-idol'), size: 92, bottom: 34, dur: 34, delay: -12, dir: 'l' },
  { depth: 'near', img: photo('koi-halfmoon'), size: 80, bottom: 10, dur: 40, delay: -31, dir: 'r' },
];

// x position (%), height (px), sway duration (s), delay (s), front row or back row
const PLANTS = [
  [2, 150, 7, -1, 'back'], [9, 110, 6, -3, 'front'], [17, 170, 8, -2, 'back'], [27, 96, 5.5, -4, 'front'],
  [38, 140, 7.5, -1.5, 'back'], [52, 120, 6.5, -3.5, 'front'], [63, 160, 8.5, -2.5, 'back'], [72, 104, 6, -1, 'front'],
  [84, 176, 9, -4, 'back'], [92, 124, 6.8, -2, 'front'],
];

// x (%), size (px), rise duration (s), delay (s)
const BUBBLES = [
  [5, 8, 11, -2], [12, 5, 9, -6], [21, 10, 13, -1], [30, 6, 10, -8], [41, 4, 8, -3], [47, 9, 12, -10],
  [56, 5, 9.5, -5], [64, 11, 14, -7], [71, 6, 10.5, -1.5], [79, 4, 8.5, -9], [86, 8, 12.5, -4], [94, 6, 11, -11],
];

function Seaweed() {
  return (
    <svg viewBox="0 0 60 160" preserveAspectRatio="none">
      <path d="M30 160C22 130 36 110 26 82C18 58 34 38 28 0C40 28 30 52 38 78C46 106 34 130 36 160Z" />
      <path d="M22 160C10 136 18 116 8 96C2 82 10 66 4 52C16 66 12 82 18 96C28 118 22 138 28 160Z" opacity=".75" />
      <path d="M40 160C46 134 40 118 50 98C56 84 52 70 58 58C60 76 58 88 54 100C48 120 52 140 46 160Z" opacity=".6" />
    </svg>
  );
}

// ---- Surface traffic (sits in the footer's wave band) ----
// Craft are drawn facing right (Vessels.jsx); ones heading left are flipped in CSS.
const VESSELS = [
  { C: Ship, w: 140, dur: 110, delay: -20, dir: 'r' },
  { C: Sailboat, w: 58, dur: 70, delay: -45, dir: 'l' },
  { C: FishingBoat, w: 60, dur: 85, delay: -70, dir: 'r' },
];

export function Surface() {
  return (
    <div className="surface" aria-hidden="true">
      {VESSELS.map(({ C, w, dur, delay, dir }, i) => (
        <div key={i} className={`vessel vessel--${dir}`} style={{ '--w': `${w}px`, '--dur': `${dur}s`, '--delay': `${delay}s` }}>
          <div className="vessel__rock"><C /></div>
        </div>
      ))}
    </div>
  );
}

// ---- Deep water: a submarine and a diver ----
export function DeepDivers() {
  return (
    <>
      <div className="deep deep--sub" style={{ '--top': '46%', '--w': '200px', '--dur': '120s', '--delay': '-35s' }}>
        <div className="deep__drift"><Submarine /></div>
      </div>
      <div className="deep deep--diver deep--l" style={{ '--top': '18%', '--w': '150px', '--dur': '80s', '--delay': '-10s' }}>
        <div className="deep__drift">
          <Diver />
          <span className="diver__bubbles"><i /><i /><i /></span>
        </div>
      </div>
    </>
  );
}

export default function OceanScene() {
  return (
    <div className="ocean" aria-hidden="true">
      <div className="ocean__rays"><i /><i /><i /><i /></div>

      {SWIMMERS.map((f, i) => (
        <div key={i} className={`swimmer swimmer--${f.depth} swimmer--${f.dir}`}
          style={{ '--size': `${f.size}px`, ...(f.bottom != null ? { top: 'auto', bottom: `${f.bottom}px` } : { '--top': `${f.top}%` }), '--dur': `${f.dur}s`, '--delay': `${f.delay}s` }}>
          <div className="swimmer__bob">
            {f.img
              ? <img src={f.img} alt="" loading="lazy" decoding="async" />
              : <svg viewBox="1 4 30 24"><path d={FISH} /></svg>}
          </div>
        </div>
      ))}

      <DeepDivers />

      <div className="ocean__bubbles">
        {BUBBLES.map(([x, s, d, o]) => <i key={x} style={{ '--x': `${x}%`, '--s': `${s}px`, '--d': `${d}s`, '--o': `${o}s` }} />)}
      </div>

      <div className="ocean__floor">
        <img className="ocean__coral" src={coral} alt="" loading="lazy" decoding="async" />
        <img className="ocean__shell" src={shell} alt="" loading="lazy" decoding="async" />
        {PLANTS.map(([x, h, d, o, row]) => (
          <div key={x} className={`plant plant--${row}`} style={{ '--x': `${x}%`, '--h': `${h}px`, '--d': `${d}s`, '--o': `${o}s` }}>
            <Seaweed />
          </div>
        ))}
      </div>
    </div>
  );
}
