import './Modal.css';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
