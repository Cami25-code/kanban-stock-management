import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './AccountSheet.css';

/**
 * AccountSheet — bottom sheet for account actions.
 *
 * Props:
 *   isOpen    boolean              — controlled by caller
 *   user      { name, email }
 *   onSelect  (key) => void        — key ∈ { profile, settings, logout }
 *   onClose   () => void
 *
 * Rendered via createPortal(…, document.body) to escape any flex
 * containing-block (same Safari iOS fix as BottomTabBar).
 */
function AccountSheet({ isOpen = false, user = {}, onSelect, onClose }) {
  const touchStartY = useRef(null);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setDragY(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { setDragY(0); onClose?.(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  function handleClose() { setDragY(0); onClose?.(); }
  function handleSelect(key) { onSelect?.(key); handleClose(); }

  function onTouchStart(e) { touchStartY.current = e.touches[0].clientY; }
  function onTouchMove(e) {
    if (touchStartY.current == null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    setDragY(delta > 0 ? delta : 0);
  }
  function onTouchEnd() {
    if (dragY > 80) { handleClose(); } else { setDragY(0); }
    touchStartY.current = null;
  }

  if (!isOpen) return null;

  const entries = [
    {
      key: 'settings',
      label: 'Settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68 1.65 1.65 0 0 0 10 3.17V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      key: 'logout',
      label: 'Log Out',
      danger: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      ),
    },
  ];

  return createPortal(
    <div className="acs" role="dialog" aria-modal="true" aria-label="Account">
      <button type="button" className="acs__overlay" aria-label="Close" onClick={handleClose} />
      <div
        className="acs__panel"
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragY ? 'none' : undefined,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="acs__handle">
          <span className="acs__grabber" aria-hidden="true" />
          <button type="button" className="acs__close" aria-label="Close" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <header className="acs__header">
          <p className="acs__name">{user.name}</p>
          <p className="acs__email">{user.email}</p>
        </header>

        <ul className="acs__list">
          {entries.map((entry) => (
            <li key={entry.key}>
              <button
                type="button"
                className={`acs__entry${entry.danger ? ' acs__entry--danger' : ''}`}
                onClick={() => handleSelect(entry.key)}
              >
                <span className="acs__entry-icon" aria-hidden="true">{entry.icon}</span>
                <span className="acs__entry-label">{entry.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
}

export default AccountSheet;
