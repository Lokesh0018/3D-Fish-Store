// Hand-drawn SVG craft for the footer ocean scene. Everything is drawn facing right
// (CSS flips the ones heading left). Gradient ids are prefixed "fs-" and each piece is rendered once.

// Shared fish emblem (logo mark) used on the funnel and submarine.
const EMBLEM = 'M13 16C10 11.5 6.5 7 3.2 6.6C1.4 10.5 1.4 21.5 3.2 25.4C6.5 25 10 20.5 13 16ZM14.2 11.4C15 7.4 18.6 5.6 22.4 6.6C20.6 7.8 19.6 9 19.2 10.4ZM14.6 20.6C15.6 24.4 18 26 20.6 25.6C19.6 24.2 19.2 22.8 19.2 21.6ZM28.4 15.6C28.4 12.2 24.4 10 19.8 10C16 10 13.2 12.4 11.6 16C13.2 19.6 16 22 19.8 22C24.4 22 28.4 19.2 28.4 15.6Z';

// Ribbed container: body + vertical corrugation lines.
const Box = ({ x, y, w, h, c }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={c} />
    <path d={Array.from({ length: Math.floor(w / 3) - 1 }, (_, i) => `M${x + 3 + i * 3} ${y + 1.2}v${h - 2.4}`).join('')}
      stroke="#000" strokeOpacity=".18" strokeWidth=".6" />
    <rect x={x} y={y} width={w} height={h} fill="none" stroke="#000" strokeOpacity=".3" strokeWidth=".6" />
  </g>
);

export const Ship = () => (
  <svg viewBox="0 0 200 84">
    <defs>
      <linearGradient id="fs-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2c27" /><stop offset="1" stopColor="#120d0b" /></linearGradient>
      <linearGradient id="fs-cream" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor="#e2d8c6" /></linearGradient>
    </defs>
    <g className="smoke"><circle cx="37" cy="9" r="4" /><circle cx="37" cy="9" r="5" /><circle cx="37" cy="9" r="4.5" /></g>
    {/* radar mast */}
    <path d="M24 26V10M19 13h10M24 10l-4-4M24 10l4-4" stroke="#17110f" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    <rect x="19" y="5" width="10" height="2.2" rx="1" fill="#17110f" className="radar" />
    {/* funnel */}
    <path d="M32 14h11l1.5 14H30.5z" fill="var(--red)" />
    <rect x="31.6" y="14" width="11.8" height="3" fill="#17110f" />
    <path d={EMBLEM} transform="translate(32.8 18.2) scale(.29)" fill="var(--cream)" />
    {/* bridge (three decks) */}
    <rect x="12" y="26" width="40" height="8" rx="1.5" fill="url(#fs-cream)" />
    <rect x="9" y="33" width="46" height="8" rx="1" fill="url(#fs-cream)" />
    <rect x="9" y="40" width="46" height="9" fill="url(#fs-cream)" />
    <path d="M10 33h44M10 40h44" stroke="#17110f" strokeOpacity=".25" strokeWidth=".6" />
    {[14, 20, 26, 32, 38, 44].map((x) => <rect key={x} x={x} y="28" width="4" height="3" rx=".6" fill="#1d4a55" />)}
    {[12, 18, 24, 30, 36, 42, 48].map((x) => <rect key={x} x={x} y="35.4" width="3.4" height="2.4" rx=".5" fill="#1d4a55" />)}
    {/* lifeboat */}
    <rect x="40" y="42" width="13" height="4.6" rx="2.3" fill="#e86a1a" /><path d="M41 44.2h11" stroke="#fff" strokeOpacity=".6" strokeWidth=".7" />
    {/* containers: two tiers */}
    <Box x={60} y={39} w={24} h={10} c="var(--red)" /><Box x={85} y={39} w={24} h={10} c="#2f8e98" />
    <Box x={110} y={39} w={24} h={10} c="#e7dcc6" /><Box x={135} y={39} w={24} h={10} c="#1d4a55" />
    <Box x={160} y={39} w={18} h={10} c="#d9a441" />
    <Box x={66} y={29} w={24} h={10} c="#d9a441" /><Box x={91} y={29} w={24} h={10} c="var(--red)" />
    <Box x={116} y={29} w={24} h={10} c="#2f8e98" /><Box x={141} y={29} w={20} h={10} c="#e7dcc6" />
    {/* bow mast + flag */}
    <path d="M186 49V30" stroke="#17110f" strokeWidth="1.2" />
    <path className="flag" d="M186 30h9l-2 3 2 3h-9z" fill="var(--red)" />
    {/* hull */}
    <path d="M4 49h182c6 0 9-1 12-4l-9 26c-1 3-3 5-7 5H20c-6 0-9-2-11-6z" fill="url(#fs-hull)" />
    <path d="M4 49h182c6 0 9-1 12-4" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth=".8" />
    <path d="M8.5 68l180 0-2.4 5.3c-.8 1.8-2.4 2.7-4.6 2.7H20c-5 0-8-1.6-10-4.4z" fill="var(--red)" />
    <path d="M8 66.6h181" stroke="var(--cream)" strokeWidth="1.2" />
    {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={18 + i * 7.6} cy="57" r="1.1" fill="var(--cream)" opacity=".75" />)}
    {/* anchor */}
    <path d="M176 54v6m-3 0c0 2 6 2 6 0m-3-6h-2m4 0h-2" stroke="var(--cream)" strokeWidth="1" fill="none" strokeLinecap="round" opacity=".8" />
  </svg>
);

