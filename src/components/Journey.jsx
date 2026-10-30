import { JOURNEY } from '../data/content.js';
import Icon from './Icon.jsx';

export default function Journey() {
  return (
    <section className="journey" id="journey" aria-labelledby="journey-title">
      <div className="section-head" data-reveal>
        <p className="eyebrow">How it arrives</p>
        <h2 className="section-title" id="journey-title">From our pond to yours</h2>
      </div>
      <ol className="journey__steps">
        {JOURNEY.map((s, i) => (
          <li key={s.title} className="step" data-reveal style={{ '--i': i }}>
            <div className="step__top">
              <span className="step__icon"><Icon name={s.icon} /></span>
              <span className="step__n" aria-hidden="true">Step {i + 1}</span>
            </div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
