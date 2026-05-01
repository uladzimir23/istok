import { useEffect, useState } from "react";
import styles from "./HeroSwitcher.module.scss";

type HeroId = "stacked" | "centered" | "split" | "overlay";

interface Layout {
  id: HeroId;
  label: string;
  icon: React.ReactNode;
}

/** Маленькие схематичные иконки, показывающие layout. */
const Icons = {
  stacked: (
    <svg viewBox="0 0 24 18" fill="currentColor" aria-hidden>
      <rect x="2" y="3" width="14" height="2" rx="1" />
      <rect x="2" y="7" width="18" height="3" rx="1" />
      <rect x="2" y="13" width="8" height="2" rx="1" />
    </svg>
  ),
  centered: (
    <svg viewBox="0 0 24 18" fill="currentColor" aria-hidden>
      <rect x="6" y="3" width="12" height="2" rx="1" />
      <rect x="3" y="7" width="18" height="3" rx="1" />
      <rect x="8" y="13" width="8" height="2" rx="1" />
    </svg>
  ),
  split: (
    <svg viewBox="0 0 24 18" fill="currentColor" aria-hidden>
      <rect x="2" y="3" width="9" height="12" rx="1" />
      <rect x="13" y="3" width="9" height="12" rx="1" fillOpacity="0.4" />
    </svg>
  ),
  overlay: (
    <svg viewBox="0 0 24 18" fill="currentColor" aria-hidden>
      <rect x="2" y="2" width="20" height="14" rx="1" fillOpacity="0.3" />
      <rect x="4" y="11" width="10" height="2" rx="1" />
      <rect x="4" y="8" width="14" height="2" rx="1" />
    </svg>
  ),
};

const LAYOUTS: Layout[] = [
  { id: "stacked", label: "Stacked-left (default)", icon: Icons.stacked },
  { id: "centered", label: "Centered + image-bg", icon: Icons.centered },
  { id: "split", label: "Split 50/50", icon: Icons.split },
  { id: "overlay", label: "Image overlay", icon: Icons.overlay },
];

const STORAGE_KEY = "istok-sandbox-hero";

function applyHero(id: HeroId) {
  if (id === "stacked") {
    document.documentElement.removeAttribute("data-hero");
  } else {
    document.documentElement.setAttribute("data-hero", id);
  }
}

export function HeroSwitcher() {
  const [active, setActive] = useState<HeroId>("stacked");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as HeroId | null) ?? "stacked";
    setActive(saved);
    applyHero(saved);
  }, []);

  function setHero(id: HeroId) {
    setActive(id);
    applyHero(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Hero layout">
      <span className={styles.label}>Hero</span>
      <div className={styles.options}>
        {LAYOUTS.map((l) => (
          <button
            key={l.id}
            type="button"
            className={styles.option}
            aria-label={l.label}
            aria-pressed={active === l.id}
            onClick={() => setHero(l.id)}
          >
            {l.icon}
            <span className={styles.tooltip}>{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