export const Sailboat = () => (
  <svg viewBox="0 0 120 92">
    <defs>
      <linearGradient id="fs-main" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e8dfcf" /><stop offset="1" stopColor="#fffaf0" /></linearGradient>
      <linearGradient id="fs-jib" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#2a7f88" /><stop offset="1" stopColor="#3aa3ad" /></linearGradient>
      <linearGradient id="fs-redhull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c90d16" /><stop offset="1" stopColor="#7d0309" /></linearGradient>
    </defs>
    {/* mast, boom, pennant */}
    <path d="M58 6v62" stroke="#17110f" strokeWidth="2" strokeLinecap="round" />
    <path d="M58 62h36" stroke="#17110f" strokeWidth="1.6" strokeLinecap="round" />
    <path className="flag" d="M58 6l10 2.4L58 11z" fill="var(--red)" />
    {/* mainsail with a slight belly and seams */}
    <path d="M60 9C76 26 86 44 92 60H60z" fill="url(#fs-main)" stroke="#17110f" strokeOpacity=".5" strokeWidth=".8" />
    <path d="M60 22c8 1 14 2 20 3M60 35c10 1 18 2 25 3M60 48c11 1 20 2 29 2.5" stroke="#17110f" strokeOpacity=".15" strokeWidth=".7" fill="none" />
    {/* jib */}
    <path d="M56 12C46 30 36 48 26 64h30z" fill="url(#fs-jib)" />
    <path d="M56 28c-6 1-11 2-16 3M56 44c-7 1-14 2-20 3" stroke="#fff" strokeOpacity=".2" strokeWidth=".7" fill="none" />
    {/* rigging */}
    <path d="M58 8L14 66M58 8l52 58" stroke="#17110f" strokeOpacity=".45" strokeWidth=".6" />
    {/* cabin */}
    <path d="M44 62h22l4 6H40z" fill="var(--cream)" /><circle cx="50" cy="65.4" r="1.4" fill="#1d4a55" /><circle cx="56" cy="65.4" r="1.4" fill="#1d4a55" />
    {/* hull */}
    <path d="M6 68c20 3 74 3 108-2l-12 16c-2 2.6-5 4-9 4H24c-5 0-8-2-10-5z" fill="url(#fs-redhull)" />
    <path d="M9 71.5c22 2.6 70 2.6 101-1.6" stroke="var(--cream)" strokeWidth="1.4" fill="none" />
    <path d="M6 68c20 3 74 3 108-2" stroke="#fff" strokeOpacity=".35" strokeWidth=".8" fill="none" />
  </svg>
);

