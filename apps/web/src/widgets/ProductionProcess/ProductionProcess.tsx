import { Reveal } from "@/shared/ui/Reveal";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import styles from "./ProductionProcess.module.scss";

interface Step {
  num: string;
  title: string;
  desc: string;
  duration: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Заготовка",
    desc: "Отбор бруса, MDF, металлокаркасов и обивочных тканей. Контроль партии у поставщика.",
    duration: "3–5 дней",
  },
  {
    num: "02",
    title: "Каркас",
    desc: "Фрезеровка, сборка деревянных и стальных элементов, контрольная примерка.",
    duration: "7–14 дней",
  },
  {
    num: "03",
    title: "Обивка",
    desc: "Крой ткани, формовка поролона, монтаж обивки, контроль качества каждого изделия.",
    duration: "5–10 дней",
  },
  {
    num: "04",
    title: "Отгрузка",
    desc: "Упаковка, маркировка, доставка нашим транспортом, монтаж в зале заказчика.",
    duration: "до 7 дней",
  },
];

export function ProductionProcess() {
  return (
    <section className={styles.section} aria-labelledby="process-h2">
      <Reveal>
        <header className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Производство
          </p>
          <h2 id="process-h2" className={styles.title}>
            От бруса до зала
          </h2>
          <p className={styles.lede}>
            Полный цикл на собственной площадке в Березино. От закупки сырья
            до монтажа в зале — всё под контролем одной команды.
          </p>
        </header>
      </Reveal>

      <ol className={styles.list}>
        {STEPS.map((s, i) => (
          <Reveal key={s.num} delay={i * 110}>
            <li className={styles.item}>
              <div className={styles.itemHead}>
                <span className={styles.num}>{s.num}</span>
                {i < STEPS.length - 1 && (
                  <span className={styles.connector} aria-hidden="true">
                    <ArrowIcon variant="chevron" direction="right" size="0.85em" />
                  </span>
                )}
              </div>

              <h3 className={styles.itemTitle}>{s.title}</h3>
              <p className={styles.itemDesc}>{s.desc}</p>

              <div className={styles.duration}>
                <span className={styles.durationLabel}>Срок</span>
                <span className={styles.durationValue}>{s.duration}</span>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={STEPS.length * 110}>
        <p className={styles.note}>
          Итоговый срок — от&nbsp;28&nbsp;до&nbsp;45&nbsp;дней в зависимости от объёма и
          сложности проекта. Точный график согласуем после получения ТЗ.
        </p>
      </Reveal>
    </section>
  );
}

export { ProductionProcess as default };
