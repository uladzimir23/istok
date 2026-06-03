import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import type { Brand } from "@/entities/product";

interface Props {
  children: React.ReactNode;
  brand?: Brand;
}

export function PageShell({ children, brand = "istok" }: Props) {
  const themeClass = brand === "elis" ? "elis-theme" : "istok-theme";
  return (
    <div data-brand={brand} className={themeClass}>
      <Header brand={brand} />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
