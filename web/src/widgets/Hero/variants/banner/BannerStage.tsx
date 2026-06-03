import styles from "./BannerStage.module.scss";

interface Props {
  /** Глубина сцены — fullscreen (100dvh), 21:9, 16:9 или 5:7. */
  ratio?: "fullscreen" | "ultrawide" | "cinema" | "tall";
  /** Силу затенения сверху/снизу для читаемости overlay-текста. */
  scrim?: "none" | "soft" | "heavy";
  withVideo?: boolean;
  children: React.ReactNode;
}

export function BannerStage({
  ratio = "ultrawide",
  scrim = "heavy",
  withVideo = true,
  children,
}: Props) {
  return (
    <div className={`${styles.stage} ${styles[`ratio-${ratio}`]}`}>
      {withVideo ? (
        <video
          className={styles.media}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero/theater-poster.jpg"
        >
          <source
            src="/videos/hero/theater-mobile.mp4"
            media="(max-width: 720px)"
            type="video/mp4"
          />
          <source src="/videos/hero/theater-desktop.mp4" type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.media} src="/videos/hero/theater-poster.jpg" alt="" />
      )}
      {scrim !== "none" && (
        <div className={`${styles.scrim} ${styles[`scrim-${scrim}`]}`} aria-hidden="true" />
      )}
      <div className={styles.overlay}>{children}</div>
    </div>
  );
}
