import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { BrandTicker } from "@/widgets/BrandTicker";
import { StickyCrumbs, type Crumb } from "@/widgets/StickyCrumbs";
import { ScrollProgress } from "@/shared/ui/ScrollProgress";
import { GridLines } from "@/shared/ui/GridLines";
import type { Brand } from "@/entities/product";
import styles from "./PageShell.module.scss";

interface Props {
  children: React.ReactNode;
  brand?: Brand;
  // Хлебные крошки под-страницы (без «Главная» — добавится сама). Полоса
  // под хедером появляется по скроллу.
  crumbs?: Crumb[];
}

export function PageShell({ children, brand = "istok", crumbs }: Props) {
  const themeClass = brand === "elis" ? "elis-theme" : "istok-theme";
  const tickerText = brand === "elis" ? "ELIS · KIDS BEDS" : "ИСТОК · МЕБЕЛЬ";
  return (
    <div data-brand={brand} className={`${themeClass} ${styles.shell}`}>
      <GridLines count={15} />
      <ScrollProgress />
      <Header brand={brand} />
      {crumbs && crumbs.length > 0 && <StickyCrumbs items={crumbs} />}
      <main id="main-content">{children}</main>
      <Footer />
      <BrandTicker text={tickerText} />
    </div>
  );
}
