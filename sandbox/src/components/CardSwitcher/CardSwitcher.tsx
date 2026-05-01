import { useEffect, useState } from "react";
import styles from "./CardSwitcher.module.scss";

type CardId = "outlined" | "filled" | "elevated" | "borderless";

const Icons = {
  outlined: (
    <svg viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="2" width="20" height="12" rx="2" />
    </svg>
  ),
  filled: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="2" y="2" width="20" height="12" rx="2" fillOpacity="0.45" />
    </svg>
  ),
  elevated: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="3" y="6" width="18" height="3" rx="1.5" fillOpacity="0.25" />
      <rect x="2" y="2" width="20" height="10" rx="2" />
    </svg>
  ),
  borderless: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="2" y="2" width="20" height="8" rx="1" fillOpacity="0.45" />
      <rect x="3" y="11" width="14" height="1.5" rx="0.5" />
      <rect x="3" y="13.5" width="9" height="1.5" rx="0.5" fillOpacity="0.6" />
    </svg>
  ),
};

const CARDS: { id: CardId; label: string; icon: React.ReactNode }[] = [
  { id: "outlined", label: "Outlined (default)", icon: Icons.outlined },
  { id: "filled", label: "Filled / tinted", icon: Icons.filled },
  { id: "elevated", label: "Elevated (shadow)", icon: Icons.elevated },
  { id: "borderless", label: "Borderless (фото+текст)", icon: Icons.borderless },
];

const STORAGE_KEY = "istok-sandbox-card";

function applyCard(id: CardId) {
  if (id === "outlined") {
    document.documentElement.removeAttribute("data-card");
  } else {
    document.documentElement.setAttribute("data-card", id);
  }
}

export function CardSwitcher() {
  const [active, setActive] = useState<CardId>("outlined");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as CardId | null) ?? "outlined";
    setActive(saved);
    applyCard(saved);
  }, []);

  function setCard(id: CardId) {
    setActive(id);
    applyCard(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Стиль карточек">
      <span className={styles.label}>Карточка</span>
      <div className={styles.options}>
        {CARDS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.option}
            aria-label={c.label}
            aria-pressed={active === c.id}
            onClick={() => setCard(c.id)}
          >
            {c.icon}
            <span className={styles.tooltip}>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
