import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { BrandTicker } from "@/widgets/BrandTicker";
import { ScrollProgress } from "@/shared/ui/ScrollProgress";
import { GridLines } from "@/shared/ui/GridLines";
import type { Brand } from "@/entities/product";
import styles from "./PageShell.module.scss";

interface Props {
  children: React.ReactNode;
  brand?: Brand;
}

export function PageShell({ children, brand = "istok" }: Props) {
  const themeClass = brand === "elis" ? "elis-theme" : "istok-theme";
  const tickerText = brand === "elis" ? "ELIS · KIDS BEDS" : "ИСТОК · МЕБЕЛЬ";
  return (
    <div data-brand={brand} className={`${themeClass} ${styles.shell}`}>
      <GridLines count={8} />
      <ScrollProgress />
      <Header brand={brand} />
      <main id="main-content">{children}</main>
      <Footer />
      <BrandTicker text={tickerText} />
    </div>
  );
}
