import Image from "next/image";
import clsx from "clsx";
import { SplitText } from "@/shared/ui/SplitText";
import { asset } from "@/shared/lib/assetPath";
import styles from "./PageHero.module.scss";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  // Фон-фото на всю высоту (100dvh). Без него — нейтральный фон.
  image?: string;
  imageAlt?: string;
}

export function PageHero({ eyebrow, title, description, image, imageAlt }: Props) {
  return (
    <section className={clsx(styles.hero, image && styles.hasImage)}>
      {image && (
        <div className={styles.bg} aria-hidden={imageAlt ? undefined : "true"}>
          <Image
            src={asset(image)}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className={styles.bgImg}
          />
          <div className={styles.scrim} />
        </div>
      )}
      <div className={`container ${styles.inner}`}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>
          {/* Above-the-fold → immediate рил по словам из маски. */}
          <SplitText text={title} immediate />
        </h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </section>
  );
}
