import styles from './BottomNavigation.module.css';

export default function BottomNavigation({ currentView, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🎮' },
    { id: 'deck', label: 'Deck', icon: '🃏' },
    { id: 'statistiche', label: 'Statistiche', icon: '📊' },
  ];

  return (
    <nav className={styles.navigation}>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${currentView === item.id ? styles.active : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          <span className={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
