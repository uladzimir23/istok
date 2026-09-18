import Link from "next/link";
import { BannerStage } from "./BannerStage";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import { Wordmark } from "@/shared/ui/Logo";
import styles from "./HeroBanner.module.scss";

export function HeroBanner() {
  return (
    <section className={styles.hero} aria-labelledby="hb-h1">
      <BannerStage ratio="fullscreen" scrim="heavy">
        <div className={styles.bottom}>
          <h1 id="hb-h1" className={styles.wordmarkWrap}>
            <span className={styles.srOnly}>Исток-Мебель</span>
            <Wordmark className={styles.wordmark} />
          </h1>
          <p className={styles.tagline}>
            Кресла, корпусная мебель, кроватки ELIS · Беларусь, с 2008
          </p>
          <div className={styles.foot}>
            <Link href="/kresla/" className={styles.cta}>
              Перейти в каталог
              <ArrowIcon variant="chevron" direction="right" size="0.85em" />
            </Link>
            <span className={styles.scrollCue} aria-hidden="true">
              <ArrowIcon variant="chevron" direction="down" size="0.8em" />
              scroll
            </span>
          </div>
        </div>
      </BannerStage>
    </section>
  );
}
