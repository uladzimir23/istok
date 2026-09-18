import Link from "next/link";
import { Reveal } from "@/shared/ui/Reveal";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { SITE } from "@/shared/lib/seo";
import styles from "./CTABand.module.scss";

// Lead-magnet band — финальная конверсионная точка между FAQ и Footer.
// Full-bleed accent-color, белая типографика. 2-col на desktop:
// текст-блок слева + action-stack справа.

const STEPS = [
  { num: "01", label: "Получаем ТЗ" },
  { num: "02", label: "Считаем смету" },
  { num: "03", label: "Возвращаемся за 1 рабочий день" },
];

export function CTABand() {
  const telHref = `tel:${SITE.phone.replace(/[^0-9+]/g, "")}`;

  return (
    <section className={styles.section} aria-labelledby="cta-band-h2">
      <Reveal>
        <div className={styles.inner}>
          <div className={styles.text}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden="true" />
              Следующий шаг
            </p>
            <h2 id="cta-band-h2" className={styles.title}>
              Запросим расчёт за&nbsp;1&nbsp;рабочий день
            </h2>
            <p className={styles.lede}>
              Пришлите техническое задание или коротко опишите задачу — вернёмся
              со сметой, сроком производства и предложением по комплектации.
              Без обязательств.
            </p>

            <ul className={styles.steps}>
              {STEPS.map((s) => (
                <li key={s.num} className={styles.step}>
                  <span className={styles.stepNum}>{s.num}</span>
                  <span className={styles.stepLabel}>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.actions}>
            <Link href="/contacts/" className={styles.primary}>
              Написать на расчёт
              <ArrowIcon variant="chevron" direction="right" size="0.9em" />
            </Link>

            <a href={telHref} className={styles.secondary}>
              <span className={styles.secondaryLabel}>Или сразу позвонить</span>
              <span className={styles.secondaryValue}>{SITE.phone}</span>
            </a>

            <p className={styles.meta}>
              Обычно отвечаем за&nbsp;2&nbsp;–&nbsp;4&nbsp;часа в рабочее время.
              Письма на&nbsp;
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              .
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export { CTABand as default };
