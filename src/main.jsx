import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Always start at the top on load/refresh: stop the browser restoring the old scroll position,
// and drop any section hash the menu left in the URL so it doesn't jump there either.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
