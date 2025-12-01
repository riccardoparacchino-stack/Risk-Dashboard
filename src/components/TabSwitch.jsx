import styles from './TabSwitch.module.css';

export default function TabSwitch({ activeTab, onTabChange }) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.tab} ${activeTab === 'attack' ? styles.active : ''}`}
        onClick={() => onTabChange('attack')}
      >
        Attacco
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'defense' ? styles.active : ''}`}
        onClick={() => onTabChange('defense')}
      >
        Difesa
      </button>
    </div>
  );
}

