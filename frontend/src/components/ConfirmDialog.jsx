import "./ConfirmDialog.css";

function ConfirmDialog({ isOpen, title, description, confirmLabel = "Xóa", onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" role="presentation" onMouseDown={onClose}>
      <section className="confirm-dialog ds-card" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
        <span className="confirm-dialog__icon"><i className="fa-solid fa-trash" /></span>
        <h2 id="confirm-title">{title}</h2>
        <p>{description}</p>
        <div><button className="ds-button ds-button--secondary" type="button" onClick={onClose}>Hủy bỏ</button><button className="ds-button ds-button--danger confirm-dialog__danger" type="button" onClick={onConfirm}>{confirmLabel}</button></div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
