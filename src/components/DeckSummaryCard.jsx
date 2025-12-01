import styles from './DeckSummaryCard.module.css';

export default function DeckSummaryCard({ deck, onGoToDeck }) {
  const attackCount = deck.filter(card => card.type === 'attack').length;
  const defenseCount = deck.filter(card => card.type === 'defense').length;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Il tuo deck</h3>
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
