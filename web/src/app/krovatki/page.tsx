import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CategoryListing } from "@/widgets/CategoryListing";
import { getCategory } from "@/entities/category";
import { getProductsByCategory } from "@/entities/product";

const SLUG = "krovatki";

export const metadata = {
  title: "Детские кроватки ELIS",
  description:
    "Подростковые и детские кроватки из натуральной берёзы. 8 моделей, 3 размера спального места.",
};

export default function KrovatkiPage() {
  const cat = getCategory(SLUG)!;
  const products = getProductsByCategory("cribs");
  return (
    <PageShell brand="elis">
      <PageHero eyebrow={cat.eyebrow} title={cat.title} description={cat.description} />
      <CategoryListing products={products} baseHref={`/${SLUG}/`} />
    </PageShell>
  );
}
