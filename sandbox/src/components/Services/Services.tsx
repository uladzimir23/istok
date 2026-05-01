import styles from "./Services.module.scss";

const SERVICES = [
  {
    title: "Доставка по Беларуси",
    body: "Собственный транспорт. По Минску — день в день, по областям — 1–3 дня. Точные сроки уточняем при заказе.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h11v10H3z" />
        <path d="M14 10h4l3 3v4h-7" />
        <circle cx="6.5" cy="18.5" r="1.5" />
        <circle cx="17.5" cy="18.5" r="1.5" />
      </svg>
    ),
  },
  {
    title: "Сборка и монтаж",
    body: "Наши специалисты собирают мебель на месте. Для госзаказа — полный монтаж кресел в зале «под ключ».",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 00-5.4 5.4l-7 7 2 2 7-7a4 4 0 005.4-5.4l-2 2-2-2 2-2z" />
      </svg>
    ),
  },
  {
    title: "Гарантия 12 месяцев",
    body: "На все изделия — гарантия по белорусскому законодательству. Конструкция, фурнитура, лакокрасочное покрытие.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Постгарантийка",
    body: "Ремонт, замена комплектующих, реставрация. Поддерживаем мебель и через 5–10 лет после поставки.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0114-7.5L20 7" />
        <path d="M20 3v4h-4" />
        <path d="M21 12a9 9 0 01-14 7.5L4 17" />
        <path d="M4 21v-4h4" />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <section className={styles.root} id="uslugi">
      <div className="container">
        <header className={styles.header}>
          <span className={styles.eyebrow}>Услуги</span>
          <h2 className={styles.title}>Поставляем, собираем, обслуживаем.</h2>
          <p className={styles.lead}>
            Полный цикл — от КП до постгарантийной поддержки. Нашими руками, без
            подрядчиков.
          </p>
        </header>
        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <div key={s.title} className={styles.card}>
              <div className={styles.iconWrap}>{s.icon}</div>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardBody}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
