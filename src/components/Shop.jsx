import { useMemo, useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import ProductCard from './ProductCard.jsx';
import Waves from './Waves.jsx';
import SortMenu from './SortMenu.jsx';

const SORTS = {
  featured: { label: 'Featured', fn: null },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  size: { label: 'Size: largest first', fn: (a, b) => b.size - a.size },
};

const countFor = (id) => (id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === id).length);

export default function Shop({ filter, onFilter }) {
  const [sort, setSort] = useState('featured');

  const products = useMemo(() => {
    const list = PRODUCTS.filter((p) => filter === 'all' || p.category === filter);
    const fn = SORTS[sort].fn;
    return fn ? [...list].sort(fn) : list;
  }, [filter, sort]);

  return (
    <section className="shop" id="shop" aria-labelledby="shop-title">
      <Waves />
      <div className="shop__inner">
        <div className="section-head shop__head" data-reveal>
          <div>
            <p className="eyebrow">Fish ready to come home</p>
            <h2 className="section-title" id="shop-title">Collections</h2>
          </div>
          <p className="shop__lede">Hand-picked in small batches, never wholesale. Every fish clears a 21-day quarantine and ships overnight with a live arrival guarantee.</p>
        </div>

        <div className="shop__bar">
          <div className="chips" role="group" aria-label="Filter by type">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => onFilter(c.id)}>
                {c.label}<span className="chip__count" aria-hidden="true">{countFor(c.id)}</span>
              </button>
            ))}
          </div>
          <SortMenu label="Sort by" options={SORTS} value={sort} onChange={setSort} />
        </div>

        <p className="shop__count" aria-live="polite"><strong>{products.length}</strong> fish available</p>
        <ul className="grid">
          {products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </section>
  );
}
