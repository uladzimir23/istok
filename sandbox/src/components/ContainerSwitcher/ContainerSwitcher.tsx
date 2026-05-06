import { useEffect, useState } from "react";
import styles from "./ContainerSwitcher.module.scss";

type ContainerId = "narrow" | "regular" | "wide" | "fluid";

const Icons = {
  narrow: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="8" y="3" width="8" height="10" rx="1" />
    </svg>
  ),
  regular: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="5" y="3" width="14" height="10" rx="1" />
    </svg>
  ),
  wide: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="2" y="3" width="20" height="10" rx="1" />
    </svg>
  ),
  fluid: (
    <svg viewBox="0 0 24 16" fill="currentColor" aria-hidden>
      <rect x="0" y="3" width="24" height="10" />
    </svg>
  ),
};

const OPTIONS: { id: ContainerId; label: string; icon: React.ReactNode }[] = [
  { id: "narrow", label: "Narrow (880px) — журнальная подача", icon: Icons.narrow },
  { id: "regular", label: "Regular (1200px, default)", icon: Icons.regular },
  { id: "wide", label: "Wide (1440px) — для больших мониторов", icon: Icons.wide },
  { id: "fluid", label: "Fluid (без max-width)", icon: Icons.fluid },
];

const STORAGE_KEY = "istok-sandbox-container";

function applyContainer(id: ContainerId) {
  if (id === "regular") {
    document.documentElement.removeAttribute("data-container");
  } else {
    document.documentElement.setAttribute("data-container", id);
  }
}

export function ContainerSwitcher() {
  const [active, setActive] = useState<ContainerId>("regular");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ContainerId | null) ?? "regular";
    setActive(saved);
    applyContainer(saved);
  }, []);

  function set(id: ContainerId) {
    setActive(id);
    applyContainer(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={styles.root} role="group" aria-label="Ширина контейнера">
      <span className={styles.label}>Ширина</span>
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
