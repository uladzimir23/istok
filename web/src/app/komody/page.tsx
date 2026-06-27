import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CategoryListing } from "@/widgets/CategoryListing";
import { getCategory } from "@/entities/category";
import { getCabinetsBySub } from "@/entities/product";

const SLUG = "komody";

export const metadata = {
  title: "Комоды",
  description: "Комоды с ящиками и дверцами под индивидуальные размеры.",
};

export default function KomodyPage() {
  const cat = getCategory(SLUG)!;
  const products = getCabinetsBySub("komody");
  return (
    <PageShell crumbs={[{ label: "Корпусная", href: "/korpusnaya/" }, { label: "Комоды" }]}>
      <PageHero eyebrow={cat.eyebrow} title={cat.title} description={cat.description} />
      <CategoryListing products={products} baseHref={`/${SLUG}/`} />
    </PageShell>
  );
}
