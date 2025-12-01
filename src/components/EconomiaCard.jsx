import styles from './EconomiaCard.module.css';

export default function EconomiaCard({ economyLevel, incomePerTurn, onOpenUpgradeModal, petrodollari }) {
  const upgradeCost = economyLevel * 50;
  const canUpgrade = petrodollari >= upgradeCost;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Economia</h3>
        <span className={styles.levelBadge}>LV {economyLevel}</span>
      </div>
      <div className={styles.value}>{incomePerTurn} $/turno</div>
      <button 
        className={styles.upgradeButton}
        onClick={onOpenUpgradeModal}
        disabled={!canUpgrade}
      >
        Potenzia
      </button>
    </div>
  );
}
