import styles from "./Hero.module.scss";
import heroBg from "../../assets/hero-bg.png";
import heroSide from "../../assets/hero-side.png";

export function Hero() {
  return (
    <section
      className={styles.root}
      style={
        {
          "--bg-img": `url(${heroBg})`,
          "--side-img": `url(${heroSide})`,
        } as React.CSSProperties
      }
    >
      <div className={`container ${styles.split}`}>
        <div className={styles.textPane}>
          <div className={styles.inner}>
            <span className={styles.eyebrow}>
              Мебельная фабрика, Минск + Березино
            </span>
            <h1 className={styles.title}>
              Производим мебель,
              <br />
              <span className={styles.titleAccent}>
                которая держится десятилетиями.
              </span>
            </h1>
            <p className={styles.lead}>
              Театральные кресла для залов, корпусная мебель для дома и офиса,
              детские кроватки ELIS-MEBEL. Полный цикл собственного производства,
              гарантийное и постгарантийное обслуживание.
            </p>
            <div className={styles.ctas}>
              <a className={styles.ctaPrimary} href="#contact-form">
                Запросить коммерческое предложение
              </a>
              <a className={styles.ctaSecondary} href="#krovatki">
                Каталог детских кроваток
              </a>
            </div>
          </div>
        </div>
        <div className={styles.media} aria-hidden />
      </div>
    </section>
  );
}
