import { useEffect, useState } from "react";
import styles from './CardDetailModal.module.css';

export default function CardDetailModal({ 
  isOpen, 
  onClose, 
  onBuy,
  onDeploy,
  card,
  cardType,
  canAfford,
  isOwned,
  isDeployed
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    setImageError(false);
  }, [card]);

  if (!isOpen || !card) return null;

  const typeLabel = cardType === 'attack' ? 'Attacco' : 'Difesa';
  const canDeploy = isOwned && !isDeployed;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {/* Immagine carta */}
        <div className={styles.imageContainer}>
          {!imageError ? (
            <img 
              src={card.image} 
              alt={card.name}
              className={styles.cardImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span className={styles.placeholderEmoji}>{card.name.split(' ')[0]}</span>
            </div>
          )}
        </div>

        <div className={styles.header}>
          <span className={`${styles.badge} ${cardType === 'attack' ? styles.attack : styles.defense}`}>
            {typeLabel}
          </span>
          {isOwned && (
            <span className={styles.ownedBadge}>Posseduta</span>
          )}
        </div>
        
        <h2 className={styles.title}>{card.name}</h2>
        
        <p className={styles.description}>{card.description}</p>
        
        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>Costo:</span>
          <span className={styles.priceValue}>{card.cost} $</span>
        </div>

        {!isOwned && !canAfford && (
          <p className={styles.warning}>Fondi insufficienti per acquistare questa carta</p>
        )}

        {isDeployed && (
          <p className={styles.info}>Questa carta è già schierata in questo turno</p>
        )}

        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Chiudi
          </button>
          
          {!isOwned && (
            <button 
              className={styles.btnPrimary} 
              onClick={onBuy}
              disabled={!canAfford}
            >
              Compra
            </button>
          )}
          
          {canDeploy && (
            <button 
              className={styles.btnSuccess} 
              onClick={onDeploy}
            >
              Schiera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

