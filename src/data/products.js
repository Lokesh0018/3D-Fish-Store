// Set `image` to a photo URL (or an import from src/assets) for each fish; until then a placeholder shows.
export const PRODUCTS = [
  {
    id: 'kohaku', name: 'Kohaku', category: 'koi', price: 180, size: 18, age: '1 yr',
    tag: 'Best seller',
    blurb: 'Snow-white body with deep, even hi (red) markings. The classic koi.',
    image: null,
  },
  {
    id: 'sanke', name: 'Taisho Sanke', category: 'koi', price: 220, size: 20, age: '1 yr',
    blurb: 'Kohaku pattern accented with small black sumi on the back.',
    image: null,
  },
  {
    id: 'showa', name: 'Showa Sanshoku', category: 'koi', price: 260, size: 22, age: '2 yr',
    tag: 'Show grade',
    blurb: 'Bold black base wrapped in red and white. Dramatic in any pond.',
    image: null,
  },
  {
    id: 'tancho', name: 'Tancho', category: 'koi', price: 240, size: 17, age: '1 yr',
    blurb: 'Pure white with a single round crimson crown. Highly prized.',
    image: null,
  },
  {
    id: 'yamabuki', name: 'Yamabuki Ogon', category: 'koi', price: 140, size: 20, age: '1 yr',
    tag: 'Beginner friendly',
    blurb: 'Metallic gold from nose to tail. Hardy, bold and quick to hand-feed.',
    image: null,
  },
  {
    id: 'platinum', name: 'Platinum Ogon', category: 'koi', price: 150, size: 19, age: '1 yr',
    blurb: 'Single-colour metallic white that glows under moonlight.',
    image: null,
  },
  {
    id: 'asagi', name: 'Asagi', category: 'koi', price: 190, size: 21, age: '2 yr',
    blurb: 'Blue-grey netted back over warm orange flanks. An ancient variety.',
    image: null,
  },
  {
    id: 'chagoi', name: 'Chagoi', category: 'koi', price: 120, size: 24, age: '2 yr',
    tag: 'Gentle giant',
    blurb: 'Tea-brown and famously friendly — often the first to greet you.',
    image: null,
  },
  {
    id: 'ryukin', name: 'Ryukin', category: 'goldfish', price: 38, size: 8, age: '6 mo',
    blurb: 'High-backed fancy goldfish with a flowing triple tail.',
    image: null,
  },
  {
    id: 'oranda', name: 'Oranda', category: 'goldfish', price: 45, size: 9, age: '8 mo',
    tag: 'New in',
    blurb: 'Pearl-white body crowned with a soft red wen.',
    image: null,
  },
  {
    id: 'comet', name: 'Comet', category: 'goldfish', price: 18, size: 10, age: '6 mo',
    blurb: 'Fast, slim and fiery orange. Thrives outdoors year-round.',
    image: null,
  },
  {
    id: 'shubunkin', name: 'Shubunkin', category: 'goldfish', price: 24, size: 10, age: '6 mo',
    blurb: 'Calico blue speckled with orange and ink — no two alike.',
    image: null,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All fish' },
  { id: 'koi', label: 'Koi' },
  { id: 'goldfish', label: 'Goldfish' },
];

export const FREE_SHIPPING_FROM = 250;
export const SHIPPING_FEE = 45;

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
