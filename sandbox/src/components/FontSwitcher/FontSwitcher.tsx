import { useEffect, useState } from "react";
import styles from "./FontSwitcher.module.scss";

type FontId = "tilda" | "manrope-lora" | "inter-cormorant" | "pt";

interface FontPair {
  id: FontId;
  /** Короткое имя на кнопке. */
  short: string;
  /** Tooltip — полное название пары. */
  full: string;
  /** Шрифт самой кнопки (чтобы было видно как выглядит этот вариант). */
  buttonFont: string;
}

const FONTS: FontPair[] = [
  {
    id: "tilda",
    short: "Aa",
    full: "Montserrat + Comfortaa (как Tilda)",
    buttonFont: "'Montserrat Variable', sans-serif",
  },
  {
    id: "manrope-lora",
    short: "Aa",
    full: "Manrope + Lora",
    buttonFont: "'Manrope Variable', sans-serif",
  },
  {
    id: "inter-cormorant",
    short: "Aa",
    full: "Inter + Cormorant",
    buttonFont: "'Inter Variable', sans-serif",
  },
  {
    id: "pt",
    short: "Aa",
    full: "PT Sans + PT Serif",
    buttonFont: "'PT Sans', sans-serif",
  },
];

const STORAGE_KEY = "istok-sandbox-font";

function applyFont(id: FontId) {
  if (id === "tilda") {
    document.documentElement.removeAttribute("data-font");
  } else {
    document.documentElement.setAttribute("data-font", id);
  }
}

export function FontSwitcher() {
  const [active, setActive] = useState<FontId>("tilda");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as FontId | null) ?? "tilda";
    setActive(saved);
    applyFont(saved);
  }, []);

  function setFont(id: FontId) {
    setActive(id);
    applyFont(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Шрифтовая пара">
      <span className={styles.label}>Шрифт</span>
      <div className={styles.options}>
        {FONTS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={styles.option}
            style={{ "--option-font": f.buttonFont } as React.CSSProperties}
            aria-label={f.full}
            aria-pressed={active === f.id}
            onClick={() => setFont(f.id)}
          >
            {f.short}
            <span className={styles.optionTooltip}>{f.full}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
