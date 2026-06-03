import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/shared/ui/PageShell";
import { ProductDetail } from "@/widgets/ProductDetail";
import { getCabinetBySubAndSlug, getCabinetsBySub } from "@/entities/product";

interface Params { slug: string; }

export function generateStaticParams(): Params[] {
  return getCabinetsBySub("komody").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getCabinetBySubAndSlug("komody", slug);
  if (!p) return {};
  return { title: p.name, description: p.summary };
}

export default async function KomodPage({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getCabinetBySubAndSlug("komody", slug);
  if (!product) notFound();
  return (
    <PageShell>
      <ProductDetail
        product={product}
        categoryHref="/komody/"
        categoryLabel="Все комоды"
        eyebrow="Корпусная мебель"
      />
    </PageShell>
  );
}
