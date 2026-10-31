import { useEffect, useState } from 'react';
import { CartProvider } from './cart/CartContext.jsx';
import Hero from './components/Hero.jsx';
import Nav from './components/Nav.jsx';
import Ticker from './components/Ticker.jsx';
import Shop from './components/Shop.jsx';
import Spotlight from './components/Spotlight.jsx';
import CarePromise from './components/CarePromise.jsx';
import Journey from './components/Journey.jsx';
import Reviews from './components/Reviews.jsx';
import Faq from './components/Faq.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';

// Fades [data-reveal] blocks in as they scroll into view.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Pauses the looping CSS animations inside [data-anim] blocks while they are off screen.
function useAnimateInView() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
    }, { rootMargin: '100px 0px' });
    document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const [filter, setFilter] = useState('all');
  useReveal();
  useAnimateInView();

  return (
    <CartProvider>
      <Nav filter={filter} onFilter={setFilter} />
      <main>
        <Hero />
        <Ticker />
        <Shop filter={filter} onFilter={setFilter} />
        <Spotlight onFilter={setFilter} />
        <CarePromise />
        <Journey />
        <Reviews />
        <Faq />
        <Newsletter />
      </main>
      <Footer onFilter={setFilter} />
      <CartDrawer />
    </CartProvider>
  );
}
