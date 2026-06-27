import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/shared/ui/PageShell";
import { ProductDetail } from "@/widgets/ProductDetail";
import { getProductBySlug, getProductsByCategory } from "@/entities/product";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return getProductsByCategory("cribs").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug("cribs", slug);
  if (!p) return {};
  return { title: p.name, description: p.summary };
}

export default async function KrovatkaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProductBySlug("cribs", slug);
  if (!product) notFound();
  return (
    <PageShell brand="elis" crumbs={[{ label: "Кроватки ELIS", href: "/krovatki/" }, { label: product.name }]}>
      <ProductDetail
        product={product}
        categoryHref="/krovatki/"
        categoryLabel="Все кроватки ELIS"
        eyebrow="ELIS Kids Beds"
      />
    </PageShell>
  );
}
