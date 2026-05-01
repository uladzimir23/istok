import styles from "./TrustBlock.module.scss";

export function TrustBlock() {
  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.value}>~⅓</span>
            <span className={styles.label}>
              Госзаказа на театральные кресла в Беларуси выполняется фабрикой.
            </span>
            <span className={styles.note}>По собственным данным компании.</span>
          </div>
          <div className={styles.item}>
            <span className={styles.value}>2</span>
            <span className={styles.label}>
              Площадки: офис в Минске и собственное производство в Березино.
            </span>
            <span className={styles.note}>Полный цикл — без посредников.</span>
          </div>
          <div className={styles.item}>
            <span className={styles.value}>8+6+12</span>
            <span className={styles.label}>
              Моделей в каталоге: 8 кроваток ELIS, 6 театральных кресел, 12
              позиций корпусной мебели.
            </span>
            <span className={styles.note}>Доставка, сборка, монтаж — наши.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
