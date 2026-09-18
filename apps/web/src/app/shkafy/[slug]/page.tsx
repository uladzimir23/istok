import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/shared/ui/PageShell";
import { ProductDetail } from "@/widgets/ProductDetail";
import { getCabinetBySubAndSlug, getCabinetsBySub } from "@/entities/product";

interface Params { slug: string; }

export function generateStaticParams(): Params[] {
  return getCabinetsBySub("shkafy").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getCabinetBySubAndSlug("shkafy", slug);
  if (!p) return {};
  return { title: p.name, description: p.summary };
}

export default async function ShkafPage({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getCabinetBySubAndSlug("shkafy", slug);
  if (!product) notFound();
  const related = getCabinetsBySub("shkafy")
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({ product: p, href: `/shkafy/${p.slug}/` }));
  return (
    <PageShell crumbs={[{ label: "Корпусная", href: "/korpusnaya/" }, { label: "Шкафы", href: "/shkafy/" }, { label: product.name }]}>
      <ProductDetail
        product={product}
        categoryHref="/shkafy/"
        categoryLabel="Все шкафы"
        eyebrow="Корпусная мебель"
        related={related}
      />
    </PageShell>
  );
}
