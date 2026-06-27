import { SplitText } from "@/shared/ui/SplitText";
import styles from "./PageHero.module.scss";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: Props) {
  return (
    <section className={styles.hero}>
      <div className="container">
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
