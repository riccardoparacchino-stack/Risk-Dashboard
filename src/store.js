import { create } from "zustand";

// Catalogo carte di attacco (ordinate per prezzo)
const ATTACK_CARDS = [
  { id: "attacco-missilistico", name: "🚀 Attacco Missilistico", cost: 150, description: "3 dadi attacco, nessuna truppa" },
  { id: "assalto-lampo", name: "⚡ Assalto Lampo", cost: 180, description: "+1 attacco oltre il limite" },
  { id: "kamikaze", name: "💥 Kamikaze", cost: 200, description: "Attacca non adiacente con 1 truppa" },
  { id: "egemonia-aerea", name: "✈️ Egemonia Aerea", cost: 250, description: "Raddoppia i dadi di attacco" },
  { id: "paracadutisti", name: "🪂 Paracadutisti", cost: 250, description: "Attacca non adiacente con 1-5 truppe" },
  { id: "drang-nach-osten", name: "🗡️ Drang Nach Osten", cost: 300, description: "Attacco gratuito dopo conquista" },
  { id: "sabotaggio", name: "🔧 Sabotaggio", cost: 400, description: "Blocca 1 nemico per 1 turno, cooldown 3" },
  { id: "bomba-atomica", name: "☢️ Bomba Atomica", cost: 2000, description: "Attacco pesante, disponibile dal turno 5, cooldown 3" },
];

// Catalogo carte di difesa (ordinate per prezzo)
const DEFENSE_CARDS = [
  { id: "bunker", name: "🏰 Bunker", cost: 80, description: "x1.5 dadi difesa, max 3 per territorio" },
  { id: "mimetizzazione", name: "🌿 Mimetizzazione", cost: 120, description: "Il primo attacco di questo turno è annullato" },
  { id: "antiaerea", name: "🎯 Antiaerea", cost: 150, description: "Protegge 3 stati da attacchi aerei" },
  { id: "linea-del-piave", name: "🏔️ Linea del Piave", cost: 160, description: "Mantieni 1 truppa anche se sconfitto" },
  { id: "contromisure", name: "🛡️ Contromisure", cost: 200, description: "+1 dado di difesa" },
  { id: "resistenza", name: "💪 Resistenza", cost: 300, description: "Aggiungi 5 truppe a uno stato" },
  { id: "blocca-stato", name: "🔒 Blocca Stato", cost: 300, description: "Territorio invulnerabile per 1 turno" },
  { id: "iron-dome", name: "🛸 Iron Dome", cost: 800, description: "Blocca 1 territorio (800$) o continente (1500$)" },
];

export const useGameStore = create((set, get) => ({
  // Valuta e economia
  petrodollari: 20,
  economyLevel: 1,
  incomePerTurn: 20,
  growthPercentage: 20,
  previousTurnPetrodollari: 20,
  
  // Turni e attacchi
  currentTurn: 2,
  attacksLeft: 3,
  attacksUsed: 0,
  
  // Catalogo carte
  attackCards: ATTACK_CARDS,
  defenseCards: DEFENSE_CARDS,
  
  // Carte possedute (array di id)
  ownedCards: [],
  
  // Deck attivo (carte nel deck del giocatore)
  deck: [],
  
  // Carte schierate nel turno corrente
  deployedCards: [],
  
  // Funzioni economia
  addPetrodollari: (value) => 
    set((state) => ({ petrodollari: state.petrodollari + value })),
  
  spendPetrodollari: (cost) =>
    set((state) =>
      state.petrodollari >= cost
        ? { petrodollari: state.petrodollari - cost }
        : state
    ),
  
  upgradeEconomy: () =>
    set((state) => {
      const upgradeCost = state.economyLevel * 50;
      if (state.petrodollari >= upgradeCost) {
        const newLevel = state.economyLevel + 1;
        const newIncome = state.incomePerTurn + 10;
        const newGrowth = Math.min(state.growthPercentage + 5, 100);
        return {
          petrodollari: state.petrodollari - upgradeCost,
          economyLevel: newLevel,
          incomePerTurn: newIncome,
          growthPercentage: newGrowth,
        };
      }
      return state;
    }),
  
  updateGrowth: (percentage) =>
    set(() => ({ growthPercentage: percentage })),
  
  calculateGrowthPercentage: () =>
    set((state) => {
      if (state.previousTurnPetrodollari === 0) {
        return { growthPercentage: 0 };
      }
      const growth = ((state.petrodollari - state.previousTurnPetrodollari) / state.previousTurnPetrodollari) * 100;
      return { growthPercentage: Math.round(growth) };
    }),
  
  // Funzioni turni e attacchi
  useAttack: () =>
    set((state) =>
      state.attacksLeft > 0
        ? { 
            attacksLeft: state.attacksLeft - 1,
            attacksUsed: state.attacksUsed + 1,
          }
        : state
    ),
  
  skipTurn: () =>
    set((state) => {
      const newPetrodollari = state.petrodollari + state.incomePerTurn;
      return {
        previousTurnPetrodollari: state.petrodollari,
        attacksLeft: 3,
        attacksUsed: 0,
        currentTurn: state.currentTurn + 1,
        petrodollari: newPetrodollari,
      };
    }),
  
  incrementTurn: () =>
    set((state) => {
      const newPetrodollari = state.petrodollari + state.incomePerTurn;
      return {
        previousTurnPetrodollari: state.petrodollari,
        currentTurn: state.currentTurn + 1,
        attacksLeft: 3,
        attacksUsed: 0,
        petrodollari: newPetrodollari,
      };
    }),
  
  resetTurn: () =>
    set(() => ({
      attacksLeft: 3,
      attacksUsed: 0,
    })),
  
  // Funzioni carte
  buyCard: (cardId, cardType) =>
    set((state) => {
      // Trova la carta nel catalogo appropriato
      const catalog = cardType === 'attack' ? state.attackCards : state.defenseCards;
      const card = catalog.find(c => c.id === cardId);
      
      if (!card) return state;
      
      // Verifica se già posseduta
      if (state.ownedCards.includes(cardId)) return state;
      
      // Verifica fondi sufficienti
      if (state.petrodollari < card.cost) return state;
      
      return {
        petrodollari: state.petrodollari - card.cost,
        ownedCards: [...state.ownedCards, cardId],
        deck: [...state.deck, { id: cardId, type: cardType }],
      };
    }),
  
  isCardOwned: (cardId) => {
    return get().ownedCards.includes(cardId);
  },
  
  canAffordCard: (cardId, cardType) => {
    const state = get();
    const catalog = cardType === 'attack' ? state.attackCards : state.defenseCards;
    const card = catalog.find(c => c.id === cardId);
    return card ? state.petrodollari >= card.cost : false;
  },
  
  // Schiera carte selezionate
  deployCards: (cardIds) =>
    set((state) => ({
      deployedCards: [...state.deployedCards, ...cardIds],
    })),
  
  // Rimuovi carta schierata (elimina definitivamente)
  removeDeployedCard: (cardId) =>
    set((state) => ({
      deployedCards: state.deployedCards.filter(id => id !== cardId),
      ownedCards: state.ownedCards.filter(id => id !== cardId),
      deck: state.deck.filter(card => card.id !== cardId),
    })),
  
  // Resetta carte schierate (chiamare a fine turno)
  resetDeployedCards: () =>
    set(() => ({
      deployedCards: [],
    })),
}));
