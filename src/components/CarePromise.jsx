import Icon from './Icon.jsx';

const POINTS = [
  { n: '01', icon: 'shield', title: 'Live arrival guarantee', tag: 'Photo within 2 hours', body: 'If your fish arrives unwell, we replace it or refund it in full. Just send a photo within 2 hours of delivery.' },
  { n: '02', icon: 'clock', title: '21-day quarantine', tag: 'Health-checked before shipping', body: 'Every fish is quarantined, health-checked and settled on our own water before it ever ships.' },
  { n: '03', icon: 'truck', title: 'Overnight, insulated', tag: 'Ships Monday to Wednesday', body: 'Oxygen-packed bags in insulated boxes, shipped Monday to Wednesday so nothing sits in a depot over the weekend.' },
];

// Circumference of the seal's text ring (r = 52), so the phrase wraps exactly once.
const RING = 2 * Math.PI * 52;

export default function CarePromise() {
  return (
    <section className="promise" id="care" aria-labelledby="care-title">
      <div className="section-head promise__head" data-reveal>
        <div>
          <p className="eyebrow">Our promise</p>
          <h2 className="section-title" id="care-title">Raised slowly. Shipped carefully.</h2>
          <p className="promise__lede">Three promises that come with every fish we sell, from a beginner betta to a rare marine.</p>
        </div>
        <div className="seal" aria-hidden="true">
          <svg className="seal__ring" viewBox="0 0 140 140">
            <defs><path id="seal-path" d="M70 18a52 52 0 1 1 0 104a52 52 0 1 1 0-104" /></defs>
            <text textLength={RING.toFixed(1)} lengthAdjust="spacing">
              <textPath href="#seal-path">LIVE ARRIVAL GUARANTEED • 21-DAY QUARANTINE • </textPath>
            </text>
          </svg>
          <span className="seal__core"><Icon name="shield" /></span>
        </div>
      </div>

      <ol className="promise__list">
        {POINTS.map((p, i) => (
          <li key={p.n} className="promise__item" data-reveal style={{ '--i': i }}>
            <span className="promise__n" aria-hidden="true">{p.n}</span>
            <span className="promise__icon"><Icon name={p.icon} /></span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <p className="promise__tag"><Icon name="check" />{p.tag}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
