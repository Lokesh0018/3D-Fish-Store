import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { PRODUCTS, FREE_SHIPPING_FROM, SHIPPING_FEE } from '../data/products.js';

const STORAGE_KEY = 'finsmith-cart';
const CartContext = createContext(null);

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const found = lines.find((l) => l.id === action.id);
      if (found) return lines.map((l) => (l.id === action.id ? { ...l, qty: Math.min(l.qty + 1, 20) } : l));
      return [...lines, { id: action.id, qty: 1 }];
    }
    case 'setQty':
      if (action.qty <= 0) return lines.filter((l) => l.id !== action.id);
      return lines.map((l) => (l.id === action.id ? { ...l, qty: Math.min(action.qty, 20) } : l));
    case 'remove':
      return lines.filter((l) => l.id !== action.id);
    case 'clear':
      return [];
    default:
      return lines;
  }
}

function loadLines() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((l) => PRODUCTS.some((p) => p.id === l.id) && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, loadLines);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch { /* storage unavailable */ }
  }, [lines]);

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.id) }));
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.product.price, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
    return {
      items, count, subtotal, shipping, total: subtotal + shipping,
      open, setOpen,
      add: (id) => dispatch({ type: 'add', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
