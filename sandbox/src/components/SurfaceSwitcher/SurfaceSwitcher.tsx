import { useEffect, useState } from "react";
import styles from "./SurfaceSwitcher.module.scss";

type SurfaceId = "white" | "cream" | "warm-grey" | "cool-grey";

interface Surface {
  id: SurfaceId;
  label: string;
  swatch: string;
}

const SURFACES: Surface[] = [
  { id: "white", label: "Белый (default)", swatch: "#FFFFFF" },
  { id: "cream", label: "Кремовый (как ELIS)", swatch: "#FBF7EB" },
  { id: "warm-grey", label: "Тёплый off-white", swatch: "#F7F4EE" },
  { id: "cool-grey", label: "Холодный off-white", swatch: "#F8F9FA" },
];

const STORAGE_KEY = "istok-sandbox-surface";

function applySurface(id: SurfaceId) {
  if (id === "white") {
    document.documentElement.removeAttribute("data-surface");
  } else {
    document.documentElement.setAttribute("data-surface", id);
  }
}

export function SurfaceSwitcher() {
  const [active, setActive] = useState<SurfaceId>("white");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as SurfaceId | null) ?? "white";
    setActive(saved);
    applySurface(saved);
  }, []);

  function setSurface(id: SurfaceId) {
    setActive(id);
    applySurface(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Поверхность">
      <span className={styles.label}>Фон</span>
      <div className={styles.swatches}>
        {SURFACES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={styles.swatch}
            style={{ "--swatch-color": s.swatch } as React.CSSProperties}
            aria-label={s.label}
            aria-pressed={active === s.id}
            onClick={() => setSurface(s.id)}
          >
            <span className={styles.swatchTooltip}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
