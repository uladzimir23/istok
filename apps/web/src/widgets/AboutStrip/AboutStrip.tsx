import { CountUp } from "@/shared/ui/CountUp";
import styles from "./AboutStrip.module.scss";

interface Stat {
  value?: number;
  suffix?: string;
  raw?: string;
  label: string;
  note?: string;
}

const STATS: Stat[] = [
  { value: 18, label: "лет производства", note: "с 2008 года" },
  { raw: "≈⅓", label: "залов РБ", note: "по госзаказу на кресла" },
  { raw: "СНГ + ЕС", label: "география", note: "поставки за пределы РБ" },
  { value: 26, label: "моделей в каталоге", note: "кресла · корпусная · ELIS" },
];

export function AboutStrip() {
  return (
    <section className={styles.section} aria-label="О фабрике">
      <ul className={styles.list}>
        {STATS.map((s, i) => (
          <li
            key={i}
            className={styles.item}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className={styles.value}>
              {s.value !== undefined ? (
                <CountUp to={s.value} duration={1100} suffix={s.suffix} />
              ) : (
                s.raw
              )}
            </span>
            <span className={styles.label}>{s.label}</span>
            {s.note && <span className={styles.note}>{s.note}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
