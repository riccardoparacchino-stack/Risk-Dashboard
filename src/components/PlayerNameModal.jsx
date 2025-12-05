import { useState } from "react";
import styles from './PlayerNameModal.module.css';

export default function PlayerNameModal({ isOpen, onConfirm }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2 className={styles.title}>Benvenuto!</h2>
        <p className={styles.subtitle}>Inserisci il tuo nome per iniziare</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Il tuo nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={20}
          />
          
          <button 
            type="submit" 
            className={styles.btnPrimary}
            disabled={!name.trim()}
          >
            Inizia a Giocare
          </button>
        </form>
      </div>
    </div>
  );
}
