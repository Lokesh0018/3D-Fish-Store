# Finsmith — Koi & Fish Store

React + Vite storefront with a real-time 3D koi hero (three.js).

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

- `src/assets/*.glb` — the koi model used by the hero
- `src/koi/KoiScene.js` — the swimming koi (GLB bake, spine shader, swim sim, pointer chase)
- `src/components/` — Hero, Nav, Shop, ProductCard, CartDrawer, CarePromise, Footer
- `src/cart/CartContext.jsx` — cart state, saved to localStorage
- `src/data/products.js` — catalogue, prices, shipping rules

Checkout is not connected to a payment backend.
