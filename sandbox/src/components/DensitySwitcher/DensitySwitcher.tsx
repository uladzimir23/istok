import { useEffect, useState } from "react";
import styles from "./DensitySwitcher.module.scss";

type DensityId = "compact" | "regular" | "spacious";

interface Density {
  id: DensityId;
  label: string;
  /** SVG-индикатор плотности — три полоски разной густоты. */
  icon: React.ReactNode;
}

const DensityIcon = ({ gap }: { gap: number }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
    <rect x="2" y={4 - gap} width="12" height="1.5" rx="0.5" />
    <rect x="2" y={8} width="12" height="1.5" rx="0.5" />
    <rect x="2" y={12 + gap} width="12" height="1.5" rx="0.5" />
  </svg>
);

const DENSITIES: Density[] = [
  { id: "compact", label: "Compact (×0.75)", icon: <DensityIcon gap={-2} /> },
  { id: "regular", label: "Regular (×1.0, default)", icon: <DensityIcon gap={0} /> },
  { id: "spacious", label: "Spacious (×1.25)", icon: <DensityIcon gap={2} /> },
];

const STORAGE_KEY = "istok-sandbox-density";

function applyDensity(id: DensityId) {
  if (id === "regular") {
    document.documentElement.removeAttribute("data-density");
  } else {
    document.documentElement.setAttribute("data-density", id);
  }
}

export function DensitySwitcher() {
  const [active, setActive] = useState<DensityId>("regular");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as DensityId | null) ?? "regular";
    setActive(saved);
    applyDensity(saved);
  }, []);

  function setDensity(id: DensityId) {
    setActive(id);
    applyDensity(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Плотность интерфейса">
      <span className={styles.label}>Плотность</span>
      <div className={styles.options}>
        {DENSITIES.map((d) => (
          <button
            key={d.id}
            type="button"
            className={styles.option}
            aria-label={d.label}
            aria-pressed={active === d.id}
            onClick={() => setDensity(d.id)}
          >
            {d.icon}
            <span className={styles.tooltip}>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
