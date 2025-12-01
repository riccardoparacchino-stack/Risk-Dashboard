import { useEffect } from "react";
import styles from './Toast.module.css';

export default function Toast({ message, isVisible, onClose, duration = 2500 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.toast}>
        {message}
      </div>
    </div>
  );
}
