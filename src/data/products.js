// Product photos: background removed, centred on a transparent 1000×1000 canvas
// (cut out from the original f1–f10 photos; stored in src/assets/images/fish).
import crimsonHalfmoon from '../assets/images/fish/betta-red-blue-halfmoon.webp';
import mustardGas from '../assets/images/fish/betta-mustard-gas.webp';
import royalBlue from '../assets/images/fish/betta-royal-blue.webp';
import turquoise from '../assets/images/fish/betta-turquoise.webp';
import rose from '../assets/images/fish/betta-rose.webp';
import pastelBlush from '../assets/images/fish/betta-pastel-blush.webp';
import koiBetta from '../assets/images/fish/betta-koi.webp';
import silverAngel from '../assets/images/fish/angelfish-silver.webp';
import moorishIdol from '../assets/images/fish/moorish-idol.webp';
import eagleRay from '../assets/images/fish/spotted-eagle-ray.webp';

// size = body length in cm (disc width for the ray); tank = minimum recommended setup.
export const PRODUCTS = [
  {
    id: 'mustard-gas', name: 'Mustard Gas Halfmoon', category: 'betta', species: 'Betta splendens',
    water: 'Freshwater', care: 'Easy', tank: '5 gal heated',
    price: 48, size: 6, age: '5 mo', tag: 'Show grade',
    blurb: 'Deep blue body with sunlit mustard fins edged in blue — a classic, sought-after colour form.',
    image: mustardGas,
  },
  {
    id: 'crimson-halfmoon', name: 'Crimson Halfmoon', category: 'betta', species: 'Betta splendens',
    water: 'Freshwater', care: 'Easy', tank: '5 gal heated',
    price: 42, size: 6, age: '5 mo', tag: 'Best seller',
    blurb: 'Metallic blue scales under crimson fins rimmed in electric blue, opening to a full 180° spread.',
    image: crimsonHalfmoon,
  },
  {
    id: 'royal-blue', name: 'Royal Blue Halfmoon', category: 'betta', species: 'Betta splendens',
    water: 'Freshwater', care: 'Easy', tank: '5 gal heated',
    price: 36, size: 6, age: '4 mo', tag: 'Beginner friendly',
    blurb: 'Solid royal blue from nose to fin tips. Bold, curious and quick to recognise its keeper.',
    image: royalBlue,
  },
  {
    id: 'turquoise', name: 'Turquoise Halfmoon', category: 'betta', species: 'Betta splendens',
    water: 'Freshwater', care: 'Easy', tank: '5 gal heated',
    price: 40, size: 6, age: '5 mo', tag: 'New in',
    blurb: 'Pale turquoise fins like layered silk over a pearly body. Soft colour that glows under warm light.',
    image: turquoise,
  },
  {
    id: 'rose', name: 'Rose Halfmoon', category: 'betta', species: 'Betta splendens',
    water: 'Freshwater', care: 'Easy', tank: '5 gal heated',
    price: 44, size: 6, age: '5 mo',
    blurb: 'Coral-red body with a white saddle and rose-pink fins that billow like petals.',
    image: rose,
  },
  {
    id: 'koi-halfmoon', name: 'Koi Halfmoon', category: 'betta', species: 'Betta splendens',
    water: 'Freshwater', care: 'Easy', tank: '5 gal heated',
    price: 65, size: 6, age: '6 mo', tag: 'Rare colour',
    blurb: 'Pearl-white with koi-style patches of red-orange and black. Marble genes mean his pattern keeps shifting as he grows.',
    image: koiBetta,
  },
  {
    id: 'pastel-blush', name: 'Pastel Blush Halfmoon', category: 'betta', species: 'Betta splendens',
    water: 'Freshwater', care: 'Easy', tank: '5 gal heated',
    price: 46, size: 6, age: '5 mo',
    blurb: 'Opaque blush-pink body under layers of soft white and pink fins, with a faint blue-grey shimmer.',
    image: pastelBlush,
  },
  {
    id: 'silver-angel', name: 'Silver Angelfish', category: 'angelfish', species: 'Pterophyllum scalare',
    water: 'Freshwater', care: 'Moderate', tank: '30 gal tall',
    price: 22, size: 8, age: '4 mo', tag: 'Community',
    blurb: 'The classic angelfish: silver body, bold black bars and long trailing fins. Peaceful in a tall planted tank.',
    image: silverAngel,
  },
  {
    id: 'moorish-idol', name: 'Moorish Idol', category: 'marine', species: 'Zanclus cornutus',
    water: 'Saltwater', care: 'Expert', tank: '125 gal reef',
    price: 160, size: 12, age: 'Sub-adult', tag: 'Expert only',
    blurb: 'A reef icon in sunflower yellow and ink black. Needs a mature reef system and an experienced keeper.',
    image: moorishIdol,
  },
  {
    id: 'eagle-ray', name: 'Spotted Eagle Ray', category: 'marine', species: 'Aetobatus narinari',
    water: 'Saltwater', care: 'Expert', tank: 'Public-aquarium scale',
    price: 1850, size: 60, age: 'Juvenile', tag: 'Special order',
    blurb: 'A starfield of white spots across wide, gliding wings. For very large systems only — we confirm your setup before shipping.',
    image: eagleRay,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All fish' },
  { id: 'betta', label: 'Bettas' },
  { id: 'angelfish', label: 'Angelfish' },
  { id: 'marine', label: 'Marine' },
];

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const FREE_SHIPPING_FROM = 250;
export const SHIPPING_FEE = 45;

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
