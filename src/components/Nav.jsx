import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cart/CartContext.jsx';
import { PRODUCTS, CATEGORIES, FREE_SHIPPING_FROM, formatPrice } from '../data/products.js';
import { SPOTLIGHT } from '../data/content.js';
import FishImage from './FishImage.jsx';
import Icon from './Icon.jsx';

const byId = (id) => PRODUCTS.find((p) => p.id === id);
const countOf = (cat) => PRODUCTS.filter((p) => cat === 'all' || p.category === cat).length;
const spotlight = byId(SPOTLIGHT.productId);

// One tile per category, each shown with a representative fish.
const TILE_FISH = { all: 'crimson-halfmoon', betta: 'mustard-gas', angelfish: 'silver-angel', marine: 'moorish-idol' };
const TILES = CATEGORIES.map((c) => {
  const n = countOf(c.id);
  return { filter: c.id, label: c.label, hint: c.id === 'all' ? `${n} in stock` : `${n} ${n === 1 ? 'variety' : 'varieties'}`, product: byId(TILE_FISH[c.id]) };
});

const LINKS = [
  { href: '#care', icon: 'shield', title: 'Our promise', hint: 'Quarantine & guarantee' },
  { href: '#journey', icon: 'truck', title: 'How it arrives', hint: 'Overnight, oxygen-packed' },
  { href: '#reviews', icon: 'star', title: 'Reviews', hint: 'From happy keepers' },
  { href: '#faq', icon: 'help', title: 'FAQ', hint: 'Tanks, shipping, care' },
];

export default function Nav({ filter, onFilter }) {
  const { count, subtotal, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  const focusables = () => [...panelRef.current.querySelectorAll('[data-menu-item]')];
  const close = (refocus) => {
    setMenuOpen(false);
    if (refocus) toggleRef.current?.focus();
  };

  useEffect(() => {
    if (!menuOpen) return;
    const first = panelRef.current.querySelector('[aria-current]') || focusables()[0];
    first?.focus({ preventScroll: true });
    const onFocus = (e) => { if (!wrapRef.current.contains(e.target)) close(false); };
    document.addEventListener('focusin', onFocus);
    document.body.classList.add('menu-open');
    return () => {
      document.removeEventListener('focusin', onFocus);
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  // Arrow keys move through items in reading order; Escape closes and returns focus.
  const onPanelKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
    const list = focusables();
    const i = list.indexOf(document.activeElement);
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    const next = step !== undefined ? i + step : { Home: 0, End: list.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    list[(next + list.length) % list.length].focus();
  };

  // Close first, then scroll once the menu's scroll lock has lifted (a plain hash jump gets cancelled by it).
  const goTo = (e, href) => {
    e.preventDefault();
    close(false);
    const target = document.querySelector(href);
    if (!target) return;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      history.replaceState(null, '', href);
      // move keyboard/screen-reader focus to the section heading without a second jump
      const heading = target.querySelector('h2') || target;
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }));
  };
  const pick = (e, f) => { onFilter(f); goTo(e, '#shop'); };
  const openCart = () => { close(false); setOpen(true); };
  const toFree = FREE_SHIPPING_FROM - subtotal;
  let order = 0;

  return (
    <div className={`nav-wrap${menuOpen ? ' is-open' : ''}`} ref={wrapRef}>
      <div className="menu-scrim" aria-hidden="true" onClick={() => close(false)} />

      <nav className="nav" aria-label="Primary">
        <button ref={toggleRef} className="nav__menu" type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="nav-menu"
          onClick={() => setMenuOpen((o) => !o)}>
          <span className="burger" aria-hidden="true"><i /><i /><i /></span>
        </button>
        <span className="nav__rule" aria-hidden="true" />
        <button className="nav__link nav__cart" type="button" onClick={openCart}
          aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
          Cart<span className="nav__count" aria-hidden="true">{count}</span>
        </button>
      </nav>

      <div className="menu" id="nav-menu" ref={panelRef} onKeyDown={onPanelKey} inert={menuOpen ? undefined : ''}>
        <div className="menu__main">
          <div className="menu__shop">
            <div className="menu__head" style={{ '--i': order++ }}>
              <p className="menu__kicker" id="menu-browse">Shop</p>
              <p className="menu__title">Browse the collection</p>
            </div>

            <ul className="menu__tiles" aria-labelledby="menu-browse">
              {TILES.map((t) => {
                const active = filter === t.filter;
                return (
                  <li key={t.filter} style={{ '--i': order++ }}>
                    <a className="tile" href="#shop" data-menu-item aria-current={active ? 'true' : undefined} onClick={(e) => pick(e, t.filter)}>
                      <span className="tile__art"><FishImage product={t.product} eager /></span>
                      <span className="tile__body">
                        <span className="tile__label">{t.label}</span>
                        <span className="tile__hint">{active ? 'Showing now' : t.hint}</span>
                      </span>
                      <span className={active ? 'tile__check' : 'tile__go'} aria-hidden="true">
                        <Icon name={active ? 'check' : 'arrow'} />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="menu__side">
            <a className="feature" href="#spotlight" data-menu-item onClick={(e) => goTo(e, '#spotlight')} style={{ '--i': order++ }}>
              <span className="feature__art"><FishImage product={spotlight} eager /></span>
              <span className="feature__text">
                <span className="feature__tag"><Icon name="sparkle" filled /> Fish of the month</span>
                <span className="feature__name">{spotlight.name}</span>
                <span className="feature__price">{formatPrice(spotlight.price)} · {spotlight.size} cm</span>
              </span>
            </a>

            <p className="menu__kicker menu__kicker--side" id="menu-explore" style={{ '--i': order++ }}>Explore</p>
            <ul className="menu__links" aria-labelledby="menu-explore">
              {LINKS.map((l) => (
                <li key={l.href} style={{ '--i': order++ }}>
                  <a className="mlink" href={l.href} data-menu-item onClick={(e) => goTo(e, l.href)}>
                    <span className="mlink__icon"><Icon name={l.icon} /></span>
                    <span className="mlink__text">
                      <span className="mlink__title">{l.title}</span>
                      <span className="mlink__hint">{l.hint}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="menu__foot" style={{ '--i': order++ }}>
          {count > 0 ? (
            <button type="button" className="menu__cart" data-menu-item onClick={openCart}>
              <span className="menu__bubble" aria-hidden="true">{count}</span>
              <span className="menu__cart-text">
                <span className="menu__cart-title">Your cart · {formatPrice(subtotal)}</span>
                <span className="menu__cart-hint">{toFree > 0 ? `${formatPrice(toFree)} away from free shipping` : 'Free overnight shipping unlocked'}</span>
              </span>
              <Icon name="arrow" className="menu__cart-arrow" />
            </button>
          ) : (
            <p className="menu__note"><Icon name="truck" className="menu__note-icon" />Free overnight shipping over&nbsp;{formatPrice(FREE_SHIPPING_FROM)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
