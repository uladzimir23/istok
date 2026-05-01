import { useEffect, useState } from "react";
import styles from "./ThemeSwitcher.module.scss";

type ThemeId = "coral" | "terracotta" | "walnut" | "bordo" | "mono";

interface Theme {
  id: ThemeId;
  label: string;
  swatch: string;
}

const THEMES: Theme[] = [
  { id: "coral", label: "Коралл (как Tilda)", swatch: "#FF8562" },
  { id: "terracotta", label: "Терракота", swatch: "#B5563E" },
  { id: "walnut", label: "Орех", swatch: "#8B5A2B" },
  { id: "bordo", label: "Бордо (кресла)", swatch: "#7A2E2E" },
  { id: "mono", label: "Без акцента", swatch: "#292929" },
];

const STORAGE_KEY = "istok-sandbox-theme";

function applyTheme(theme: ThemeId) {
  if (theme === "coral") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function ThemeSwitcher() {
  const [active, setActive] = useState<ThemeId>("coral");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeId | null) ?? "coral";
    setActive(saved);
    applyTheme(saved);
  }, []);

  function setTheme(t: ThemeId) {
    setActive(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  return (
    <div className={styles.root} role="group" aria-label="Тема акцента">
      <span className={styles.label}>Акцент</span>
      <div className={styles.swatches}>
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={styles.swatch}
            style={{ "--swatch-color": t.swatch } as React.CSSProperties}
            aria-label={t.label}
            aria-pressed={active === t.id}
            onClick={() => setTheme(t.id)}
          >
            <span className={styles.swatchTooltip}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
