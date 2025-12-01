import styles from './PetrodollariCard.module.css';

export default function PetrodollariCard({ petrodollari, previousTurnPetrodollari }) {
  // Calcola la crescita percentuale rispetto al turno precedente
  const calculateGrowth = () => {
    if (previousTurnPetrodollari === 0 || previousTurnPetrodollari === petrodollari) {
      return 0;
    }
    const growth = ((petrodollari - previousTurnPetrodollari) / previousTurnPetrodollari) * 100;
    return Math.round(growth);
  };

  const growthPercentage = calculateGrowth();
  const isPositive = growthPercentage > 0;
  const isNegative = growthPercentage < 0;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Petrodollari</h3>
      <div className={styles.value}>{petrodollari} $</div>
      {growthPercentage !== 0 && (
        <div className={`${styles.growthIndicator} ${isPositive ? styles.positive : isNegative ? styles.negative : ''}`}>
          {isPositive ? '+' : ''}{growthPercentage}%
        </div>
      )}
    </div>
  );
}
