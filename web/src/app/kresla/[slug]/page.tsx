import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/shared/ui/PageShell";
import { ProductDetail } from "@/widgets/ProductDetail";
import { getProductBySlug, getProductsByCategory } from "@/entities/product";

interface Params { slug: string; }

export function generateStaticParams(): Params[] {
  return getProductsByCategory("chairs").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug("chairs", slug);
  if (!p) return {};
  return { title: p.name, description: p.summary };
}

export default async function KresloPage({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProductBySlug("chairs", slug);
  if (!product) notFound();
  return (
    <PageShell
      crumbs={[{ label: "Кресла", href: "/kresla/" }, { label: product.name }]}
    >
      <ProductDetail
        product={product}
        categoryHref="/kresla/"
        categoryLabel="Все кресла"
        eyebrow="B2B / Госзаказ"
      />
    </PageShell>
  );
}
