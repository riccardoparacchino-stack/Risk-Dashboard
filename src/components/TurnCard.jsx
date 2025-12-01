import { useEffect } from "react";
import confetti from "canvas-confetti";
import styles from './TurnCard.module.css';

export default function TurnCard({ 
  currentTurn, 
  attacksUsed, 
  attacksLeft, 
  onAttack, 
  onSkipTurn,
  shouldTriggerConfetti = false
}) {
  const totalAttacks = 3;
  const attackIcons = Array.from({ length: totalAttacks }, (_, i) => {
    return i < attacksUsed;
  });

  const handleAttack = () => {
    if (attacksLeft > 0) {
      const reward = Math.floor(Math.random() * 31);
      onAttack(reward);
    }
  };

  useEffect(() => {
    if (shouldTriggerConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      });
    }
  }, [shouldTriggerConfetti]);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Turno {currentTurn}</h2>
      <p className={styles.attacksLabel}>I tuoi attacchi ({attacksUsed}/{totalAttacks})</p>
      
      <div className={styles.attackIndicators}>
        {attackIcons.map((used, index) => (
          <div
            key={index}
            className={`${styles.attackIcon} ${used ? styles.used : styles.available}`}
          >
            ⚔️
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.btnPrimary}
          onClick={handleAttack}
          disabled={attacksLeft <= 0}
        >
          Attacca
        </button>
        <button 
          className={styles.btnSecondary}
          onClick={onSkipTurn}
        >
          Salta turno
        </button>
      </div>
    </div>
  );
}
