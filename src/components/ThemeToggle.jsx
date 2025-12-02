import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button 
      className={`${styles.toggle} ${isDark ? styles.dark : ''}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Passa a light mode' : 'Passa a dark mode'}
    >
      <span className={styles.icon}>
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className={styles.slider} />
    </button>
  );
}

