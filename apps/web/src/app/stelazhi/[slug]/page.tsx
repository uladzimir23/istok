import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/shared/ui/PageShell";
import { ProductDetail } from "@/widgets/ProductDetail";
import { getCabinetBySubAndSlug, getCabinetsBySub } from "@/entities/product";

interface Params { slug: string; }

export function generateStaticParams(): Params[] {
  return getCabinetsBySub("stelazhi").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getCabinetBySubAndSlug("stelazhi", slug);
  if (!p) return {};
  return { title: p.name, description: p.summary };
}

export default async function StelazhPage({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getCabinetBySubAndSlug("stelazhi", slug);
  if (!product) notFound();
  const related = getCabinetsBySub("stelazhi")
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({ product: p, href: `/stelazhi/${p.slug}/` }));
  return (
    <PageShell crumbs={[{ label: "Корпусная", href: "/korpusnaya/" }, { label: "Стеллажи", href: "/stelazhi/" }, { label: product.name }]}>
      <ProductDetail
        product={product}
        categoryHref="/stelazhi/"
        categoryLabel="Все стеллажи"
        eyebrow="Корпусная мебель"
        related={related}
      />
    </PageShell>
  );
}
