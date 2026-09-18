import Link from "next/link";
import { Reveal } from "@/shared/ui/Reveal";
import { ArrowIcon } from "@/shared/ui/ArrowIcon";
import styles from "./FAQ.module.scss";

interface QA {
  q: string;
  a: React.ReactNode;
}

const FAQS: QA[] = [
  {
    q: "Какой минимальный объём заказа?",
    a: (
      <>
        От 1 единицы для пилотного образца, от 20 — для серийной поставки. По
        корпусной мебели — без минимума. Для государственных тендеров работаем
        по техническому заданию заказчика.
      </>
    ),
  },
  {
    q: "Какие сроки производства?",
    a: (
      <>
        Стандартный цикл — 28&nbsp;– 45&nbsp;дней с момента подписания договора. На
        крупные партии (от 300&nbsp;кресел) — индивидуально, обычно до 60&nbsp;дней.
        Точный график согласуем после получения ТЗ и предоплаты.
      </>
    ),
  },
  {
    q: "Можно ли изменить цвет, обивку, комплектацию?",
    a: (
      <>
        Да. Цвет каркаса — по RAL, обивка — любая ткань из нашей библиотеки
        или предоставленная заказчиком. Подлокотники, нумерация ряда/места,
        логотип на спинке — опционально. Прислать образец ткани для согласования
        можно почтой или с курьером.
      </>
    ),
  },
  {
    q: "Доставляете ли в Россию и страны СНГ?",
    a: (
      <>
        По Беларуси — собственным транспортом, бесплатно при заказе от 50&nbsp;единиц.
        По СНГ — через проверенные транспортные компании (СДЭК, ПЭК, Деловые
        линии). По ЕС — индивидуально, чаще через белорусский пограничный склад
        заказчика.
      </>
    ),
  },
  {
    q: "Работаете ли по тендерным закупкам?",
    a: (
      <>
        Да, с 2008&nbsp;года. Поставили кресла примерно в треть залов Беларуси по
        государственному заказу. Все сертификаты, паспорта изделий, протоколы
        испытаний — готовы предоставить по запросу. Опыт с площадками
        gov.by и через посредника-интегратора.
      </>
    ),
  },
  {
    q: "Как происходит оплата для юридических лиц?",
    a: (
      <>
        Безнал — через банковский счёт (BYN, RUB, USD, EUR). Стандартно: 30&nbsp;%
        предоплата, 70&nbsp;% по факту готовности к отгрузке. Для бюджетных
        учреждений — оплата после получения товара и подписания акта. ЕРИП
        для физлиц.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section className={styles.section} aria-labelledby="faq-h2">
      <div className={styles.layout}>
        <Reveal>
          <header className={styles.head}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} aria-hidden="true" />
              Часто спрашивают
            </p>
            <h2 id="faq-h2" className={styles.title}>
              Вопросы и ответы
            </h2>
            <p className={styles.lede}>
              Кратко по типовым ситуациям. Если ответа здесь нет — напишите,
              свяжемся в течение рабочего дня.
            </p>
            <Link href="/contacts/" className={styles.cta}>
              Задать свой вопрос
              <ArrowIcon variant="chevron" direction="right" size="0.85em" />
            </Link>
          </header>
        </Reveal>

        <div className={styles.list}>
          {FAQS.map((qa, i) => (
            <Reveal key={qa.q} delay={i * 80}>
              <details className={styles.item} name="faq-istok">
                <summary className={styles.summary}>
                  <span className={styles.num} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.q}>{qa.q}</span>
                  <span className={styles.icon} aria-hidden="true">
                    <span className={styles.iconBar} />
                    <span className={`${styles.iconBar} ${styles.iconBarV}`} />
                  </span>
                </summary>
                <div className={styles.answer}>
                  <p>{qa.a}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FAQ as default };
