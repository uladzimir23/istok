import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.root}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.logo} href="#">
          <span className={styles.logoMark} />
          ИСТОК-МЕБЕЛЬ
        </a>
        <nav className={styles.nav} aria-label="Главное меню">
          <ul>
            <li><a href="#kresla">Театральные кресла</a></li>
            <li><a href="#korpusnaya">Корпусная мебель</a></li>
            <li><a href="#krovatki">Детские кроватки</a></li>
            <li><a href="#portfolio">Портфолио</a></li>
            <li><a href="#uslugi">Услуги</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </nav>
        <div className={styles.actions}>
          <a className={styles.phone} href="tel:+375445947046">
            +375 (44) 594-70-46
          </a>
          <a className={styles.cta} href="#contact-form">
            Запросить КП
          </a>
        </div>
      </div>
    </header>
  );
}
