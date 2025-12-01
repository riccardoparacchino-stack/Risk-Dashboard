import styles from './CardItem.module.css';

export default function CardItem({ 
  card, 
  isOwned, 
  canAfford, 
  onBuy 
}) {
  const isDisabled = isOwned || !canAfford;

  return (
    <div className={`${styles.card} ${isOwned ? styles.owned : ''}`}>
      <h3 className={styles.name}>{card.name}</h3>
      <p className={styles.description}>{card.description}</p>
      <div className={styles.footer}>
        <span className={styles.cost}>{card.cost} $</span>
        <button 
          className={`${styles.buyButton} ${isDisabled ? styles.disabled : ''}`}
          onClick={() => !isDisabled && onBuy(card)}
          disabled={isDisabled}
          aria-label={isOwned ? "Già posseduta" : canAfford ? "Acquista" : "Fondi insufficienti"}
        >
          {isOwned ? '✓' : '+'}
        </button>
      </div>
    </div>
  );
}

