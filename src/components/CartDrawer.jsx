import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cart/CartContext.jsx';
import { formatPrice, FREE_SHIPPING_FROM } from '../data/products.js';
import FishImage from './FishImage.jsx';

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, shipping, total } = useCart();
  const closeRef = useRef(null);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (!open) { setNotice(false); return; }
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      prev?.focus?.();
    };
  }, [open, setOpen]);

  const toFree = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''}>
      <div className="drawer__scrim" onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer__head">
          <h2 id="cart-title">Your cart</h2>
          <button ref={closeRef} type="button" className="drawer__close" onClick={() => setOpen(false)} aria-label="Close cart">
            <svg viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M1 1l12 12M13 1 1 13" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer__empty">
            <p>Your pond is empty.</p>
            <a className="btn btn--ink" href="#shop" onClick={() => setOpen(false)}>Browse fish</a>
          </div>
        ) : (
          <>
            <ul className="lines">
              {items.map(({ id, qty, product }) => (
                <li key={id} className="line">
                  <div className="line__art"><FishImage product={product} /></div>
                  <div className="line__info">
                    <p className="line__name">{product.name}</p>
                    <p className="line__meta">{product.size} cm · {formatPrice(product.price)} each</p>
                    <div className="qty" role="group" aria-label={`Quantity of ${product.name}`}>
                      <button type="button" onClick={() => setQty(id, qty - 1)} aria-label="Decrease quantity">−</button>
                      <span aria-live="polite">{qty}</span>
                      <button type="button" onClick={() => setQty(id, qty + 1)} aria-label="Increase quantity" disabled={qty >= 20}>+</button>
                    </div>
                  </div>
                  <div className="line__end">
                    <p className="line__total">{formatPrice(product.price * qty)}</p>
                    <button type="button" className="line__remove" onClick={() => remove(id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer__foot">
              <p className="drawer__ship-note">
                {toFree > 0 ? `Add ${formatPrice(toFree)} more for free overnight shipping.` : 'Free overnight shipping unlocked.'}
              </p>
              <dl className="totals">
                <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div><dt>Live-fish shipping</dt><dd>{shipping ? formatPrice(shipping) : 'Free'}</dd></div>
                <div className="totals__grand"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <button type="button" className="btn btn--red btn--block" onClick={() => setNotice(true)}>Checkout</button>
              {notice && <p className="drawer__notice" role="status">Checkout isn't connected yet — this is a front-end preview.</p>}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
