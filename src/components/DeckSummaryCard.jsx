import { useGameStore } from '../store';
import styles from './DeckSummaryCard.module.css';

export default function DeckSummaryCard({ onGoToDeck }) {
  const { deployedCards, attackCards, defenseCards } = useGameStore();

  // Conta carte schierate per tipo
  const attackCount = deployedCards.filter(cardId => 
    attackCards.some(c => c.id === cardId)
  ).length;
  
  const defenseCount = deployedCards.filter(cardId => 
    defenseCards.some(c => c.id === cardId)
  ).length;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Carte schierate</h3>
        <button className={styles.button} onClick={onGoToDeck}>
          Vai al deck
        </button>
      </div>
      <div className={styles.counters}>
        <div className={styles.counter}>
          <span className={styles.counterIcon}>⚔️</span>
          <span className={styles.counterValue}>{attackCount}</span>
          <span className={styles.counterLabel}>Attacco</span>
        </div>
        <div className={styles.counter}>
          <span className={styles.counterIcon}>🛡️</span>
          <span className={styles.counterValue}>{defenseCount}</span>
          <span className={styles.counterLabel}>Difesa</span>
        </div>
      </div>
    </div>
  );
}
