import styles from "./Portfolio.module.scss";

const PROJECTS = [
  { object: "Дом культуры «Юность»", location: "Минский район", delivered: "460 кресел М3", year: 2024 },
  { object: "Школа №42", location: "г. Брест", delivered: "230 кресел М1", year: 2024 },
  { object: "Концертный зал филармонии", location: "г. Гродно", delivered: "780 кресел М3-Г", year: 2023 },
  { object: "Актовый зал гимназии", location: "г. Витебск", delivered: "180 кресел ПМ-1", year: 2023 },
];

export function Portfolio() {
  return (
    <section className={styles.root} id="portfolio">
      <div className="container">
        <header className={styles.header}>
          <span className={styles.eyebrow}>Портфолио</span>
          <h2 className={styles.title}>
            Кресла, которые служат поколениям.
          </h2>
        </header>
        <div className={styles.grid}>
          {PROJECTS.map((p) => (
            <a key={p.object} className={styles.tile} href="#">
              <div className={styles.placeholder}>фото объекта</div>
              <div className={styles.body}>
                <span className={styles.object}>{p.object}</span>
                <span className={styles.meta}>{p.location}</span>
                <span className={styles.meta}>
                  {p.delivered}
                  <span className={styles.year}> · {p.year}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
        <p className={styles.note}>
          Демо-данные для песочницы. Реальные кейсы — при наличии материалов от клиента.
        </p>
      </div>
    </section>
  );
}
