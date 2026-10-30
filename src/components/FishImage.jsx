import Icon from './Icon.jsx';

// Product photo, or a "photo coming soon" placeholder until `image` is set in data/products.js.
// Fills its (position: relative) container.
export default function FishImage({ product }) {
  if (product.image) {
    return <img className="fish-img" src={product.image} alt={product.name} loading="lazy" decoding="async" />;
  }
  return (
    <span className="fish-img fish-img--empty" role="img" aria-label={`${product.name}, photo coming soon`}>
      <Icon name="image" />
    </span>
  );
}
