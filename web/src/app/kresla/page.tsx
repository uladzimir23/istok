import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CategoryListing } from "@/widgets/CategoryListing";
import { getCategory } from "@/entities/category";
import { getProductsByCategory } from "@/entities/product";

const SLUG = "kresla";

export const metadata = {
  title: "Театральные кресла",
  description:
    "Кресла для театров, домов культуры, концертных залов. B2B / госзаказ.",
};

export default function KreslaPage() {
  const cat = getCategory(SLUG)!;
  const products = getProductsByCategory("chairs");
  return (
    <PageShell crumbs={[{ label: "Кресла" }]}>
      <PageHero eyebrow={cat.eyebrow} title={cat.title} description={cat.description} />
      <CategoryListing products={products} baseHref={`/${SLUG}/`} />
    </PageShell>
  );
}
