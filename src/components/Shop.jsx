import { useMemo, useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import ProductCard from './ProductCard.jsx';

const SORTS = {
  featured: { label: 'Featured', fn: null },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  size: { label: 'Size: largest first', fn: (a, b) => b.size - a.size },
};

export default function Shop({ filter, onFilter }) {
  const [sort, setSort] = useState('featured');

  const products = useMemo(() => {
    const list = PRODUCTS.filter((p) => filter === 'all' || p.category === filter);
    const fn = SORTS[sort].fn;
    return fn ? [...list].sort(fn) : list;
  }, [filter, sort]);

  return (
    <section className="shop" id="shop" aria-labelledby="shop-title">
      <div className="section-head">
        <p className="eyebrow">The collection</p>
        <h2 className="section-title" id="shop-title">Fish ready to come home</h2>
      </div>

      <div className="shop__bar">
        <div className="chips" role="group" aria-label="Filter by type">
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => onFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <label className="sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <p className="shop__count" aria-live="polite">{products.length} fish</p>
      <ul className="grid">
        {products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
      </ul>
    </section>
  );
}