export const FishingBoat = () => (
  <svg viewBox="0 0 120 84">
    <defs>
      <linearGradient id="fs-fishhull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor="#d9cdb6" /></linearGradient>
    </defs>
    {/* mast, outrigger, rigging, buoy */}
    <path d="M78 8v52M78 18L108 44" stroke="#17110f" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M78 10l26 34M78 30l26 14" stroke="#17110f" strokeOpacity=".4" strokeWidth=".6" />
    <path d="M104 44v8" stroke="#17110f" strokeOpacity=".5" strokeWidth=".6" />
    <circle cx="104" cy="54" r="2.6" fill="#e86a1a" />
    <path className="flag" d="M78 8h10l-2.5 3 2.5 3H78z" fill="var(--red)" />
    {/* wheelhouse */}
    <rect x="40" y="30" width="32" height="24" rx="2" fill="url(#fs-fishhull)" stroke="#17110f" strokeOpacity=".35" strokeWidth=".7" />
    <path d="M38 30h36l-3-4H41z" fill="#17110f" />
    <rect x="44" y="34" width="8" height="7" rx="1" fill="#1d4a55" /><rect x="55" y="34" width="8" height="7" rx="1" fill="#1d4a55" />
    <rect x="66" y="34" width="4" height="7" rx="1" fill="#1d4a55" />
    <path d="M45 35l3 0M56 35l3 0" stroke="#fff" strokeOpacity=".5" strokeWidth=".8" />
    {/* radar dome + life ring */}
    <path d="M48 26a5 5 0 0 1 10 0z" fill="var(--cream)" stroke="#17110f" strokeOpacity=".4" strokeWidth=".6" />
    <circle cx="48" cy="47.5" r="4" fill="none" stroke="var(--red)" strokeWidth="2.4" />
    <circle cx="48" cy="47.5" r="4" fill="none" stroke="var(--cream)" strokeWidth="2.4" strokeDasharray="3 3.3" />
    {/* hull */}
    <path d="M4 54h98c5 0 9-2 12-5l-8 24c-1 3-3 5-7 5H20c-6 0-9-2-11-6z" fill="url(#fs-fishhull)" />
    <path d="M6 61h104" stroke="var(--red)" strokeWidth="3" />
    <path d="M10 70h97l-1.4 3.4c-.9 2.4-2.7 3.6-5.6 3.6H20c-5 0-8-1.6-10-4z" fill="#17110f" />
    <circle cx="22" cy="57.4" r="1.2" fill="#1d4a55" /><circle cx="30" cy="57.4" r="1.2" fill="#1d4a55" />
  </svg>
);

export const Submarine = () => (
  <svg viewBox="0 0 230 96">
    <defs>
      <linearGradient id="fs-subhull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e3343b" /><stop offset=".45" stopColor="#b0060e" /><stop offset="1" stopColor="#5e0207" />
      </linearGradient>
      <linearGradient id="fs-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffe2ba" stopOpacity=".35" /><stop offset="1" stopColor="#ffe2ba" stopOpacity="0" /></linearGradient>
      <radialGradient id="fs-port"><stop offset="0" stopColor="#fff3d6" /><stop offset=".6" stopColor="#ffc96b" /><stop offset="1" stopColor="#d98a2b" /></radialGradient>
    </defs>
    {/* searchlight beam */}
    <path d="M206 55L300 30v58z" fill="url(#fs-beam)" />
    {/* tail: rudder cross + shrouded propeller */}
    <path d="M28 40l-12-12h10l10 12zM28 70l-12 12h10l10-12z" fill="#7d0309" />
    <rect x="6" y="46" width="12" height="18" rx="3" fill="#2a1f1b" />
    <g className="sub-prop"><path d="M12 42v26M6 55h12" stroke="#c9b9a0" strokeWidth="3" strokeLinecap="round" /></g>
    <rect x="16" y="50" width="8" height="10" fill="#2a1f1b" />
    {/* conning tower, dive planes, periscope, antenna */}
    <path d="M96 64V36h7" stroke="#17110f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M118 30V16m0 0h7" stroke="#17110f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <rect x="124" y="13" width="5" height="6" rx="1.2" fill="#17110f" /><circle cx="128" cy="16" r="1.2" fill="#9fe0df" />
    <path d="M104 26c0-4 3-6 7-6h22c5 0 8 3 9 8l2 10H102z" fill="url(#fs-subhull)" />
    <path d="M100 32h-12l4 4h8zM144 32h12l-4 4h-8z" fill="#7d0309" />
    <rect x="110" y="26" width="5" height="4" rx="1" fill="#1d4a55" /><rect x="118" y="26" width="5" height="4" rx="1" fill="#1d4a55" /><rect x="126" y="26" width="5" height="4" rx="1" fill="#1d4a55" />
    {/* hull */}
    <path d="M22 54c0-12 10-18 26-18h132c18 0 30 8 30 19s-12 19-30 19H48c-16 0-26-7-26-20z" fill="url(#fs-subhull)" />
    <path d="M30 46c10-6 30-7 50-7h96c14 0 24 3 30 8" stroke="#fff" strokeOpacity=".28" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M60 37v37M150 37v37M190 40v31" stroke="#000" strokeOpacity=".22" strokeWidth=".8" />
    <path d="M26 62h184" stroke="var(--cream)" strokeWidth="2.4" />
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={36 + i * 11} cy="66.5" r=".8" fill="#000" opacity=".35" />)}
    {/* emblem */}
    <path d={EMBLEM} transform="translate(160 41) scale(.5)" fill="var(--cream)" />
    {/* portholes */}
    {[72, 96, 120].map((x) => (
      <g key={x}><circle cx={x} cy="51" r="6.4" fill="#2a1f1b" /><circle className="sub-port" cx={x} cy="51" r="4.6" fill="url(#fs-port)" />
        <path d={`M${x - 2.4} ${49.2}a3 3 0 0 1 3-2`} stroke="#fff" strokeOpacity=".8" strokeWidth="1" fill="none" strokeLinecap="round" /></g>
    ))}
    {/* searchlight housing */}
    <path d="M200 49h6c2 0 3 2.6 3 6s-1 6-3 6h-6z" fill="#2a1f1b" /><rect x="205" y="51" width="3" height="8" rx="1" fill="#ffe2ba" />
  </svg>
);

