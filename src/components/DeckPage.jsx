import { useState } from "react";
import { useGameStore } from "../store";
import DeployedCardsSection from "./DeployedCardsSection";
import TabSwitch from "./TabSwitch";
import CardItem from "./CardItem";
import CardDetailModal from "./CardDetailModal";
import UseCardsModal from "./UseCardsModal";
import ThemeToggle from "./ThemeToggle";
import styles from './DeckPage.module.css';

export default function DeckPage({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('attack');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUseCardsModal, setShowUseCardsModal] = useState(false);
  const [selectedCardsToUse, setSelectedCardsToUse] = useState([]);

  const { 
    petrodollari, 
    attackCards, 
    defenseCards, 
    ownedCards,
    deployedCards,
    buyCard,
    deployCards,
    removeDeployedCard
  } = useGameStore();

  const currentCards = activeTab === 'attack' ? attackCards : defenseCards;

  // Carte possedute ma non ancora schierate
  const availableCards = ownedCards.filter(id => !deployedCards.includes(id));

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

  // Gestione rimozione carta schierata
  const handleRemoveDeployedCard = (cardId) => {
    removeDeployedCard(cardId);
    onShowToast?.("Carta rimossa!");
  };

  // Gestione modale "Schiera carte"
  const handleOpenUseCards = () => {
    setSelectedCardsToUse([]);
    setShowUseCardsModal(true);
  };

  const handleCloseUseCards = () => {
    setShowUseCardsModal(false);
    setSelectedCardsToUse([]);
  };

  const handleToggleCardToUse = (cardId) => {
    setSelectedCardsToUse(prev => 
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleConfirmUseCards = () => {
    if (selectedCardsToUse.length > 0) {
      deployCards?.(selectedCardsToUse);
      setShowUseCardsModal(false);
      onShowToast?.("Carte schierate!");
      setSelectedCardsToUse([]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Deck</h1>
        <ThemeToggle />
      </div>
      
      {/* Sezione Carte Schierate */}
      <DeployedCardsSection
        deployedCards={deployedCards}
        attackCards={attackCards}
        defenseCards={defenseCards}
        onRemoveCard={handleRemoveDeployedCard}
      />

      {/* Sezione Mercato Carte */}
      <div className={styles.marketSection}>
        <h2 className={styles.sectionTitle}>Mercato Carte</h2>
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

      {/* Bottone sticky "Schiera carte" - solo se ci sono carte disponibili */}
      {availableCards.length > 0 && (
        <div className={styles.stickyButtonContainer}>
          <button className={styles.useCardsButton} onClick={handleOpenUseCards}>
            Schiera carte
          </button>
        </div>
      )}

      <CardDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPurchase}
        card={selectedCard}
        cardType={activeTab}
        canAfford={selectedCard ? petrodollari >= selectedCard.cost : false}
      />

      <UseCardsModal
        isOpen={showUseCardsModal}
        onClose={handleCloseUseCards}
        onConfirm={handleConfirmUseCards}
        ownedCards={availableCards}
        attackCards={attackCards}
        defenseCards={defenseCards}
        selectedCards={selectedCardsToUse}
        onToggleCard={handleToggleCardToUse}
      />
    </div>
  );
}
