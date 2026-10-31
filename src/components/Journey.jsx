import { useEffect, useRef } from 'react';
import { JOURNEY } from '../data/content.js';
import Icon from './Icon.jsx';
import { LogoMark } from './Logo.jsx';

// A fish swims along the route as the steps scroll through the viewport; each step lights up once it's reached.
function useRouteProgress(list) {
  useEffect(() => {
    const el = list.current;
    const steps = [...el.querySelectorAll('.step')];
    const set = (p) => {
      el.style.setProperty('--p', p.toFixed(4));
      const last = steps.length - 1;
      const current = Math.min(last, Math.floor(p * last + 0.02));
      steps.forEach((s, i) => {
        s.classList.toggle('is-reached', i <= current);
        s.classList.toggle('is-current', i === current);
      });
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { set(1); return; }

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // starts as the list enters the lower viewport, completes once its bottom passes the middle
      const p = (vh * 0.85 - r.top) / Math.max(r.height + vh * 0.35, 1);
      set(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); update(); }
      else { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, [list]);
}

export default function Journey() {
  const list = useRef(null);
  useRouteProgress(list);

  return (
    <section className="journey" id="journey" aria-labelledby="journey-title">
      <div className="section-head journey__head" data-reveal>
        <div>
          <p className="eyebrow">How it arrives</p>
          <h2 className="section-title" id="journey-title">From our tanks to yours</h2>
        </div>
        <p className="journey__lede">Live fish need a careful trip. Here is exactly what happens between your order and the moment you release them.</p>
      </div>

      <div className="route" ref={list}>
        <div className="route__track" aria-hidden="true">
          <span className="route__fill" />
          <span className="route__fish"><LogoMark /></span>
        </div>
        <ol className="journey__steps">
          {JOURNEY.map((s, i) => (
            <li key={s.title} className="step" data-reveal style={{ '--i': i }}>
              <span className="step__node" aria-hidden="true" />
              <div className="step__top">
                <span className="step__icon"><Icon name={s.icon} /></span>
                <span className="step__time"><Icon name="clock" />{s.time}</span>
              </div>
              <p className="step__n">Step {String(i + 1).padStart(2, '0')}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="journey__foot" data-reveal>
        <ul className="journey__facts">
          <li><Icon name="truck" />Ships Monday to Wednesday</li>
          <li><Icon name="shield" />Live arrival guarantee</li>
          <li><Icon name="drop" />Acclimation card in every box</li>
        </ul>
        <a className="btn btn--red journey__cta" href="#shop">Shop the collection<Icon name="arrow" /></a>
      </div>
    </section>
  );
}
