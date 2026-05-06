import { useEffect, useState } from "react";
import styles from "./ControlsPanel.module.scss";

const STORAGE_KEY = "istok-sandbox-panel-open";
/** Все ключи свитчеров в localStorage — для reset all. */
const SWITCHER_KEYS = [
  "istok-sandbox-theme",
  "istok-sandbox-font",
  "istok-sandbox-surface",
  "istok-sandbox-density",
  "istok-sandbox-radius",
  "istok-sandbox-hero",
  "istok-sandbox-card",
  "istok-sandbox-container",
  "istok-sandbox-header",
  "istok-sandbox-cta",
] as const;

const DATA_ATTRS = [
  "data-theme",
  "data-font",
  "data-surface",
  "data-density",
  "data-radius",
  "data-hero",
  "data-card",
  "data-container",
  "data-header",
  "data-cta",
] as const;

interface ControlsPanelProps {
  children: React.ReactNode;
  count: number;
}

export function ControlsPanel({ children, count }: ControlsPanelProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setOpen(saved === "1");
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function resetAll() {
    SWITCHER_KEYS.forEach((k) => localStorage.removeItem(k));
    DATA_ATTRS.forEach((a) => document.documentElement.removeAttribute(a));
    // Перезагрузка чтобы каждый свитчер увидел свой default
    location.reload();
  }

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть панель контролов" : "Открыть панель контролов"}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        <span className={styles.toggleBadge}>{count}</span>
      </button>

      <div
        className={`${styles.scrim} ${open ? styles.open : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside
        className={`${styles.panel} ${open ? styles.open : ""}`}
        aria-label="Дизайн-контроли"
        aria-hidden={!open}
      >
        <header className={styles.header}>
          <div className={styles.title}>
            <span className={styles.titleMain}>Дизайн-контроли</span>
            <span className={styles.titleSub}>{count} осей сравнения</span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className={styles.body}>
          {children}
        </div>

        <footer className={styles.footer}>
          Все настройки сохраняются в localStorage. ESC — закрыть.
          <br />
          <button type="button" className={styles.resetBtn} onClick={resetAll}>
            Сбросить всё
          </button>
        </footer>
      </aside>
    </>
  );
}
