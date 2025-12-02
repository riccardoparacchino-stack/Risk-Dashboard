import styles from './DeployedCardsSection.module.css';

export default function DeployedCardsSection({ 
  deployedCards, 
  attackCards, 
  defenseCards, 
  onRemoveCard 
}) {
  // Ottieni i dettagli delle carte schierate
  const getCardDetails = (cardId) => {
    const attackCard = attackCards.find(c => c.id === cardId);
    if (attackCard) return { ...attackCard, type: 'attack' };
    
    const defenseCard = defenseCards.find(c => c.id === cardId);
    if (defenseCard) return { ...defenseCard, type: 'defense' };
    
    return null;
  };

  const deployedCardDetails = deployedCards
    .map(getCardDetails)
    .filter(Boolean);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Carte Schierate</h2>
      
      {deployedCardDetails.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🃏</span>
          <p className={styles.emptyText}>Non hai schierato carte</p>
        </div>
      ) : (
        <div className={styles.cardsList}>
          {deployedCardDetails.map((card) => (
            <div key={card.id} className={styles.deployedCard}>
              <div className={styles.cardInfo}>
                <span className={styles.cardName}>{card.name}</span>
                <span className={styles.cardDescription}>{card.description}</span>
              </div>
              <button 
                className={styles.removeButton}
                onClick={() => onRemoveCard(card.id)}
                aria-label="Rimuovi carta"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

