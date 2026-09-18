import Image from "next/image";
import type { Project } from "@/entities/project";
import { asset } from "@/shared/lib/assetPath";
import styles from "./ProjectsGrid.module.scss";

interface Props {
  projects: Project[];
  emptyText?: string;
}

// Полный грид портфолио для /proekty. Серверный компонент (без клиента) —
// в отличие от ProjectsTeaser (карусель на главной). Один источник данных:
// entities/project loader (content/projects/*.mdx, ADR-005).
export function ProjectsGrid({
  projects,
  emptyText = "Проекты скоро появятся — портфолио в работе.",
}: Props) {
  if (projects.length === 0) {
    return (
      <div className={`container ${styles.empty}`}>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <ol className={styles.grid}>
        {projects.map((p) => (
          <li key={p.slug} className={styles.card}>
            <div className={styles.photoFrame}>
              <Image
                src={asset(p.hero.src)}
                alt={p.hero.alt}
                fill
                sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                className={styles.photo}
              />
            </div>
            <div className={styles.meta}>
              <div className={styles.topRow}>
                <span className={styles.num}>{String(p.order).padStart(2, "0")}</span>
                <span className={styles.year}>{p.year}</span>
              </div>
              <h2 className={styles.title}>{p.objectType}</h2>
              <p className={styles.city}>{p.city}</p>
              <p className={styles.delivered}>{p.delivered}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export { ProjectsGrid as default };
