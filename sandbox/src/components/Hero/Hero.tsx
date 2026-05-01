import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.inner}>
          <span className={styles.eyebrow}>Мебельная фабрика, Минск + Березино</span>
          <h1 className={styles.title}>
            Производим мебель,
            <br />
            <span className={styles.titleAccent}>которая держится десятилетиями.</span>
          </h1>
          <p className={styles.lead}>
            Театральные кресла для залов, корпусная мебель для дома и офиса,
            детские кроватки ELIS-MEBEL. Полный цикл собственного производства,
            гарантийное и постгарантийное обслуживание.
          </p>
          <div className={styles.ctas}>
            <a className={styles.ctaPrimary} href="#contacts">
              Запросить коммерческое предложение
            </a>
            <a className={styles.ctaSecondary} href="#krovatki">
              Каталог детских кроваток
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
