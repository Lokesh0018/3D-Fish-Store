import { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon.jsx';

// Themed single-select listbox (replaces the native <select>, whose option list can't be styled).
// Keyboard: arrows/Home/End move, Enter/Space pick, Escape/Tab close.
export default function SortMenu({ label, options, value, onChange }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const button = useRef(null);
  const list = useRef(null);
  const entries = Object.entries(options);
  const current = entries.findIndex(([key]) => key === value);

  useEffect(() => {
    if (!open) return;
    setActive(current);
    list.current?.focus();
    const onDown = (e) => { if (!root.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, current]);

  const pick = (i) => { onChange(entries[i][0]); setOpen(false); button.current.focus(); };

  const onButtonKey = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); setOpen(true); }
  };
  const onListKey = (e) => {
    const last = entries.length - 1;
    const moves = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last };
    if (e.key in moves) { e.preventDefault(); setActive(moves[e.key]); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); button.current.focus(); }
    else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div className={`sort${open ? ' is-open' : ''}`} ref={root}>
      <span className="sort__label" id={`${id}-label`}>{label}</span>
      <button type="button" className="sort__btn" ref={button} aria-haspopup="listbox" aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-btn`} id={`${id}-btn`} onClick={() => setOpen((o) => !o)} onKeyDown={onButtonKey}>
        {entries[current][1].label}
        <svg className="sort__caret" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" /></svg>
      </button>
      <ul className="sort__list" role="listbox" ref={list} tabIndex={-1} aria-labelledby={`${id}-label`} hidden={!open}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined} onKeyDown={onListKey}>
        {entries.map(([key, o], i) => (
          <li key={key} id={`${id}-opt-${i}`} role="option" aria-selected={key === value}
            className={`sort__opt${i === active ? ' is-active' : ''}`} onPointerEnter={() => setActive(i)} onClick={() => pick(i)}>
            {o.label}
            {key === value && <Icon name="check" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
