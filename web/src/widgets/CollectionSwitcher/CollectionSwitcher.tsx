"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { ScrollFillText } from "@/shared/ui/ScrollFillText";
import { asset } from "@/shared/lib/assetPath";
import styles from "./CollectionSwitcher.module.scss";

export interface CollectionItem {
  slug: string;
  name: string;
  shortLabel: string;
  description: string;
  priceLabel?: string;
  hero: string;
  thumb: string;
  href: string;
}

export interface CollectionGroup {
  /** Уникальный ключ группы (komody, stoly и т.п.). */
  key: string;
  /** Лейбл группы для верхней строки tabs. */
  label: string;
  /** Items в группе. */
  items: CollectionItem[];
}

interface BaseProps {
  eyebrow?: string;
  title: string;
  /** Slug начального активного item'а. */
  defaultSlug?: string;
  /** Внешний CTA «Смотреть весь каталог». */
  catalogHref?: string;
  catalogLabel?: string;
  /**
   * Включить ambient-blur фон секции (тяжёлый blur активного фото за всем
   * содержимым). Дополнительно за фото товара рендерится frosted-glass.
   */
  withAmbient?: boolean;
}

type FlatProps = BaseProps & {
  items: CollectionItem[];
  groups?: never;
};

type GroupedProps = BaseProps & {
  groups: CollectionGroup[];
  items?: never;
};

type Props = FlatProps | GroupedProps;

/**
 * Universal collection switcher.
 *
 * - **Flat mode**: `items` — single chip row (как в Кресла, Кроватки).
 * - **Grouped mode**: `groups` — двухуровневая навигация: tabs подкатегорий
 *   сверху + chips items активной группы. Полезно для корпусной мебели
 *   (КОМОДЫ / СТОЛЫ / СТЕЛЛАЖИ / ШКАФЫ).
 */
// Стартовая группа + slug: первый item с defaultSlug, иначе первый в первой
// группе. Чистая функция уровня модуля — вызывается из ленивых useState.
function resolveInitial(groups: CollectionGroup[], defaultSlug?: string) {
  if (defaultSlug) {
    for (const g of groups) {
      const it = g.items.find((i) => i.slug === defaultSlug);
      if (it) return { groupKey: g.key, slug: it.slug };
    }
  }
  const firstGroup = groups[0];
  return { groupKey: firstGroup.key, slug: firstGroup.items[0]?.slug ?? "" };
}

