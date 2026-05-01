import styles from "./DirectionCard.module.scss";

interface DirectionCardProps {
  eyebrow: string;
  title: string;
  summary: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  ctaLabel: string;
}

export function DirectionCard({
  eyebrow,
  title,
  summary,
  href,
  imageSrc,
  imageAlt,
  ctaLabel,
}: DirectionCardProps) {
  return (
    <a className={styles.root} href={href}>
      <div className={styles.media}>
        <img src={imageSrc} alt={imageAlt} loading="lazy" />
      </div>
      <div className={styles.body}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>
        <span className={styles.linkRow}>
          {ctaLabel} <span className={styles.arrow}>→</span>
        </span>
      </div>
    </a>
  );
}
