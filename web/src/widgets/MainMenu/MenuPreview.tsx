"use client";

import Link from "next/link";
import styles from "./MainMenu.module.scss";

type Props = { index: number; onNavigate: () => void };

const PREVIEW: Array<{ rows: { name: string; meta?: string; href?: string }[] }> = [
  {
    rows: [
      { name: "М1 · Базовое", meta: "от 260 BYN", href: "/kresla/m1/" },
      { name: "М2 · Конференц", meta: "от 295 BYN", href: "/kresla/m2/" },
      { name: "М3 · Премиум", meta: "от 340 BYN", href: "/kresla/m3/" },
      { name: "М3-1 · Топовая", meta: "от 380 BYN", href: "/kresla/m3-1/" },
      { name: "М3-Г · Гостевая", meta: "от 320 BYN", href: "/kresla/m3-g/" },
      { name: "ПМ-1 · Полумягкое", meta: "от 215 BYN", href: "/kresla/pm-1/" },
    ],
  },
  {
    rows: [
      { name: "Комоды", meta: "2 модели", href: "/komody/" },
      { name: "Столы", meta: "3 модели", href: "/stoly/" },
      { name: "Стеллажи", meta: "3 модели", href: "/stelazhi/" },
      { name: "Шкафы", meta: "4 модели", href: "/shkafy/" },
    ],
  },
  {
    rows: [
      { name: "Афина", href: "/krovatki/afina/" },
      { name: "Доминика", href: "/krovatki/dominika/" },
      { name: "Мелита", href: "/krovatki/melita/" },
      { name: "Мишель", href: "/krovatki/mishel/" },
      { name: "Николь", href: "/krovatki/nikol/" },
      { name: "Паулина", href: "/krovatki/paulina/" },
      { name: "Эльза", href: "/krovatki/elza/" },
      { name: "Ясмина", href: "/krovatki/yasmina/" },
    ],
  },
  {
    rows: [
      { name: "Дом культуры", meta: "Минск · 2024", href: "/proekty/" },
      { name: "Концертный зал", meta: "Гомель · 2024", href: "/proekty/" },
      { name: "ВУЗ-аудитория", meta: "Брест · 2023", href: "/proekty/" },
      { name: "Театральный зал", meta: "Гродно · 2022", href: "/proekty/" },
    ],
  },
  {
    rows: [
      { name: "Производство в Березино", meta: "с 2008 года" },
      { name: "Полный цикл", meta: "заготовка → отгрузка" },
      { name: "≈ ⅓ залов РБ", meta: "по госзаказу" },
      { name: "СНГ + ЕС", meta: "география поставок" },
    ],
  },
  {
    rows: [
      { name: "Самовывоз", meta: "Березино, бесплатно" },
      { name: "По Беларуси", meta: "наш транспорт" },
      { name: "СНГ", meta: "транспортные компании" },
      { name: "Оплата", meta: "нал / безнал / ЕРИП" },
    ],
  },
  {
    rows: [
      { name: "+375 29 587-34-40", href: "tel:+375295873440" },
      { name: "+375 44 594-70-46", href: "tel:+375445947046" },
      { name: "istok-mebel@mail.ru", href: "mailto:istok-mebel@mail.ru" },
      { name: "Telegram", href: "https://t.me/fomz1" },
      { name: "Viber", href: "viber://add?number=80293037755" },
    ],
  },
];

export function MenuPreview({ index, onNavigate }: Props) {
  const block = PREVIEW[index];
  if (!block) return null;

  return (
    <div className={styles.priceCols}>
      <div className={styles.priceCol}>
        {block.rows.map((r) => {
          const content = (
            <>
              <span className={styles.priceName}>{r.name}</span>
              {r.meta && <span className={styles.priceVal}>{r.meta}</span>}
            </>
          );
          if (!r.href) {
            return (
              <div key={r.name} className={styles.priceRow}>
                {content}
              </div>
            );
          }
          if (r.href.startsWith("tel:") || r.href.startsWith("mailto:") || r.href.startsWith("http")) {
            return (
              <a key={r.name} href={r.href} className={styles.priceRow} tabIndex={-1}>
                {content}
              </a>
            );
          }
          return (
            <Link
              key={r.name}
              href={r.href}
              className={styles.priceRow}
              onClick={onNavigate}
              tabIndex={-1}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
