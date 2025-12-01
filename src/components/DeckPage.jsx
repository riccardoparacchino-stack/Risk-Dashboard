import { useState } from "react";
import { useGameStore } from "../store";
import TabSwitch from "./TabSwitch";
import CardItem from "./CardItem";
import CardDetailModal from "./CardDetailModal";
import styles from './DeckPage.module.css';

export default function DeckPage({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('attack');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { 
    petrodollari, 
    attackCards, 
    defenseCards, 
    ownedCards,
    buyCard 
  } = useGameStore();

  const currentCards = activeTab === 'attack' ? attackCards : defenseCards;

  const handleCardClick = (card) => {
    if (!ownedCards.includes(card.id)) {
      setSelectedCard(card);
      setShowModal(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (selectedCard) {
      buyCard(selectedCard.id, activeTab);
      setShowModal(false);
      onShowToast?.(`${selectedCard.name} acquistata!`);
      setSelectedCard(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Deck</h1>
      
      <div className={styles.balanceCard}>
        <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className={styles.cardsGrid}>
          {currentCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              isOwned={ownedCards.includes(card.id)}
              canAfford={petrodollari >= card.cost}
              onBuy={handleCardClick}
            />
          ))}
        </div>
      </div>

      <CardDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPurchase}
        card={selectedCard}
        cardType={activeTab}
        canAfford={selectedCard ? petrodollari >= selectedCard.cost : false}
      />
    </div>
  );
}

