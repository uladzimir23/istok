import Link from "next/link";
import { Reveal } from "@/shared/ui/Reveal";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import styles from "./Certificates.module.scss";

interface Cert {
  abbr: string;
  title: string;
  meta: string;
  scope: string;
}

// Placeholder-ряд для тендерного комплекта. Реальные номера/годы
// подгрузим когда заказчик передаст копии. ████ = redacted-плейсхолдер
// (см. CLAUDE.md → Redaction policy).
const CERTS: Cert[] = [
  { abbr: "СТБ", title: "СТБ ████-████",        meta: "Кресла театральные · ГОСТ-эквивалент",  scope: "Беларусь" },
  { abbr: "ISO", title: "ISO 9001",            meta: "Система менеджмента качества",            scope: "Международный" },
  { abbr: "ПБ",  title: "Пожарная безопасность", meta: "Группа горючести Г1 · сертификат МЧС",   scope: "Беларусь, РФ" },
  { abbr: "СГР", title: "Гигиена",              meta: "Свидетельство о госрегистрации ТС",       scope: "ЕАЭС" },
];

export function Certificates() {
  return (
    <section className={styles.section} aria-labelledby="certs-h2">
      <Reveal>
        <header className={styles.head}>
          <div className={styles.headInner}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden="true" />
              Сертификаты · стандарты
            </p>
            <h2 id="certs-h2" className={styles.title}>
              Тендерный комплект
            </h2>
            <p className={styles.lede}>
              Готовы к участию в государственных закупках Беларуси, России и стран
              ЕАЭС. Полный пакет документов предоставляем по запросу
              после&nbsp;NDA.
            </p>
          </div>
          <Link href="/contacts/" className={styles.headCta}>
            Запросить документы
            <ArrowIcon variant="chevron" direction="right" size="0.85em" />
          </Link>
        </header>
      </Reveal>

      <ul className={styles.list}>
        {CERTS.map((c, i) => (
          <Reveal key={c.abbr} delay={i * 90}>
            <li className={styles.item}>
              <span className={styles.abbr} aria-hidden="true">
                {c.abbr}
              </span>
              <h3 className={styles.itemTitle}>{c.title}</h3>
              <p className={styles.itemMeta}>{c.meta}</p>
              <p className={styles.itemScope}>
                <span className={styles.scopeLabel}>Действие</span>
                {c.scope}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={CERTS.length * 90}>
        <p className={styles.note}>
          Также по запросу:
          паспорта изделий, протоколы испытаний, копии договоров с госзаказчиками
          (за вычетом коммерческих условий), портфолио поставок по тендерам
          с 2008&nbsp;года.
        </p>
      </Reveal>
    </section>
  );
}

export { Certificates as default };
