import styles from "./App.module.scss";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { DirectionCard } from "./components/DirectionCard/DirectionCard";
import { ProductsPreview } from "./components/ProductsPreview/ProductsPreview";
import { Services } from "./components/Services/Services";
import { Portfolio } from "./components/Portfolio/Portfolio";
import { FAQ } from "./components/FAQ/FAQ";
import { ContactForm } from "./components/ContactForm/ContactForm";
import { TrustBlock } from "./components/TrustBlock/TrustBlock";
import { MessengerButtons } from "./components/MessengerButtons/MessengerButtons";
import { Footer } from "./components/Footer/Footer";
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher";
import { FontSwitcher } from "./components/FontSwitcher/FontSwitcher";
import { SurfaceSwitcher } from "./components/SurfaceSwitcher/SurfaceSwitcher";
import { DensitySwitcher } from "./components/DensitySwitcher/DensitySwitcher";
import { RadiusSwitcher } from "./components/RadiusSwitcher/RadiusSwitcher";
import { HeroSwitcher } from "./components/HeroSwitcher/HeroSwitcher";
import { CardSwitcher } from "./components/CardSwitcher/CardSwitcher";

import kreslaImg from "./assets/kresla.png";
import korpusnayaImg from "./assets/korpusnaya.png";
import krovatkiImg from "./assets/krovatki.png";

export default function App() {
  return (
    <div className={styles.root}>
      <Header />

      <main>
        <Hero />

        <section className={styles.directions}>
          <div className="container">
            <header className={styles.directionsHeader}>
              <span className={styles.eyebrow}>Три направления</span>
              <h2 className={styles.directionsTitle}>
                Кресла, корпусная мебель, детские кроватки.
              </h2>
              <p className={styles.directionsLead}>
                Один производственный комплекс — три аудитории. Кресла идут на
                госзаказ, корпусная — в дома и кабинеты, ELIS — для родителей.
              </p>
            </header>

            <div className={styles.grid}>
              <DirectionCard
                eyebrow="B2B / Госзаказ"
                title="Театральные кресла"
                summary="6 моделей М1, М2, М3, М3-1, М3-Г и ПМ-1. Полный цикл от проектирования до монтажа."
                href="#kresla"
                imageSrc={kreslaImg}
                imageAlt="Театральное кресло М3"
                ctaLabel="Запросить КП"
              />
              <DirectionCard
                eyebrow="B2B + B2C"
                title="Корпусная мебель"
                summary="Комоды, столы, стеллажи, шкафы. 12 позиций в каталоге, изготавливаем по индивидуальным размерам."
                href="#korpusnaya"
                imageSrc={korpusnayaImg}
                imageAlt="Корпусная мебель — комод"
                ctaLabel="Перейти в каталог"
              />
              <DirectionCard
                eyebrow="ELIS-MEBEL Kids Beds"
                title="Детские кроватки"
                summary="8 моделей «Элис» из натуральной берёзы. Гипоаллергенное покрытие, три размера спального места."
                href="#krovatki"
                imageSrc={krovatkiImg}
                imageAlt="Детская кроватка ELIS-MEBEL"
                ctaLabel="Смотреть кроватки"
              />
            </div>
          </div>
        </section>

        <ProductsPreview />
        <Services />
        <Portfolio />
        <TrustBlock />
        <FAQ />
        <ContactForm />
      </main>

      <Footer />
      <MessengerButtons />
      <ThemeSwitcher />
      <FontSwitcher />
      <SurfaceSwitcher />
      <DensitySwitcher />
      <RadiusSwitcher />
      <HeroSwitcher />
      <CardSwitcher />
    </div>
  );
}
