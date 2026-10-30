import { FAQ } from '../data/content.js';

export default function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="section-head" data-reveal>
        <p className="eyebrow">Questions</p>
        <h2 className="section-title" id="faq-title">Before you bring them home</h2>
      </div>
      <div className="faq__list" data-reveal>
        {FAQ.map((f, i) => (
          <details key={f.q} className="faq__item" open={i === 0}>
            <summary>
              <span>{f.q}</span>
              <span className="faq__sign" aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
