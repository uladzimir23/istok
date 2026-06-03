import styles from "./ArrowIcon.module.scss";

type Variant = "chevron" | "corner";
type Direction = "left" | "right" | "up" | "down";

interface Props {
  variant?: Variant;
  /** Направление стрелки. По умолчанию вправо. */
  direction?: Direction;
  /** Размер в em (наследует font-size родителя). По умолчанию 1em. */
  size?: number | string;
  className?: string;
}

/**
 * Бренд-стрелки Истока.
 * - `chevron` (Vector-1) — тонкий уголок без палки (>).
 * - `corner`  (Vector)   — заполненная стрелка-уголок с ножкой.
 *
 * Цвет управляется через CSS `color` (используется `currentColor` внутри SVG).
 */
export function ArrowIcon({
  variant = "chevron",
  direction = "right",
  size = "1em",
  className,
}: Props) {
  if (variant === "chevron") {
    // Chevron: смотрит вправо в нативной ориентации
    return (
      <svg
        viewBox="0 0 243 401"
        width={size}
        height={size}
        aria-hidden="true"
        className={`${styles.icon} ${styles[`dir-${direction}`]} ${styles.chevron} ${className ?? ""}`}
      >
        <path
          d="M24.8711 369.327C93.323 314.98 149.924 257.216 192.871 200.327C149.924 143.438 93.323 85.6741 24.8711 31.3271"
          stroke="currentColor"
          strokeWidth={80}
          strokeLinecap="square"
          fill="none"
        />
      </svg>
    );
  }
  // Corner — нативная ориентация: уголок в правом-нижнем, остриё вверх-влево
  return (
    <svg
      viewBox="0 0 338 338"
      width={size}
      height={size}
      aria-hidden="true"
      className={`${styles.icon} ${styles[`dir-${direction}`]} ${styles.corner} ${className ?? ""}`}
    >
      <path
        d="M337.5 300C337.5 203.526 326.116 112.37 305.887 31.6131C225.13 11.3845 133.974 0 37.5 0L150 112.5L0 262.5L75 337.5L225 187.5L337.5 300Z"
        fill="currentColor"
      />
    </svg>
  );
}
