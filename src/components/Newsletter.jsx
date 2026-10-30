import { useState } from 'react';
import Icon from './Icon.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      <div className="newsletter__inner" data-reveal>
        <span className="newsletter__icon"><Icon name="mail" /></span>
        <h2 className="section-title" id="newsletter-title">Pond notes</h2>
        <p className="newsletter__lede">New arrivals before they hit the shop, seasonal care tips, and the occasional fish story. Once a month, never more.</p>

        {state === 'done' ? (
          <p className="newsletter__done" role="status"><Icon name="check" /> You're on the list. See you next month.</p>
        ) : (
          <form className="newsletter__form" onSubmit={submit} noValidate>
            <label className="newsletter__label" htmlFor="nl-email">Email address</label>
            <div className="newsletter__field">
              <input id="nl-email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com"
                value={email} onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
                aria-invalid={state === 'error'} aria-describedby={state === 'error' ? 'nl-error' : undefined} />
              <button type="submit" className="btn btn--ink">Subscribe</button>
            </div>
            {state === 'error' && <p className="newsletter__error" id="nl-error" role="alert">Please enter a valid email address.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
