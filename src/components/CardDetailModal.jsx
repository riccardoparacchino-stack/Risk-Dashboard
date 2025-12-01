import { useEffect } from "react";
import styles from './CardDetailModal.module.css';

export default function CardDetailModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  card,
  cardType,
  canAfford
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

  if (!isOpen || !card) return null;

  const typeLabel = cardType === 'attack' ? 'Attacco' : 'Difesa';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={`${styles.badge} ${cardType === 'attack' ? styles.attack : styles.defense}`}>
            {typeLabel}
          </span>
        </div>
        
        <h2 className={styles.title}>{card.name}</h2>
        
        <p className={styles.description}>{card.description}</p>
        
        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>Costo:</span>
          <span className={styles.priceValue}>{card.cost} $</span>
        </div>

        {!canAfford && (
          <p className={styles.warning}>Fondi insufficienti per acquistare questa carta</p>
        )}

        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Annulla
          </button>
          <button 
            className={styles.btnPrimary} 
            onClick={onConfirm}
            disabled={!canAfford}
          >
            Acquista
          </button>
        </div>
      </div>
    </div>
  );
}

