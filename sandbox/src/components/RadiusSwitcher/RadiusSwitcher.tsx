import { useEffect, useState } from "react";
import styles from "./RadiusSwitcher.module.scss";

type RadiusId = "sharp" | "soft" | "pillow";

const RADII: { id: RadiusId; label: string }[] = [
  { id: "sharp", label: "Sharp (острые углы)" },
  { id: "soft", label: "Soft (default)" },
  { id: "pillow", label: "Pillow (мягкие)" },
];

const STORAGE_KEY = "istok-sandbox-radius";

function applyRadius(id: RadiusId) {
  if (id === "soft") {
    document.documentElement.removeAttribute("data-radius");
  } else {
    document.documentElement.setAttribute("data-radius", id);
  }
}

export function RadiusSwitcher() {
  const [active, setActive] = useState<RadiusId>("soft");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as RadiusId | null) ?? "soft";
    setActive(saved);
    applyRadius(saved);
  }, []);

  function setRadius(id: RadiusId) {
    setActive(id);
    applyRadius(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Радиусы">
      <span className={styles.label}>Радиус</span>
      <div className={styles.options}>
        {RADII.map((r) => (
          <button
            key={r.id}
            type="button"
            className={styles.option}
            data-shape={r.id}
            aria-label={r.label}
            aria-pressed={active === r.id}
            onClick={() => setRadius(r.id)}
          >
            <span className={styles.indicator} />
            <span className={styles.tooltip}>{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
