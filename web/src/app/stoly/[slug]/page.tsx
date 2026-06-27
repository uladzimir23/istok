import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/shared/ui/PageShell";
import { ProductDetail } from "@/widgets/ProductDetail";
import { getCabinetBySubAndSlug, getCabinetsBySub } from "@/entities/product";

interface Params { slug: string; }

export function generateStaticParams(): Params[] {
  return getCabinetsBySub("stoly").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getCabinetBySubAndSlug("stoly", slug);
  if (!p) return {};
  return { title: p.name, description: p.summary };
}

export default async function StolPage({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getCabinetBySubAndSlug("stoly", slug);
  if (!product) notFound();
  return (
    <PageShell crumbs={[{ label: "Корпусная", href: "/korpusnaya/" }, { label: "Столы", href: "/stoly/" }, { label: product.name }]}>
      <ProductDetail
        product={product}
        categoryHref="/stoly/"
        categoryLabel="Все столы"
        eyebrow="Корпусная мебель"
      />
    </PageShell>
  );
}
