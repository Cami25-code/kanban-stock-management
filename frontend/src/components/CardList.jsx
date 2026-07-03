import './CardList.css';

/**
 * CardList — conteneur vertical pour des <ListCard>.
 * Gère l'empilement + gap, l'état loading (skeletons) et l'état empty.
 * Ne recrée PAS d'en-tête de page ni de pagination (gérés côté app).
 *
 * Props:
 *   loading?      boolean    — affiche 4 cartes skeleton animées
 *   empty?        boolean    — affiche l'état vide
 *   emptyMessage? string     — message de l'état vide
 *   children                 — les <ListCard>
 */
function CardList({ loading, empty, emptyMessage = 'No items to display.', children }) {
  if (loading) {
    return (
      <div className="cardlist" aria-busy="true" aria-live="polite">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="cardlist__skeleton" key={i} aria-hidden="true">
            <div className="cardlist__skeleton-header">
              <span className="cardlist__skeleton-line cardlist__skeleton-line--title" />
              <span className="cardlist__skeleton-line cardlist__skeleton-line--pill" />
            </div>
            <div className="cardlist__skeleton-grid">
              <span className="cardlist__skeleton-line" />
              <span className="cardlist__skeleton-line" />
              <span className="cardlist__skeleton-line" />
              <span className="cardlist__skeleton-line" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="cardlist__empty" role="status">
        <svg
          className="cardlist__empty-icon"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
          <path d="M3 7l9 4 9-4" />
          <path d="M12 11v10" />
        </svg>
        <p className="cardlist__empty-message">{emptyMessage}</p>
      </div>
    );
  }

  return <div className="cardlist">{children}</div>;
}

export default CardList;
