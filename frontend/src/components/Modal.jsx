function Modal({ children, onClose }) {
  return (
    <div className="modal open">
      <div className="modal-card">
        {children}
        <button className="close-modal" type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
