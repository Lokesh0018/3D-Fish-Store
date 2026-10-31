import { CATEGORIES } from '../data/products.js';
import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import OceanScene, { Surface } from './OceanScene.jsx';
import Waves from './Waves.jsx';

const EXPLORE = [
  { href: '#spotlight', label: 'Fish of the month' },
  { href: '#care', label: 'Our promise' },
  { href: '#journey', label: 'How it arrives' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
];
const PROMISES = [
  { icon: 'shield', label: 'Live arrival guarantee' },
  { icon: 'clock', label: '21-day quarantine' },
  { icon: 'truck', label: 'Overnight, Monday to Wednesday' },
];

export default function Footer({ onFilter }) {
  return (
    <footer className="footer" data-anim>
      <Waves className="waves--footer" continuous />
      <Surface />
      <OceanScene />
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="logo" href="#hero" aria-label="Finsmith, back to top"><Logo /></a>
            <p className="footer__tagline">Show-grade bettas and rare ornamentals, shipped live to your door.</p>
          </div>
          <a className="footer__up" href="#hero"><span>Back to top</span><Icon name="arrow" /></a>
        </div>

        <div className="footer__cols">
          <nav className="footer__col" aria-labelledby="ft-shop">
            <p className="footer__heading" id="ft-shop">Shop</p>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}><a href="#shop" onClick={() => onFilter?.(c.id)}>{c.label}</a></li>
              ))}
            </ul>
          </nav>
          <nav className="footer__col" aria-labelledby="ft-explore">
            <p className="footer__heading" id="ft-explore">Explore</p>
            <ul>
              {EXPLORE.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
            </ul>
          </nav>
          <div className="footer__col">
            <p className="footer__heading">Every order</p>
            <ul className="footer__promises">
              {PROMISES.map((p) => <li key={p.label}><Icon name={p.icon} />{p.label}</li>)}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__note">© {new Date().getFullYear()} Finsmith. Live fish ship within the contiguous US.</p>
        </div>
      </div>
    </footer>
  );
}
