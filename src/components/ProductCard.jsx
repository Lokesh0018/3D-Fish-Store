import { useEffect, useState } from 'react';
import { useCart } from '../cart/CartContext.jsx';
import { formatPrice } from '../data/products.js';
import FishImage from './FishImage.jsx';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <article className="card">
      <div className="card__art">
        {product.tag && <span className="card__tag">{product.tag}</span>}
        <FishImage product={product} />
      </div>
      <div className="card__body">
        <div className="card__row">
          <h3 className="card__name">{product.name}</h3>
          <p className="card__price">{formatPrice(product.price)}</p>
        </div>
        <p className="card__meta">{product.category === 'koi' ? 'Koi' : 'Goldfish'} · {product.size} cm · {product.age}</p>
        <p className="card__blurb">{product.blurb}</p>
        <button type="button" className="btn btn--ink card__add" onClick={() => { add(product.id); setAdded(true); }}>
          {added ? 'Added to cart' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}
