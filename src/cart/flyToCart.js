// Sends a copy of a product photo swimming along an arc into the nav cart button,
// then pops the cart count. Calls `done` when it lands (or right away if there is nothing to animate).
export function flyToCart(img, done) {
  const target = document.querySelector('.nav__cart');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!img || !target || reduce || !img.animate) { done(); bump(target); return; }

  const from = img.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const size = Math.min(from.width, from.height);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  // outer node carries the horizontal travel, inner node the vertical arc, so the path curves
  const outer = document.createElement('div');
  outer.className = 'fly';
  Object.assign(outer.style, { left: `${from.left + (from.width - size) / 2}px`, top: `${from.top + (from.height - size) / 2}px`, width: `${size}px`, height: `${size}px` });
  const inner = img.cloneNode();
  inner.removeAttribute('loading');
  inner.className = 'fly__fish';
  inner.alt = '';
  // keep a mirrored source mirrored in flight (independent `scale` composes with the animated transform)
  if (getComputedStyle(img).transform.startsWith('matrix(-1')) inner.style.scale = '-1 1';
  outer.appendChild(inner);
  document.body.appendChild(outer);

  // two phases: a short dive below the card (x barely moves), then a wiggling swim up into the cart
  const duration = 1150;
  const dive = Math.min(90, size * 0.35);
  outer.animate([
    { transform: 'translateX(0)', easing: 'ease-out' },
    { transform: `translateX(${dx * 0.04}px)`, offset: 0.34, easing: 'cubic-bezier(.45,0,.4,1)' },
    { transform: `translateX(${dx}px)` },
  ], { duration, fill: 'forwards' });
  const flight = inner.animate([
    { transform: 'translateY(0) scale(1) rotate(0)', opacity: 1, easing: 'ease-in' },
    { transform: `translateY(${dive * 0.25}px) scale(1.04) rotate(6deg)`, offset: 0.12, easing: 'ease-in-out' },
    { transform: `translateY(${dive}px) scale(.9) rotate(14deg)`, offset: 0.34, easing: 'cubic-bezier(.5,0,.6,1)' },
    { transform: `translateY(${dy * 0.35}px) scale(.62) rotate(-18deg)`, offset: 0.56, easing: 'ease-in-out' },
    { transform: `translateY(${dy * 0.7}px) scale(.38) rotate(-4deg)`, offset: 0.76, easing: 'ease-in-out' },
    { transform: `translateY(${dy * 0.9}px) scale(.2) rotate(-16deg)`, opacity: 0.9, offset: 0.9, easing: 'ease-in' },
    { transform: `translateY(${dy}px) scale(.08) rotate(-8deg)`, opacity: 0.6 },
  ], { duration, fill: 'forwards' });

  flight.onfinish = () => { outer.remove(); done(); bump(target); };
}

function bump(target) {
  const count = target?.querySelector('.nav__count');
  if (!count) return;
  count.classList.remove('is-bump');
  void count.offsetWidth; // restart the keyframes on rapid adds
  count.classList.add('is-bump');
}
