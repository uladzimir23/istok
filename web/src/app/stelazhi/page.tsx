import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CategoryListing } from "@/widgets/CategoryListing";
import { getCategory } from "@/entities/category";
import { getCabinetsBySub } from "@/entities/product";

const SLUG = "stelazhi";

export const metadata = {
  title: "Стеллажи",
  description: "Открытые стеллажи для гостиной, офиса, библиотек.",
};

export default function StelazhiPage() {
  const cat = getCategory(SLUG)!;
  const products = getCabinetsBySub("stelazhi");
  return (
    <PageShell crumbs={[{ label: "Корпусная", href: "/korpusnaya/" }, { label: "Стеллажи" }]}>
      <PageHero eyebrow={cat.eyebrow} title={cat.title} description={cat.description} />
      <CategoryListing products={products} baseHref={`/${SLUG}/`} />
    </PageShell>
  );
}
