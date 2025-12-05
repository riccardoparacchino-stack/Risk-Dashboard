import { useState, useEffect } from "react";
import { useGameStore } from "../store";
import { getSavedGames, deleteGame } from "../supabaseClient";
import styles from './SaveLoadModal.module.css';

export default function SaveLoadModal({ isOpen, onClose, onShowToast }) {
  const [saveName, setSaveName] = useState("");
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("save");
  
  const { saveGameToCloud, loadGameFromCloud } = useGameStore();

  const fetchSavedGames = async () => {
    setLoading(true);
    const { data, error } = await getSavedGames();
    if (!error && data) {
      setSavedGames(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchSavedGames();
    }
  }, [isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    
    setSaving(true);
    const { error } = await saveGameToCloud(saveName.trim());
    setSaving(false);
    
    if (error) {
      onShowToast?.("Errore nel salvataggio");
    } else {
      onShowToast?.("Partita salvata!");
      setSaveName("");
      fetchSavedGames();
    }
  };

  const handleLoad = async (gameId) => {
    setLoading(true);
    const { error } = await loadGameFromCloud(gameId);
    setLoading(false);
    
    if (error) {
      onShowToast?.("Errore nel caricamento");
    } else {
      onShowToast?.("Partita caricata!");
      onClose();
    }
  };

  const handleDelete = async (gameId) => {
    if (!confirm("Sei sicuro di voler eliminare questo salvataggio?")) return;
    
    const { error } = await deleteGame(gameId);
    if (error) {
      onShowToast?.("Errore nell'eliminazione");
    } else {
      onShowToast?.("Salvataggio eliminato");
      fetchSavedGames();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'save' ? styles.active : ''}`}
            onClick={() => setActiveTab('save')}
          >
            Salva
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'load' ? styles.active : ''}`}
            onClick={() => setActiveTab('load')}
          >
            Carica
          </button>
        </div>

        {activeTab === 'save' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Salva Partita</h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                className={styles.input}
                placeholder="Nome salvataggio..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                maxLength={30}
              />
              <button 
                type="submit" 
                className={styles.btnPrimary}
                disabled={!saveName.trim() || saving}
              >
                {saving ? "Salvataggio..." : "Salva Partita"}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'load' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Carica Partita</h3>
            
            {loading && <div className={styles.loading}>Caricamento...</div>}
            
            {!loading && savedGames.length === 0 && (
              <div className={styles.empty}>Nessun salvataggio trovato</div>
            )}
            
            {!loading && savedGames.length > 0 && (
              <div className={styles.gamesList}>
                {savedGames.map((game) => (
                  <div key={game.id} className={styles.gameItem}>
                    <div className={styles.gameInfo}>
                      <span className={styles.gameName}>{game.save_name}</span>
                      <span className={styles.gameDate}>{formatDate(game.updated_at)}</span>
                    </div>
                    <div className={styles.gameActions}>
                      <button 
                        className={styles.btnLoad}
                        onClick={() => handleLoad(game.id)}
                      >
                        Carica
                      </button>
                      <button 
                        className={styles.btnDelete}
                        onClick={() => handleDelete(game.id)}
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
