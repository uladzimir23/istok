import styles from "./ProductsPreview.module.scss";
import { ProductMiniCard } from "./ProductMiniCard";

import cribNikol from "../../assets/products/crib-nikol.png";
import cribMelita from "../../assets/products/crib-melita.png";
import cribPaulina from "../../assets/products/crib-paulina.png";

import chairM1 from "../../assets/products/chair-m1.png";
import chairM3 from "../../assets/products/chair-m3.png";
import chairPm1 from "../../assets/products/chair-pm1.png";

import cabinetKomod from "../../assets/products/cabinet-komod.png";
import cabinetShkaf from "../../assets/products/cabinet-shkaf.png";
import cabinetStol from "../../assets/products/cabinet-stol.png";

export function ProductsPreview() {
  return (
    <section className={styles.root}>
      <div className="container">
        <div className={styles.section} id="kresla">
          <header className={styles.header}>
            <div className={styles.titleGroup}>
              <span className={styles.eyebrow}>Театральные кресла</span>
              <h2 className={styles.title}>6 моделей в каталоге</h2>
            </div>
            <a className={styles.allLink} href="#">Все модели →</a>
          </header>
          <div className={styles.grid}>
            <ProductMiniCard name="М1" meta="Базовая модель, 460 объектов" imageSrc={chairM1} href="#" />
            <ProductMiniCard name="М3" meta="С откидным сиденьем" imageSrc={chairM3} href="#" />
            <ProductMiniCard name="ПМ-1" meta="Премиум, бархат" imageSrc={chairPm1} href="#" />
          </div>
        </div>

        <div className={styles.section} id="korpusnaya">
          <header className={styles.header}>
            <div className={styles.titleGroup}>
              <span className={styles.eyebrow}>Корпусная мебель</span>
              <h2 className={styles.title}>12 моделей корпусной</h2>
            </div>
            <a className={styles.allLink} href="#">Весь каталог →</a>
          </header>
          <div className={styles.grid}>
            <ProductMiniCard name="Комод с 4 ящиками" meta="Берёза, белый" imageSrc={cabinetKomod} href="#" />
            <ProductMiniCard name="Шкаф 2-дверный" meta="С верхними секциями" imageSrc={cabinetShkaf} href="#" />
            <ProductMiniCard name="Стол с дверцей" meta="Письменный, 120 см" imageSrc={cabinetStol} href="#" />
          </div>
        </div>

        <div className={styles.section} id="krovatki">
          <header className={styles.header}>
            <div className={styles.titleGroup}>
              <span className={styles.eyebrow}>ELIS-MEBEL Kids Beds</span>
              <h2 className={styles.title}>8 моделей детских кроваток</h2>
            </div>
            <a className={styles.allLink} href="#">Все 8 моделей →</a>
          </header>
          <div className={styles.grid}>
            <ProductMiniCard name="Николь (Элис-1)" meta="3 размера, от 1600×800" imageSrc={cribNikol} href="#" />
            <ProductMiniCard name="Мелита (Элис-2)" meta="Двухъярусная, 50 кг" imageSrc={cribMelita} href="#" />
            <ProductMiniCard name="Паулина (Элис-3)" meta="3 размера, MDF" imageSrc={cribPaulina} href="#" />
          </div>
        </div>
      </div>
    </section>
  );
}
