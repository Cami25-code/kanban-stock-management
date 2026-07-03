import './CardList.css';

/**
 * ListCard — carte générique pour transformer une ligne de tableau en carte (mobile-first).
 * Composant isolé : aucune logique métier, piloté uniquement par props.
 *
 * Props:
 *   title          string              libellé primaire (gras, wrap autorisé)
 *   badge?         { label, tone }     tone ∈ "positive"|"warning"|"negative"
 *   primaryValue?  string              alternative au badge (à droite si pas de badge)
 *   fields         [{ label, value }]  grille 2 colonnes
 *   footnote?      string              discret, en pied de carte
 *   actions?       [{ label, tone?, onClick }]
 *   onClick?       () => void          rend la carte focusable role=button
 */
function ListCard({ title, badge, primaryValue, fields = [], footnote, actions = [], onClick }) {
  const isInteractive = typeof onClick === 'function';

  function handleKeyDown(e) {
    if (!isInteractive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }

  function handleActionClick(e, action) {
    e.stopPropagation();
    if (typeof action.onClick === 'function') action.onClick();
  }

  const singleField = fields.length === 1;

  return (
    <div
      className={`listcard${isInteractive ? ' listcard--interactive' : ''}`}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div className="listcard__header">
        <h3 className="listcard__title">{title}</h3>
        {badge ? (
          <span className={`listcard__badge listcard__badge--${badge.tone}`}>{badge.label}</span>
        ) : primaryValue ? (
          <span className="listcard__primary-value">{primaryValue}</span>
        ) : null}
      </div>

      {fields.length > 0 && (
        <div className={`listcard__fields${singleField ? ' listcard__fields--single' : ''}`}>
          {fields.map((field, i) => (
            <div className="listcard__field" key={i}>
              <span className="listcard__field-label">{field.label}</span>
              <span className="listcard__field-value">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      {footnote && <p className="listcard__footnote">{footnote}</p>}

      {actions.length > 0 && (
        <div className="listcard__actions">
          {actions.map((action, i) => (
            <button
              type="button"
              key={i}
              className={`listcard__action${action.tone === 'negative' ? ' listcard__action--negative' : ''}`}
              onClick={(e) => handleActionClick(e, action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListCard;
