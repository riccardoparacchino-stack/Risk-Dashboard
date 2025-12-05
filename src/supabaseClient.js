import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ============ LEADERBOARD FUNCTIONS ============

/**
 * Save a game score to the leaderboard
 */
export async function saveScore(playerName, gameState) {
  const { data, error } = await supabase
    .from('game_scores')
    .insert([{
      player_name: playerName,
      final_petrodollari: gameState.petrodollari,
      final_turn: gameState.currentTurn,
      economy_level: gameState.economyLevel,
      cards_owned: gameState.ownedCards,
    }])
    .select();

  if (error) {
    console.error('Error saving score:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Get top 10 scores from leaderboard
 */
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('game_scores')
    .select('*')
    .order('final_petrodollari', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

// ============ SAVED GAMES FUNCTIONS ============

/**
 * Save current game state
 */
export async function saveGame(saveName, gameState) {
  const { data, error } = await supabase
    .from('saved_games')
    .insert([{
      save_name: saveName,
      game_state: gameState,
    }])
    .select();

  if (error) {
    console.error('Error saving game:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Load a saved game by ID
 */
export async function loadGame(gameId) {
  const { data, error } = await supabase
    .from('saved_games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error) {
    console.error('Error loading game:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Get list of all saved games
 */
export async function getSavedGames() {
  const { data, error } = await supabase
    .from('saved_games')
    .select('id, save_name, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved games:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Update an existing saved game
 */
export async function updateGame(gameId, gameState) {
  const { data, error } = await supabase
    .from('saved_games')
    .update({
      game_state: gameState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', gameId)
    .select();

  if (error) {
    console.error('Error updating game:', error);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Delete a saved game
 */
export async function deleteGame(gameId) {
  const { error } = await supabase
    .from('saved_games')
    .delete()
    .eq('id', gameId);

  if (error) {
    console.error('Error deleting game:', error);
    return { success: false, error };
  }
  return { success: true, error: null };
}
