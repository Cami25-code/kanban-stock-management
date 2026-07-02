import { useEffect, useRef, useState } from 'react';
import './BottomTabBar.css';

/**
 * BottomTabBar — mobile-only navigation (hidden ≥ 768px via CSS).
 *
 * Props
 *   items       [{ key, label, icon, active }]  — main tabs
 *   onSelect    (key) => void                   — tab pressed
 *   moreItems   [{ key, label }]                — entries in the "Plus" sheet
 *   onSelectMore (key) => void                  — sheet entry pressed
 */
function BottomTabBar({ items = [], onSelect, moreItems = [], onSelectMore }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const touchStartY = useRef(null);
  const [dragY, setDragY] = useState(0);

  // Lock body scroll while the sheet is open + close on Escape
  useEffect(() => {
    if (!sheetOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => { if (e.key === 'Escape') closeSheet(); };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [sheetOpen]);

  function openSheet() { setDragY(0); setSheetOpen(true); }
  function closeSheet() { setSheetOpen(false); setDragY(0); }

  function handleTabClick(item) {
    if (item.key === 'more') { openSheet(); return; }
    onSelect?.(item.key);
  }

  function handleMoreClick(key) { onSelectMore?.(key); closeSheet(); }

  // Swipe-down to dismiss
  function onTouchStart(e) { touchStartY.current = e.touches[0].clientY; }
  function onTouchMove(e) {
    if (touchStartY.current == null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    setDragY(delta > 0 ? delta : 0);
  }
  function onTouchEnd() {
    if (dragY > 80) { closeSheet(); } else { setDragY(0); }
    touchStartY.current = null;
  }

  return (
    <>
      <nav className="btb" aria-label="Primary">
        <ul className="btb__list">
          {items.map((item) => {
            const isActive = item.key === 'more' ? sheetOpen : item.active;
            return (
              <li key={item.key} className="btb__item">
                <button
                  type="button"
                  className={`btb__tab${isActive ? ' btb__tab--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-haspopup={item.key === 'more' ? 'dialog' : undefined}
                  aria-expanded={item.key === 'more' ? sheetOpen : undefined}
                  onClick={() => handleTabClick(item)}
                >
                  <span className="btb__icon" aria-hidden="true">{item.icon}</span>
                  <span className="btb__label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {sheetOpen && (
        <div className="btb-sheet" role="dialog" aria-modal="true" aria-label="More">
          <button
            type="button"
            className="btb-sheet__overlay"
            aria-label="Close"
            onClick={closeSheet}
          />
          <div
            className="btb-sheet__panel"
            style={{
              transform: dragY ? `translateY(${dragY}px)` : undefined,
              transition: dragY ? 'none' : undefined,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="btb-sheet__header">
              <span className="btb-sheet__grabber" aria-hidden="true" />
              <button
                type="button"
                className="btb-sheet__close"
                aria-label="Close"
                onClick={closeSheet}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ul className="btb-sheet__list">
              {moreItems.map((m) => (
                <li key={m.key}>
                  <button
                    type="button"
                    className="btb-sheet__entry"
                    onClick={() => handleMoreClick(m.key)}
                  >
                    {m.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default BottomTabBar;
