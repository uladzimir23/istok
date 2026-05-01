import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.root} id="contacts">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h2>ИСТОК-МЕБЕЛЬ</h2>
            <p>
              Мебельная фабрика полного цикла. Производим театральные кресла,
              корпусную мебель и детские кроватки ELIS-MEBEL.
            </p>
          </div>
          <div className={styles.col}>
            <h3>Контакты</h3>
            <ul>
              <li>
                <a href="tel:+375445947046">+375 (44) 594-70-46</a>
              </li>
              <li>
                <a href="tel:+375295873440">+375 (29) 587-34-40</a>
              </li>
              <li>
                <a href="mailto:istok-mebel@mail.ru">istok-mebel@mail.ru</a>
              </li>
              <li>
                <a
                  href="https://instagram.com/istok_etg"
                  target="_blank"
                  rel="noopener"
                >
                  Instagram @istok_etg
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.col}>
            <h3>Адреса</h3>
            <p className={styles.address}>
              <strong>Офис</strong>
              <br />
              Минск, ул. Краснозвёздная 18Б, 6 этаж
            </p>
            <p className={styles.address} style={{ marginTop: "var(--space-sm)" }}>
              <strong>Производство</strong>
              <br />
              г. Березино, ул. Зелёная 31
            </p>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 Исток-мебель. Все права защищены.</span>
          <span>Sandbox — рабочая площадка дизайн-системы.</span>
        </div>
      </div>
    </footer>
  );
}
