import { useEffect } from "react";
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title,
  subtitle,
  confirmText = "Conferma",
  cancelText = "Annulla"
}) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        
        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}

        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={onClose}>
            {cancelText}
          </button>
          <button className={styles.btnPrimary} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

