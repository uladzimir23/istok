import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CategoryListing } from "@/widgets/CategoryListing";
import { getCategory } from "@/entities/category";
import { getCabinetsBySub } from "@/entities/product";

const SLUG = "shkafy";

export const metadata = {
  title: "Шкафы",
  description: "Распашные и купе. Под индивидуальные размеры.",
};

export default function ShkafyPage() {
  const cat = getCategory(SLUG)!;
  const products = getCabinetsBySub("shkafy");
  return (
    <PageShell crumbs={[{ label: "Корпусная", href: "/korpusnaya/" }, { label: "Шкафы" }]}>
      <PageHero image="/images/categories/cabinets.jpg" eyebrow={cat.eyebrow} title={cat.title} description={cat.description} />
      <CategoryListing products={products} baseHref={`/${SLUG}/`} />
    </PageShell>
  );
}
