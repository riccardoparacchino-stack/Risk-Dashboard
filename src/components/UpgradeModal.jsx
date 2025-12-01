import { useEffect } from "react";
import styles from './UpgradeModal.module.css';

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  economyLevel,
  upgradeCost,
  newIncomePerTurn,
  currentIncomePerTurn
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

  const incomeIncrease = newIncomePerTurn - currentIncomePerTurn;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Potenzia Economia</h2>
        
        <div className={styles.price}>
          Costo: <span className={styles.priceValue}>{upgradeCost} $</span>
        </div>

        <div className={styles.benefits}>
          <h3 className={styles.benefitsTitle}>Vantaggi:</h3>
          <ul className={styles.benefitsList}>
            <li>Livello: {economyLevel} → {economyLevel + 1}</li>
            <li>Reddito per turno: +{incomeIncrease} $/turno</li>
            <li>Nuovo reddito: {newIncomePerTurn} $/turno</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Annulla
          </button>
          <button className={styles.btnPrimary} onClick={onConfirm}>
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}
