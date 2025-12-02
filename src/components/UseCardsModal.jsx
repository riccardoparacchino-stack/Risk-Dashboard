import { useEffect } from "react";
import styles from './UseCardsModal.module.css';

export default function UseCardsModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  ownedCards,
  attackCards,
  defenseCards,
  selectedCards,
  onToggleCard
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

  // Ottieni i dettagli delle carte possedute
  const getCardDetails = (cardId) => {
    const attackCard = attackCards.find(c => c.id === cardId);
    if (attackCard) return { ...attackCard, type: 'attack' };
    
    const defenseCard = defenseCards.find(c => c.id === cardId);
    if (defenseCard) return { ...defenseCard, type: 'defense' };
    
    return null;
  };

  const ownedCardDetails = ownedCards
    .map(getCardDetails)
    .filter(Boolean);

  const hasSelectedCards = selectedCards.length > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Seleziona le carte che vuoi schierare</h2>
        
        {ownedCardDetails.length === 0 ? (
          <p className={styles.emptyMessage}>Non hai carte da schierare. Acquista carte dallo shop!</p>
        ) : (
          <div className={styles.cardList}>
            {ownedCardDetails.map((card) => (
              <label key={card.id} className={styles.cardItem}>
                <input
                  type="checkbox"
                  checked={selectedCards.includes(card.id)}
                  onChange={() => onToggleCard(card.id)}
                  className={styles.checkbox}
                />
                <div className={styles.cardInfo}>
                  <span className={styles.cardName}>{card.name}</span>
                  <span className={styles.cardDescription}>{card.description}</span>
                </div>
                <span className={`${styles.typeBadge} ${card.type === 'attack' ? styles.attack : styles.defense}`}>
                  {card.type === 'attack' ? '⚔️' : '🛡️'}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={onClose}>
            Annulla
          </button>
          <button 
            className={styles.btnPrimary} 
            onClick={onConfirm}
            disabled={!hasSelectedCards}
          >
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}

