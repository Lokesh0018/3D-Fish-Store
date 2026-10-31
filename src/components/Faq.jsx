import { useEffect, useRef } from 'react';
import { FAQ } from '../data/content.js';
import coral from '../assets/images/deco/coral.webp';
import pearl from '../assets/images/deco/pearl.webp';
import shell from '../assets/images/deco/shell.webp';
import Icon from './Icon.jsx';
import Waves from './Waves.jsx';

// Quick answers pulled from the promise / FAQ copy, shown beside the questions.
const FACTS = [
  { icon: 'shield', value: '2 hrs', label: 'to report an unwell arrival' },
  { icon: 'clock', value: '21 days', label: 'quarantine before shipping' },
  { icon: 'truck', value: 'Mon–Wed', label: 'overnight dispatch only' },
];

// Background pieces, each with its own drift (--dy) and turn (--rot) across the section's scroll range.
const DECO = [
  { src: coral, className: 'deco deco--coral', dy: '-140px', rot: '6deg' },
  { src: pearl, className: 'deco deco--pearl', dy: '120px', rot: '-10deg' },
  { src: shell, className: 'deco deco--shell', dy: '-220px', rot: '18deg' },
];

// Sets --t on the section: -0.5 as it enters the viewport bottom, 0.5 as it leaves the top.
function useParallax(ref) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = (vh - r.top) / (vh + r.height) - 0.5;
      el.style.setProperty('--t', Math.min(0.5, Math.max(-0.5, t)).toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); update(); }
      else window.removeEventListener('scroll', onScroll);
    });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [ref]);
}

export default function Faq() {
  const section = useRef(null);
  useParallax(section);

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title" ref={section}>
      <Waves className="waves--faq" />
      <div className="faq__deco" aria-hidden="true">
        {DECO.map((d) => (
          <img key={d.className} className={d.className} src={d.src} alt="" loading="lazy" decoding="async" style={{ '--dy': d.dy, '--rot': d.rot }} />
        ))}
      </div>
      <div className="faq__inner">
        <div className="faq__aside" data-reveal>
          <div className="section-head">
            <p className="eyebrow">Questions</p>
            <h2 className="section-title" id="faq-title">Before you bring them home</h2>
            <p className="faq__lede">Shipping, tank setup and what happens if something goes wrong — the things keepers ask us most.</p>
          </div>
          <div className="faq__card">
            <p className="faq__card-title"><Icon name="help" />The short version</p>
            <ul className="faq__facts">
              {FACTS.map((f) => (
                <li key={f.value}><span className="faq__fact-icon"><Icon name={f.icon} /></span><span><strong>{f.value}</strong> {f.label}</span></li>
              ))}
            </ul>
            <a className="text-link faq__more" href="#care">Read our promise<Icon name="arrow" /></a>
          </div>
        </div>

        <div className="faq__list" data-reveal style={{ '--i': 1 }}>
          {FAQ.map((f, i) => (
            <details key={f.q} className="faq__item" open={i === 0}>
              <summary>
                <span className="faq__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="faq__q">{f.q}</span>
                <span className="faq__sign" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
