import { useState } from "react";
import { useGameStore } from "./store";
import PetrodollariCard from "./components/PetrodollariCard";
import EconomiaCard from "./components/EconomiaCard";
import TurnCard from "./components/TurnCard";
import DeckSummaryCard from "./components/DeckSummaryCard";
import DeckPage from "./components/DeckPage";
import BottomNavigation from "./components/BottomNavigation";
import Toast from "./components/Toast";
import UpgradeModal from "./components/UpgradeModal";
import ConfirmModal from "./components/ConfirmModal";
import ThemeToggle from "./components/ThemeToggle";
import styles from "./App.module.css";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showEndTurnModal, setShowEndTurnModal] = useState(false);
  
  const {
    petrodollari,
    previousTurnPetrodollari,
    economyLevel,
    incomePerTurn,
    upgradeEconomy,
    currentTurn,
    attacksLeft,
    attacksUsed,
    useAttack,
    addPetrodollari,
    skipTurn,
    deck,
  } = useGameStore();

  const handleAttack = (reward) => {
    if (attacksLeft > 0) {
      addPetrodollari(reward);
      useAttack();
      // Mostra toast con il reward guadagnato
      setToastMessage(`+${reward} $ guadagnati`);
      setShowToast(true);
      // Trigger confetti animation
      setTriggerConfetti(true);
      setTimeout(() => setTriggerConfetti(false), 100);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
    setToastMessage("");
  };

  const handleShowToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleGoToDeck = () => {
    setCurrentView("deck");
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleOpenUpgradeModal = () => {
    setShowUpgradeModal(true);
  };

  const handleCloseUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  const handleConfirmUpgrade = () => {
    upgradeEconomy();
    setShowUpgradeModal(false);
  };

  const handleEndTurnClick = () => {
    setShowEndTurnModal(true);
  };

  const handleCloseEndTurnModal = () => {
    setShowEndTurnModal(false);
  };

  const handleConfirmEndTurn = () => {
    skipTurn();
    setShowEndTurnModal(false);
  };

  const upgradeCost = economyLevel * 50;
  const newIncomePerTurn = incomePerTurn + 10;

  if (currentView === "deck") {
    return (
      <div className={styles.app}>
        <DeckPage onShowToast={handleShowToast} />
        <BottomNavigation 
          currentView={currentView} 
          onNavigate={handleNavigate} 
        />
        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={handleCloseToast}
        />
      </div>
    );
  }

  if (currentView === "statistiche") {
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Statistiche</h1>
            <ThemeToggle />
          </div>
          <p>Funzionalità statistiche in sviluppo...</p>
          <button onClick={() => setCurrentView("dashboard")}>
            Torna al Dashboard
          </button>
        </div>
        <BottomNavigation 
          currentView={currentView} 
          onNavigate={handleNavigate} 
        />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <ThemeToggle />
        </div>
        
        <div className={styles.topCards}>
          <PetrodollariCard 
            petrodollari={petrodollari}
            previousTurnPetrodollari={previousTurnPetrodollari}
          />
          <EconomiaCard 
            economyLevel={economyLevel}
            incomePerTurn={incomePerTurn}
            onOpenUpgradeModal={handleOpenUpgradeModal}
            petrodollari={petrodollari}
          />
        </div>

        <TurnCard
          currentTurn={currentTurn}
          attacksUsed={attacksUsed}
          attacksLeft={attacksLeft}
          onAttack={handleAttack}
          onSkipTurn={handleEndTurnClick}
          shouldTriggerConfetti={triggerConfetti}
        />

        <DeckSummaryCard 
          deck={deck}
          onGoToDeck={handleGoToDeck}
        />
      </div>

      <BottomNavigation 
        currentView={currentView} 
        onNavigate={handleNavigate} 
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleCloseUpgradeModal}
        onConfirm={handleConfirmUpgrade}
        economyLevel={economyLevel}
        upgradeCost={upgradeCost}
        newIncomePerTurn={newIncomePerTurn}
        currentIncomePerTurn={incomePerTurn}
      />

      <ConfirmModal
        isOpen={showEndTurnModal}
        onClose={handleCloseEndTurnModal}
        onConfirm={handleConfirmEndTurn}
        title="Sei sicuro di voler passare il turno?"
      />
    </div>
  );
}
