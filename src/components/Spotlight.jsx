import { useEffect, useRef, useState } from 'react';
import { PRODUCTS, formatPrice } from '../data/products.js';
import { SPOTLIGHT } from '../data/content.js';
import { useCart } from '../cart/CartContext.jsx';
import { flyToCart } from '../cart/flyToCart.js';
import FishImage from './FishImage.jsx';
import Icon from './Icon.jsx';
import Waves from './Waves.jsx';

// Decorative bubbles: horizontal position, size, duration, delay.
const BUBBLES = [[8, 10, 11, 0], [18, 6, 9, 3], [31, 14, 13, 6], [47, 7, 10, 1.5], [62, 11, 12, 4.5], [74, 5, 8, 2], [86, 9, 11, 7], [93, 13, 14, 0.8]];

export default function Spotlight({ onFilter }) {
  const product = PRODUCTS.find((p) => p.id === SPOTLIGHT.productId);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const art = useRef(null);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <section className="spotlight" id="spotlight" aria-labelledby="spotlight-title" data-anim>
      <Waves className="waves--spotlight" />
      <div className="bubbles" aria-hidden="true">
        {BUBBLES.map(([x, s, d, o]) => <i key={x} style={{ '--x': `${x}%`, '--s': `${s}px`, '--d': `${d}s`, '--o': `${o}s` }} />)}
      </div>

      <div className="spotlight__stage" data-reveal>
        <div className="spotlight__art" ref={art}>
          <FishImage product={product} />
        </div>
        <p className="spotlight__badge"><Icon name="sparkle" filled /><span>Pick of<br />the month</span></p>
      </div>

      <div className="spotlight__copy" data-reveal style={{ '--i': 1 }}>
        <p className="eyebrow">Fish of the month</p>
        <h2 className="section-title" id="spotlight-title">{product.name}</h2>
        <p className="spotlight__meta"><i>{product.species}</i><span aria-hidden="true">·</span>{product.tag}</p>
        <p className="spotlight__story">{SPOTLIGHT.story}</p>
        <dl className="specs">
          {SPOTLIGHT.specs.map((s) => (
            <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
          ))}
        </dl>
        <div className="spotlight__buy">
          <p className="spotlight__price">{formatPrice(product.price)}<span>per fish</span></p>
          <button type="button" className={`btn btn--cream spotlight__add${added ? ' is-added' : ''}`}
            onClick={() => { setAdded(true); flyToCart(art.current.querySelector('img'), () => add(product.id)); }}>
            <Icon name={added ? 'check' : 'bag'} />
            {added ? 'Added to cart' : 'Add to cart'}
          </button>
          <a className="text-link spotlight__more" href="#shop" onClick={() => onFilter(product.category)}>
            See all bettas<Icon name="arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
