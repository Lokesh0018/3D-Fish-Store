import { useState } from 'react';
import Icon from './Icon.jsx';

// Product photo (fades in once loaded), or a "photo coming soon" placeholder when `image` is unset.
// Fills its (position: relative) container. Pass `eager` for images inside panels that open later.
export default function FishImage({ product, eager = false }) {
  const [loaded, setLoaded] = useState(false);

  if (product.image) {
    return (
      <img className={`fish-img${loaded ? ' is-loaded' : ''}`} src={product.image} alt={product.name}
        loading={eager ? 'eager' : 'lazy'} decoding="async" onLoad={() => setLoaded(true)} />
    );
  }
  return (
    <span className="fish-img fish-img--empty" role="img" aria-label={`${product.name}, photo coming soon`}>
      <Icon name="image" />
    </span>
  );
}
