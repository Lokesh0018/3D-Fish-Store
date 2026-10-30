const POINTS = [
  { n: '01', title: 'Live arrival guarantee', body: 'If your fish arrives unwell, we replace it or refund it in full. Just send a photo within 2 hours of delivery.' },
  { n: '02', title: '21-day quarantine', body: 'Every fish is quarantined, health-checked and settled on our own water before it ever ships.' },
  { n: '03', title: 'Overnight, insulated', body: 'Oxygen-packed bags in insulated boxes, shipped Monday to Wednesday so nothing sits in a depot over the weekend.' },
];

export default function CarePromise() {
  return (
    <section className="promise" id="care" aria-labelledby="care-title">
      <div className="section-head">
        <p className="eyebrow">Our promise</p>
        <h2 className="section-title" id="care-title">Raised slowly. Shipped carefully.</h2>
      </div>
      <ol className="promise__list">
        {POINTS.map((p) => (
          <li key={p.n} className="promise__item">
            <span className="promise__n" aria-hidden="true">{p.n}</span>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
