import { useEffect, useState } from "react";
import styles from "./CtaSwitcher.module.scss";

type CtaId = "pill" | "rounded" | "sharp" | "ghost";

const OPTIONS: { id: CtaId; short: string; label: string }[] = [
  { id: "pill", short: "Аа", label: "Pill (default) — округлая, дружелюбная" },
  { id: "rounded", short: "Аа", label: "Rounded — современная, нейтральная" },
  { id: "sharp", short: "Аа", label: "Sharp — прямые углы, технологичная" },
  { id: "ghost", short: "Аа", label: "Ghost — outline, минималистичная" },
];

const STORAGE_KEY = "istok-sandbox-cta";

function applyCta(id: CtaId) {
  if (id === "pill") {
    document.documentElement.removeAttribute("data-cta");
  } else {
    document.documentElement.setAttribute("data-cta", id);
  }
}

export function CtaSwitcher() {
  const [active, setActive] = useState<CtaId>("pill");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as CtaId | null) ?? "pill";
    setActive(saved);
    applyCta(saved);
  }, []);

  function set(id: CtaId) {
    setActive(id);
    applyCta(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Стиль CTA">
      <span className={styles.label}>CTA</span>
      <div className={styles.options}>
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={styles.option}
            data-shape={o.id}
            aria-label={o.label}
            aria-pressed={active === o.id}
            onClick={() => set(o.id)}
          >
            {o.short}
            <span className={styles.tooltip}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
