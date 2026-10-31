import { PRODUCTS } from '../data/products.js';
import { REVIEWS } from '../data/content.js';
import FishImage from './FishImage.jsx';
import Icon from './Icon.jsx';
import Waves from './Waves.jsx';

const LOOP = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];
// Summary is computed from the reviews shown, so it can never disagree with them.
const AVERAGE = REVIEWS.reduce((n, r) => n + r.rating, 0) / REVIEWS.length;

const Stars = ({ rating, className = 'review__stars' }) => (
  <p className={className} aria-label={`Rated ${rating} out of 5`}>
    {Array.from({ length: 5 }, (_, n) => <Icon key={n} name="star" className="review__star" filled={n < Math.round(rating)} />)}
  </p>
);

export default function Reviews() {
  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <Waves className="waves--reviews" />
      <div className="reviews__inner">
        <div className="section-head reviews__head" data-reveal>
          <div>
            <p className="eyebrow">Happy tanks</p>
            <h2 className="section-title" id="reviews-title">Kept by people who care</h2>
          </div>
          <div className="reviews__score">
            <p className="reviews__avg">{AVERAGE.toFixed(1)}<span>/ 5</span></p>
            <div>
              <Stars rating={AVERAGE} className="review__stars reviews__score-stars" />
              <p className="reviews__count">Average from {REVIEWS.length} keeper reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee: the set is repeated 4x and the track slides by half, so the loop is seamless.
          Only the first copy is exposed to assistive tech. */}
      <div className="reviews__marquee">
        <ul className="reviews__track">
          {LOOP.map((r, i) => {
            const product = PRODUCTS.find((p) => p.id === r.productId);
            const copy = i >= REVIEWS.length;
            return (
              <li key={i} className={`review${copy ? ' review--copy' : ''}`} aria-hidden={copy || undefined}>
                <span className="review__mark" aria-hidden="true">“</span>
                <Stars rating={r.rating} />
                <blockquote className="review__quote"><p>{r.quote}</p></blockquote>
                <div className="review__by">
                  <span className="review__fish"><FishImage product={product} /></span>
                  <span className="review__who">
                    <span className="review__name">{r.name}</span>
                    <span className="review__meta">{r.place}</span>
                  </span>
                </div>
                <p className="review__bought"><Icon name="bag" />Bought the {product.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