export const Diver = () => (
  <svg viewBox="0 0 190 70">
    <defs>
      <linearGradient id="fs-tank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd36b" /><stop offset=".5" stopColor="#e2a52b" /><stop offset="1" stopColor="#9c6a12" /></linearGradient>
      <linearGradient id="fs-torch" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff3d6" stopOpacity=".55" /><stop offset="1" stopColor="#fff3d6" stopOpacity="0" /></linearGradient>
      <linearGradient id="fs-fin" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#2a7f88" /><stop offset="1" stopColor="#3fb3bd" /></linearGradient>
    </defs>
    {/* torch beam */}
    <path d="M160 40L240 20v44z" fill="url(#fs-torch)" />
    {/* legs + fins (each kicks from the hip) */}
    <g className="diver__leg diver__leg--a">
      <path d="M78 30L54 26 34 28" stroke="#1a1a1f" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M58 26.5l-6-.6" stroke="#3fb3bd" strokeWidth="8" />
      <path d="M36 25l-30-12 4 10-4 6 30 4z" fill="url(#fs-fin)" />
      <path d="M32 26L10 17M32 29L9 25" stroke="#000" strokeOpacity=".2" strokeWidth=".8" />
    </g>
    <g className="diver__leg diver__leg--b">
      <path d="M78 36L54 40 34 38" stroke="#121216" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M36 35l-30 2 4 7-4 8 30-9z" fill="url(#fs-fin)" />
      <path d="M32 38L9 39M32 41L9 48" stroke="#000" strokeOpacity=".2" strokeWidth=".8" />
    </g>
    {/* tank + valve */}
    <rect x="82" y="13" width="44" height="12" rx="6" fill="url(#fs-tank)" />
    <rect x="125" y="15.5" width="5" height="7" rx="1.4" fill="#4a4a50" /><circle cx="131" cy="19" r="2" fill="#4a4a50" />
    {/* torso, vest strap, weight belt */}
    <path d="M76 33h58" stroke="#1a1a1f" strokeWidth="15" strokeLinecap="round" />
    <path d="M108 26v14" stroke="#2f8e98" strokeWidth="3.2" />
    <path d="M86 26.5v13" stroke="var(--red)" strokeWidth="3.4" />
    <rect x="84.5" y="31" width="4" height="4" rx="1" fill="#c9b9a0" />
    {/* arm reaching forward with torch */}
    <path d="M126 36l18 4 12-1" stroke="#1a1a1f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M138 38.6l6 1.4" stroke="#3fb3bd" strokeWidth="6" />
    <rect x="153" y="36" width="9" height="5.4" rx="1.6" fill="#4a4a50" /><rect x="160.5" y="35.4" width="2.4" height="6.6" rx="1" fill="#fff3d6" />
    {/* head: hood, mask, regulator + hose */}
    <circle cx="142" cy="27" r="8.6" fill="#1a1a1f" />
    <rect x="144" y="21.6" width="9.6" height="7.4" rx="2.6" fill="#2f8e98" stroke="#121216" strokeWidth="1.4" />
    <path d="M146.4 23.6l3 0" stroke="#fff" strokeOpacity=".8" strokeWidth="1.2" strokeLinecap="round" />
    <rect x="148" y="30.4" width="5" height="4" rx="1.6" fill="#4a4a50" />
    <path d="M148 33c-6 4-14 2-17-6" stroke="#4a4a50" strokeWidth="1.6" fill="none" />
  </svg>
);
