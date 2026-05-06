import { useEffect, useState } from "react";
import styles from "./HeaderSwitcher.module.scss";

type HeaderId = "split" | "centered" | "compact";

const Icons = {
  split: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="2" y="6" width="5" height="2" rx="0.5" />
      <rect x="9" y="6" width="6" height="2" rx="0.5" fillOpacity="0.5" />
      <rect x="17" y="6" width="5" height="2" rx="0.5" />
    </svg>
  ),
  centered: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="9" y="3" width="6" height="2" rx="0.5" />
      <rect x="3" y="9" width="18" height="2" rx="0.5" fillOpacity="0.5" />
    </svg>
  ),
  compact: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="2" y="6" width="2" height="2" rx="0.5" />
      <rect x="6" y="6" width="6" height="2" rx="0.5" />
      <rect x="18" y="6" width="4" height="2" rx="0.5" />
    </svg>
  ),
};

const OPTIONS: { id: HeaderId; label: string; icon: React.ReactNode }[] = [
  { id: "split", label: "Split (default) — лого слева, nav, actions справа", icon: Icons.split },
  { id: "centered", label: "Centered — лого по центру, nav снизу", icon: Icons.centered },
  { id: "compact", label: "Compact — гамбургер всегда", icon: Icons.compact },
];

const STORAGE_KEY = "istok-sandbox-header";

function applyHeader(id: HeaderId) {
  if (id === "split") {
    document.documentElement.removeAttribute("data-header");
  } else {
    document.documentElement.setAttribute("data-header", id);
  }
}

export function HeaderSwitcher() {
  const [active, setActive] = useState<HeaderId>("split");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as HeaderId | null) ?? "split";
    setActive(saved);
    applyHeader(saved);
  }, []);

  function set(id: HeaderId) {
    setActive(id);
    applyHeader(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Header layout">
      <span className={styles.label}>Header</span>
      <div className={styles.options}>
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={styles.option}
            aria-label={o.label}
            aria-pressed={active === o.id}
            onClick={() => set(o.id)}
          >
            {o.icon}
            <span className={styles.tooltip}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
