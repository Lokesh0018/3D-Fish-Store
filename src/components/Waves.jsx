import { useEffect, useRef } from 'react';

// Wave band that drifts sideways only while the page scrolls (offset is tied to scrollY).
// Each path spans 2880 units with a period that divides 1440, so shifting by half its width tiles seamlessly.
const W = 2880;
const LAYERS = [
  { period: 720, amp: 14, base: 54, speed: 0.06, className: 'waves__l1' },
  { period: 480, amp: 10, base: 66, speed: -0.09, className: 'waves__l2' },
  { period: 960, amp: 16, base: 80, speed: 0.13, className: 'waves__l3' },
];

function wavePath({ period, amp, base }) {
  let d = `M0 ${base}`;
  for (let x = 0; x <= W; x += 16) d += ` L${x} ${(base + Math.sin((x / period) * Math.PI * 2) * amp).toFixed(1)}`;
  return `${d} L${W} 120 L0 120 Z`;
}

export default function Waves({ className = '' }) {
  const root = useRef(null);
  const layers = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      layers.current.forEach((el, i) => {
        // percentage of the 200%-wide svg; wraps every 50% (one full tile)
        const shift = (((y * LAYERS[i].speed) % 50) + 50) % 50;
        el.style.transform = `translate3d(${-shift}%,0,0)`;
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };

    // only listen while the band is near the viewport
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); update(); }
      else window.removeEventListener('scroll', onScroll);
    }, { rootMargin: '200px 0px' });
    io.observe(root.current);
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);

  return (
    <div className={`waves ${className}`.trim()} ref={root} aria-hidden="true">
      {LAYERS.map((l, i) => (
        <svg key={l.className} className={`waves__layer ${l.className}`} ref={(el) => { layers.current[i] = el; }}
          viewBox={`0 0 ${W} 120`} preserveAspectRatio="none">
          <path d={wavePath(l)} />
        </svg>
      ))}
    </div>
  );
}