export function CollectionSwitcher(props: Props) {
  const {
    eyebrow,
    title,
    defaultSlug,
    catalogHref,
    catalogLabel = "Смотреть весь каталог",
    withAmbient = false,
  } = props;

  // Нормализуем во внутренний формат: всегда есть groups.
  const groups: CollectionGroup[] = useMemo(() => {
    if ("groups" in props && props.groups) return props.groups;
    return [{ key: "__all", label: "ALL", items: props.items! }];
  }, [props]);

  const isGrouped = groups.length > 1 || groups[0]?.key !== "__all";

  // Начальная активная группа + item — через ленивые инициализаторы useState
  // (вычисляется один раз на mount; см. чистую resolveInitial ниже).
  const [activeGroup, setActiveGroup] = useState(
    () => resolveInitial(groups, defaultSlug).groupKey,
  );
  const [activeSlug, setActiveSlug] = useState(
    () => resolveInitial(groups, defaultSlug).slug,
  );

  const currentGroup = groups.find((g) => g.key === activeGroup) ?? groups[0];
  const active =
    currentGroup.items.find((i) => i.slug === activeSlug) ?? currentGroup.items[0];

  const onGroupChange = (key: string) => {
    const g = groups.find((x) => x.key === key);
    if (!g) return;
    setActiveGroup(key);
    setActiveSlug(g.items[0]?.slug ?? "");
  };

  const idx = currentGroup.items.findIndex((m) => m.slug === active.slug);
  const indexLabel = `${String(idx + 1).padStart(2, "0")} / ${String(currentGroup.items.length).padStart(2, "0")}`;

  // Ambient backdrop: 2-frame cross-fade window (prev + current) для плавных
  // переходов при смене активного item'а.
  const [prevHero, setPrevHero] = useState(active.hero);
  useEffect(() => {
    if (prevHero === active.hero) return;
    const t = setTimeout(() => setPrevHero(active.hero), 1050);
    return () => clearTimeout(t);
  }, [active.hero, prevHero]);

  return (
    <section
      className={`${styles.section} ${withAmbient ? styles.sectionAmbient : ""}`}
      aria-label={title}
    >
      {withAmbient && (
        <div className={styles.ambient} aria-hidden="true">
          {prevHero !== active.hero && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={prevHero}
              src={asset(prevHero)}
              alt=""
              className={styles.ambientImg}
              loading="lazy"
              decoding="async"
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active.hero}
            src={asset(active.hero)}
            alt=""
            className={styles.ambientImgActive}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.ambientOverlay} />
        </div>
      )}
      <header className={styles.head}>
        <div className={styles.headInner}>
          {eyebrow && (
            <p className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h2 className={styles.title}>
            <ScrollFillText text={title} />
          </h2>
        </div>
        {catalogHref && (
          <Link href={catalogHref} className={styles.catalogLink}>
            {catalogLabel.replace(/\s*→\s*$/, "")}
            <ArrowIcon variant="chevron" direction="right" size="0.85em" />
          </Link>
        )}
      </header>

      {isGrouped && (
        <div className={styles.groupTabsWrap}>
          <span className={styles.groupTabsLabel}>Подкатегория</span>
          <nav className={styles.groupTabs} aria-label={`${title} — подкатегории`}>
            {groups.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => onGroupChange(g.key)}
                className={`${styles.groupTab} ${g.key === activeGroup ? styles.groupTabActive : ""}`}
              >
                <span className={styles.groupTabLabel}>{g.label}</span>
                <span className={styles.groupTabCount}>
                  <span className={styles.groupTabCountNum}>{g.items.length}</span>
                  <span className={styles.groupTabCountWord}>
                    {pluralize(g.items.length, ["модель", "модели", "моделей"])}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className={styles.chipsWrap}>
        <span className={styles.chipsLabel}>
          {isGrouped ? "Модель" : "Все модели"}
          <span className={styles.chipsLabelCount}>{currentGroup.items.length}</span>
        </span>
        <nav className={styles.chips} aria-label={`${title} — переключатель моделей`}>
          {currentGroup.items.map((m) => (
            <button
              key={m.slug}
              type="button"
              onClick={() => setActiveSlug(m.slug)}
              className={`${styles.chip} ${m.slug === active.slug ? styles.chipActive : ""}`}
            >
              {m.shortLabel}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.showcase}>
        <div className={styles.info} key={`info-${active.slug}`}>
          <span className={styles.indexLabel}>
            {isGrouped && (
              <>
                <span className={styles.indexGroup}>{currentGroup.label}</span>
                <span className={styles.indexSep} aria-hidden="true">·</span>
              </>
            )}
            {indexLabel}
          </span>
          <h3 className={styles.name}>{active.name}</h3>
          <p className={styles.description}>{active.description}</p>

          <div className={styles.meta}>
            {active.priceLabel && (
              <span className={styles.metaCell}>
                <span className={styles.metaLabel}>Цена</span>
                <span className={styles.metaValue}>{active.priceLabel}</span>
              </span>
            )}
            <span className={styles.metaCell}>
              <span className={styles.metaLabel}>Модель</span>
              <span className={styles.metaValue}>{active.shortLabel}</span>
            </span>
          </div>

          <Link href={active.href} className={styles.cta}>
            Карточка модели
            <ArrowIcon variant="chevron" direction="right" size="0.85em" />
          </Link>
        </div>

        <div className={styles.media}>
          {/* Frosted-glass: то же фото слегка blur'ом за основным
              (как в галереях moreminsk). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`glass-${active.slug}`}
            src={asset(active.hero)}
            alt=""
            aria-hidden="true"
            className={styles.mediaGlass}
            loading="lazy"
            decoding="async"
          />
          <Image
            key={active.slug}
            src={asset(active.hero)}
            alt={active.name}
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            className={styles.photo}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Russian pluralization (1 модель / 2 модели / 5 моделей).
 */
function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export { CollectionSwitcher as default };
