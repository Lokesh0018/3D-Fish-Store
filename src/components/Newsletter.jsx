import { useState } from 'react';
import { PRODUCTS } from '../data/products.js';
import FishImage from './FishImage.jsx';
import Icon from './Icon.jsx';
import { LogoMark } from './Logo.jsx';
import Waves from './Waves.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERKS = [
  { icon: 'sparkle', text: 'New arrivals before they hit the shop' },
  { icon: 'drop', text: 'Seasonal care tips for your tank' },
  { icon: 'heart', text: 'The occasional fish story' },
];
// Fish shown on the letter in the illustration.
const PREVIEW = PRODUCTS.find((p) => p.id === 'koi-halfmoon');

// Front-end only: nothing is sent until a mailing-list provider is connected.
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | error | done

  const submit = (e) => {
    e.preventDefault();
    setState(EMAIL_RE.test(email.trim()) ? 'done' : 'error');
  };

  return (
    <section className="newsletter" id="newsletter" aria-labelledby="newsletter-title">
      <Waves className="waves--newsletter" />
      <div className="newsletter__card" data-reveal>
        <div className="newsletter__body">
          <p className="eyebrow"><Icon name="mail" />The newsletter</p>
          <h2 className="section-title" id="newsletter-title">Tank <em>notes</em></h2>
          <p className="newsletter__lede">A short letter from our fish room, once a month and never more.</p>
          <ul className="newsletter__perks">
            {PERKS.map((p) => (
              <li key={p.text}><span className="newsletter__perk-icon"><Icon name={p.icon} /></span>{p.text}</li>
            ))}
          </ul>

          {state === 'done' ? (
            <p className="newsletter__done" role="status"><Icon name="check" /> You're on the list. See you next month.</p>
          ) : (
            <form className="newsletter__form" onSubmit={submit} noValidate>
              <label className="newsletter__label" htmlFor="nl-email">Email address</label>
              <div className="newsletter__field">
                <Icon name="mail" className="icon newsletter__field-icon" />
                <input id="nl-email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com"
                  value={email} onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
                  aria-invalid={state === 'error'} aria-describedby={state === 'error' ? 'nl-error' : 'nl-note'} />
                <button type="submit" className="btn btn--red newsletter__submit">Subscribe<Icon name="arrow" /></button>
              </div>
              {state === 'error'
                ? <p className="newsletter__error" id="nl-error" role="alert">Please enter a valid email address.</p>
                : <p className="newsletter__note" id="nl-note">One email a month. No spam, ever.</p>}
            </form>
          )}
        </div>

        {/* Illustration: a letter rising out of an envelope, with this month's fish and a Finsmith stamp */}
        <div className="newsletter__art" aria-hidden="true">
          <span className="tag tag--a"><Icon name="sparkle" />New arrivals</span>
          <span className="tag tag--b"><Icon name="drop" />Care tips</span>
          <span className="tag tag--c"><Icon name="heart" />Fish stories</span>
          <div className="env">
            <span className="env__back" />
            <div className="letter">
              <span className="letter__stamp"><LogoMark /><b>No. 01</b></span>
              <span className="letter__kicker">Tank notes</span>
              <span className="letter__title">New in: {PREVIEW.name}</span>
              <span className="letter__fish"><FishImage product={PREVIEW} /></span>
              <span className="letter__line" />
              <span className="letter__line letter__line--short" />
            </div>
            <span className="env__front" />
          </div>
        </div>
      </div>
    </section>
  );
}
