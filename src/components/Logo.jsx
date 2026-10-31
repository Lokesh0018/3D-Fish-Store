import { useId } from 'react';

// Fish mark (same geometry as public/favicon.svg) + FINSMITH wordmark. The mark draws in currentColor
// with the eye cut out, so it sits on any background.
const FISH = 'M13 16C10 11.5 6.5 7 3.2 6.6C1.4 10.5 1.4 21.5 3.2 25.4C6.5 25 10 20.5 13 16ZM14.2 11.4C15 7.4 18.6 5.6 22.4 6.6C20.6 7.8 19.6 9 19.2 10.4ZM14.6 20.6C15.6 24.4 18 26 20.6 25.6C19.6 24.2 19.2 22.8 19.2 21.6ZM28.4 15.6C28.4 12.2 24.4 10 19.8 10C16 10 13.2 12.4 11.6 16C13.2 19.6 16 22 19.8 22C24.4 22 28.4 19.2 28.4 15.6Z';

export function LogoMark({ className = 'logo-mark' }) {
  const mask = `fish-eye${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} viewBox="1 4 30 24" aria-hidden="true">
      <mask id={mask}>
        <path d={FISH} fill="#fff" />
        <circle cx="23.9" cy="14.4" r="1.35" fill="#000" />
      </mask>
      <rect x="0" y="0" width="32" height="32" fill="currentColor" mask={`url(#${mask})`} />
    </svg>
  );
}

export default function Logo() {
  return <><LogoMark />FINSMITH<sup aria-hidden="true">®</sup></>;
}
