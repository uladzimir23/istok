import styles from "./ProductMiniCard.module.scss";

interface ProductMiniCardProps {
  name: string;
  meta: string;
  imageSrc: string;
  href: string;
}

export function ProductMiniCard({ name, meta, imageSrc, href }: ProductMiniCardProps) {
  return (
    <a className={styles.root} href={href}>
      <div className={styles.media}>
        <img src={imageSrc} alt={name} loading="lazy" />
      </div>
      <div className={styles.body}>
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
    </a>
  );
}
