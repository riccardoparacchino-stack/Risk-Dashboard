import styles from './CardItem.module.css';

export default function CardItem({ 
  card, 
  isOwned, 
  canAfford, 
  onClick 
}) {
  return (
    <div 
      className={`${styles.card} ${isOwned ? styles.owned : ''}`}
      onClick={() => onClick(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(card)}
    >
      <h3 className={styles.name}>{card.name}</h3>
      <p className={styles.description}>{card.description}</p>
      <div className={styles.footer}>
        <span className={styles.cost}>{card.cost} $</span>
        <span className={styles.status}>
          {isOwned ? '✓' : canAfford ? '+' : '🔒'}
        </span>
      </div>
    </div>
  );
}

