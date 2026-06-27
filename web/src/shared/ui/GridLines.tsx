import styles from "./GridLines.module.scss";

/** Тонкие вертикальные направляющие фоном — «чертёжная» текстура (sync-pitch).
 *  Концептуально под фабрику: точность, конструкция. Очень слабый контраст. */
export function GridLines({ count = 4 }: { count?: number }) {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ left: `${((i + 1) / (count + 1)) * 100}%` }} />
      ))}
    </div>
  );
}

export { GridLines as default };
