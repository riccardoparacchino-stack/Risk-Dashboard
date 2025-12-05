import { useState, useEffect } from "react";
import { getLeaderboard } from "../supabaseClient";
import styles from './Leaderboard.module.css';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getLeaderboard(10);
    if (fetchError) {
      setError("Errore nel caricamento della leaderboard");
      console.error(fetchError);
    } else {
      setScores(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Leaderboard</h2>
        <button className={styles.refreshBtn} onClick={fetchLeaderboard} disabled={loading}>
          {loading ? "..." : "Aggiorna"}
        </button>
      </div>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {loading && !error && (
        <div className={styles.loading}>Caricamento...</div>
      )}

      {!loading && !error && scores.length === 0 && (
        <div className={styles.empty}>
          Nessun punteggio ancora. Gioca per essere il primo!
        </div>
      )}

      {!loading && !error && scores.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Giocatore</th>
                <th>Petrodollari</th>
                <th>Turno</th>
                <th>Economia</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <tr key={score.id} className={index < 3 ? styles.topThree : ''}>
                  <td className={styles.rank}>
                    {index === 0 && <span className={styles.gold}>1</span>}
                    {index === 1 && <span className={styles.silver}>2</span>}
                    {index === 2 && <span className={styles.bronze}>3</span>}
                    {index > 2 && index + 1}
                  </td>
                  <td className={styles.playerName}>{score.player_name}</td>
                  <td className={styles.petrodollari}>${score.final_petrodollari}</td>
                  <td>{score.final_turn}</td>
                  <td>Lv.{score.economy_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
