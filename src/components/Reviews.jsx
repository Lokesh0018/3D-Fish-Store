import { PRODUCTS } from '../data/products.js';
import { REVIEWS } from '../data/content.js';
import FishImage from './FishImage.jsx';
import Icon from './Icon.jsx';

export default function Reviews() {
  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="section-head" data-reveal>
        <p className="eyebrow">Happy ponds</p>
        <h2 className="section-title" id="reviews-title">Kept by people who care</h2>
      </div>
      <ul className="reviews__list">
        {REVIEWS.map((r, i) => {
          const product = PRODUCTS.find((p) => p.id === r.productId);
          return (
            <li key={r.name} className="review" data-reveal style={{ '--i': i }}>
              <p className="review__stars" aria-label={`Rated ${r.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, n) => <Icon key={n} name="star" className="review__star" filled={n < r.rating} />)}
              </p>
              <blockquote className="review__quote"><p>“{r.quote}”</p></blockquote>
              <div className="review__by">
                <span className="review__fish"><FishImage product={product} /></span>
                <span>
                  <span className="review__name">{r.name}</span>
                  <span className="review__meta">{r.place} · bought {product.name}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
