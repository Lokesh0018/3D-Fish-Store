import { useEffect, useState } from 'react';
import { PRODUCTS, formatPrice } from '../data/products.js';
import { SPOTLIGHT } from '../data/content.js';
import { useCart } from '../cart/CartContext.jsx';
import FishImage from './FishImage.jsx';

export default function Spotlight({ onFilter }) {
  const product = PRODUCTS.find((p) => p.id === SPOTLIGHT.productId);
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <section className="spotlight" id="spotlight" aria-labelledby="spotlight-title">
      <div className="spotlight__art" data-reveal>
        <FishImage product={product} />
      </div>

      <div className="spotlight__copy" data-reveal>
        <p className="eyebrow">Fish of the month</p>
        <h2 className="section-title" id="spotlight-title">{product.name}</h2>
        <p className="spotlight__story">{SPOTLIGHT.story}</p>
        <dl className="specs">
          {SPOTLIGHT.specs.map((s) => (
            <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </dl>
        <div className="spotlight__buy">
          <p className="spotlight__price">{formatPrice(product.price)}</p>
          <button type="button" className="btn btn--cream" onClick={() => { add(product.id); setAdded(true); }}>
            {added ? 'Added to cart' : 'Add to cart'}
          </button>
          <a className="text-link" href="#shop" onClick={() => onFilter('koi')}>See all koi</a>
        </div>
      </div>
    </section>
  );
}
