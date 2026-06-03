"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/shared/ui/Reveal";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import styles from "./ProjectsTeaser.module.scss";

interface Project {
  num: string;
  objectType: string;
  city: string;
  year: number;
  delivered: string;
  photo: string;
  href?: string;
}

const PROJECTS: Project[] = [
  { num: "01", objectType: "Дом культуры", city: "Минск", year: 2024,
    delivered: "Кресла М3-1 синие", photo: "/images/projects/01.jpg" },
  { num: "02", objectType: "Концертный зал", city: "Гомель", year: 2024,
    delivered: "Разноцветная посадка", photo: "/images/projects/02.jpg" },
  { num: "03", objectType: "ВУЗ-аудитория", city: "Брест", year: 2023,
    delivered: "Кресла М3 многоцветные", photo: "/images/projects/03.jpg" },
  { num: "04", objectType: "Дом культуры", city: "Витебск", year: 2023,
    delivered: "Цветовое зонирование", photo: "/images/projects/04.jpg" },
  { num: "05", objectType: "Концертный зал", city: "Могилёв", year: 2023,
    delivered: "Бордовые М3 — премиум", photo: "/images/projects/05.jpg" },
  { num: "06", objectType: "Театральный зал", city: "Гродно", year: 2022,
    delivered: "Бежевые кресла с дерев. боковинами", photo: "/images/projects/06.jpg" },
];

export function ProjectsTeaser() {
  const trackRef = useRef<HTMLOListElement | null>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`.${styles.item}`);
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const trackW = track.clientWidth;
    const perPage = Math.max(1, Math.round(trackW / cardW));
    setPageCount(Math.max(1, Math.ceil(PROJECTS.length / perPage)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`.${styles.item}`);
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const trackW = track.clientWidth;
    const perPage = Math.max(1, Math.round(trackW / cardW));
    const scrollX = track.scrollLeft;
    const idx = Math.round(scrollX / (cardW * perPage));
    setPage(idx);
    setCanPrev(scrollX > 4);
    setCanNext(scrollX + trackW < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`.${styles.item}`);
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const trackW = track.clientWidth;
    const perPage = Math.max(1, Math.round(trackW / cardW));
    track.scrollBy({ left: dir * (cardW + gap) * perPage, behavior: "smooth" });
  };

  const goToPage = (p: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`.${styles.item}`);
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const trackW = track.clientWidth;
    const perPage = Math.max(1, Math.round(trackW / cardW));
    track.scrollTo({ left: p * (cardW + gap) * perPage, behavior: "smooth" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); scrollBy(1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); scrollBy(-1); }
  };

  return (
    <section className={styles.section} aria-labelledby="proj-teaser-h2">
      <Reveal>
        <header className={styles.head}>
          <div className={styles.headInner}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden="true" />
              Портфолио
            </p>
            <h2 id="proj-teaser-h2" className={styles.title}>
              Реализованные проекты
            </h2>
            <p className={styles.lede}>
              За 18 лет мы оснастили театры, концертные залы и ВУЗы по всей
              Беларуси. Ниже — выборка последних поставок.
            </p>
          </div>
          <div className={styles.headControls}>
            <Link href="/proekty/" className={styles.headCta}>
              Все проекты
              <ArrowIcon variant="chevron" direction="right" size="0.85em" />
            </Link>
          </div>
        </header>
      </Reveal>

      <ol
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        role="region"
        aria-label="Карусель проектов"
        onKeyDown={onKey}
      >
        {PROJECTS.map((p) => (
          <li key={p.num} className={styles.item}>
            <div className={styles.photoFrame} aria-hidden="true">
              <Image
                src={p.photo}
                alt=""
                fill
                sizes="(max-width: 720px) 85vw, 33vw"
                className={styles.photo}
              />
              <div className={styles.scrim} />
            </div>

            <div className={styles.topRow}>
              <span className={styles.itemNum}>{p.num}</span>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.itemYear}>{p.year}</span>
            </div>

            <h3 className={styles.itemTitle}>{p.objectType}</h3>

            <div className={styles.bottomRow}>
              <div className={styles.metaCol}>
                <span className={styles.itemCity}>{p.city}</span>
                <span className={styles.itemDelivered}>{p.delivered}</span>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                <ArrowIcon variant="corner" direction="right" size="1.4em" />
              </span>
            </div>
          </li>
        ))}
      </ol>

      {pageCount > 1 && (
        <div className={styles.controls}>
          {/* Cinematic-timecode counter: large active page → small total */}
          <div className={styles.counter} aria-hidden="true">
            <span className={styles.counterActive}>{String(page + 1).padStart(2, "0")}</span>
            <span className={styles.counterSep}>/</span>
            <span className={styles.counterTotal}>{String(pageCount).padStart(2, "0")}</span>
          </div>

          {/* Segmented progress-track — клик по сегменту = jump на ту страницу */}
          <div className={styles.progress} role="tablist" aria-label="Страницы карусели">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === page}
                aria-label={`Страница ${i + 1} из ${pageCount}`}
                className={`${styles.segment} ${i === page ? styles.segmentActive : ""}`}
                onClick={() => goToPage(i)}
              />
            ))}
          </div>

          {/* Square arrow buttons — corner-arrow icon, slide-in accent fill on hover */}
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Предыдущие проекты"
            >
              <ArrowIcon variant="chevron" direction="left" size="0.95em" />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Следующие проекты"
            >
              <ArrowIcon variant="chevron" direction="right" size="0.95em" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
