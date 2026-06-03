import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CategoryListing } from "@/widgets/CategoryListing";
import { getCategory } from "@/entities/category";
import { getCabinetsBySub } from "@/entities/product";

const SLUG = "stoly";

export const metadata = {
  title: "Столы",
  description: "Обеденные, журнальные, рабочие столы.",
};

export default function StolyPage() {
  const cat = getCategory(SLUG)!;
  const products = getCabinetsBySub("stoly");
  return (
    <PageShell>
      <PageHero eyebrow={cat.eyebrow} title={cat.title} description={cat.description} />
      <CategoryListing products={products} baseHref={`/${SLUG}/`} />
    </PageShell>
  );
}
