import { TICKER } from '../data/content.js';
import Icon from './Icon.jsx';

export default function Ticker() {
  // The list is rendered twice so the loop scrolls seamlessly; the copy is hidden from screen readers.
  const row = (hidden) => (
    <ul className="ticker__row" aria-hidden={hidden || undefined}>
      {TICKER.map((t) => (
        <li key={t}><Icon name="sparkle" className="ticker__mark" filled />{t}</li>
      ))}
    </ul>
  );
  return (
    <section className="ticker" aria-label="Why buy from Finsmith" data-anim>
      <div className="ticker__track">{row(false)}{row(true)}</div>
    </section>
  );
}
