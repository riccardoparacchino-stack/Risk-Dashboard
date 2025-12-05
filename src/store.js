import { create } from "zustand";
import { saveScore, saveGame, loadGame, updateGame } from "./supabaseClient";

// Catalogo carte di attacco (ordinate per prezzo)
const ATTACK_CARDS = [
  { id: "attacco-missilistico", name: "🚀 Attacco Missilistico", cost: 150, description: "3 dadi attacco, nessuna truppa", image: "/cards/attacco-missilistico.jpg" },
  { id: "assalto-lampo", name: "⚡ Assalto Lampo", cost: 180, description: "+1 attacco oltre il limite", image: "/cards/assalto-lampo.jpg" },
  { id: "kamikaze", name: "💥 Kamikaze", cost: 200, description: "Attacca non adiacente con 1 truppa", image: "/cards/kamikaze.jpg" },
  { id: "egemonia-aerea", name: "✈️ Egemonia Aerea", cost: 250, description: "Raddoppia i dadi di attacco", image: "/cards/egemonia-aerea.jpg" },
  { id: "paracadutisti", name: "🪂 Paracadutisti", cost: 250, description: "Attacca non adiacente con 1-5 truppe", image: "/cards/paracadutisti.jpg" },
  { id: "drang-nach-osten", name: "🗡️ Drang Nach Osten", cost: 300, description: "Attacco gratuito dopo conquista", image: "/cards/drang-nach-osten.jpg" },
  { id: "sabotaggio", name: "🔧 Sabotaggio", cost: 400, description: "Blocca 1 nemico per 1 turno, cooldown 3", image: "/cards/sabotaggio.jpg" },
  { id: "bomba-atomica", name: "☢️ Bomba Atomica", cost: 2000, description: "Attacco pesante, disponibile dal turno 5, cooldown 3", image: "/cards/bomba-atomica.jpg" },
];

// Catalogo carte di difesa (ordinate per prezzo)
const DEFENSE_CARDS = [
  { id: "bunker", name: "🏰 Bunker", cost: 80, description: "x1.5 dadi difesa, max 3 per territorio", image: "/cards/bunker.jpg" },
  { id: "mimetizzazione", name: "🌿 Mimetizzazione", cost: 120, description: "Il primo attacco di questo turno è annullato", image: "/cards/mimetizzazione.jpg" },
  { id: "antiaerea", name: "🎯 Antiaerea", cost: 150, description: "Protegge 3 stati da attacchi aerei", image: "/cards/antiaerea.jpg" },
  { id: "linea-del-piave", name: "🏔️ Linea del Piave", cost: 160, description: "Mantieni 1 truppa anche se sconfitto", image: "/cards/linea-del-piave.jpg" },
  { id: "contromisure", name: "🛡️ Contromisure", cost: 200, description: "+1 dado di difesa", image: "/cards/contromisure.jpg" },
  { id: "resistenza", name: "💪 Resistenza", cost: 300, description: "Aggiungi 5 truppe a uno stato", image: "/cards/resistenza.jpg" },
  { id: "blocca-stato", name: "🔒 Blocca Stato", cost: 300, description: "Territorio invulnerabile per 1 turno", image: "/cards/blocca-stato.jpg" },
  { id: "iron-dome", name: "🛸 Iron Dome", cost: 800, description: "Blocca 1 territorio (800$) o continente (1500$)", image: "/cards/iron-dome.jpg" },
];

export const useGameStore = create((set, get) => ({
  // Giocatore
  playerName: null,
  setPlayerName: (name) => set({ playerName: name }),
  
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
        deployedCards: [], // Reset carte schierate a fine turno
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
        deployedCards: [], // Reset carte schierate a fine turno
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
  
  // Ritira carta dal campo (rimane nell'inventario)
  undeployCard: (cardId) =>
    set((state) => ({
      deployedCards: state.deployedCards.filter(id => id !== cardId),
    })),
  
  // Resetta carte schierate (chiamare a fine turno)
  resetDeployedCards: () =>
    set(() => ({
      deployedCards: [],
    })),

  // ============ SUPABASE PERSISTENCE ============
  
  // Esporta lo stato corrente (per salvare su Supabase)
  getGameState: () => {
    const state = get();
    return {
      petrodollari: state.petrodollari,
      economyLevel: state.economyLevel,
      incomePerTurn: state.incomePerTurn,
      growthPercentage: state.growthPercentage,
      previousTurnPetrodollari: state.previousTurnPetrodollari,
      currentTurn: state.currentTurn,
      attacksLeft: state.attacksLeft,
      attacksUsed: state.attacksUsed,
      ownedCards: state.ownedCards,
      deck: state.deck,
      deployedCards: state.deployedCards,
    };
  },

  // Carica stato da Supabase
  loadGameState: (savedState) =>
    set(() => ({
      petrodollari: savedState.petrodollari,
      economyLevel: savedState.economyLevel,
      incomePerTurn: savedState.incomePerTurn,
      growthPercentage: savedState.growthPercentage,
      previousTurnPetrodollari: savedState.previousTurnPetrodollari,
      currentTurn: savedState.currentTurn,
      attacksLeft: savedState.attacksLeft,
      attacksUsed: savedState.attacksUsed,
      ownedCards: savedState.ownedCards,
      deck: savedState.deck,
      deployedCards: savedState.deployedCards,
    })),

  // Salva punteggio nella leaderboard
  saveToLeaderboard: async (playerName) => {
    const gameState = get().getGameState();
    return await saveScore(playerName, gameState);
  },

  // Salva partita su Supabase
  saveGameToCloud: async (saveName) => {
    const gameState = get().getGameState();
    return await saveGame(saveName, gameState);
  },

  // Carica partita da Supabase
  loadGameFromCloud: async (gameId) => {
    const { data, error } = await loadGame(gameId);
    if (data && !error) {
      get().loadGameState(data.game_state);
    }
    return { data, error };
  },

  // Aggiorna partita esistente su Supabase
  updateGameInCloud: async (gameId) => {
    const gameState = get().getGameState();
    return await updateGame(gameId, gameState);
  },
}));
