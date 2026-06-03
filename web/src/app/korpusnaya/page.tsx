import Link from "next/link";
import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { CATEGORIES } from "@/entities/category";

export const metadata = {
  title: "Корпусная мебель",
  description: "Комоды, столы, стеллажи, шкафы. Производство в Березино.",
};

export default function KorpusnayaPage() {
  const subCats = CATEGORIES.filter((c) => c.source.type === "cabinet-sub");
  return (
    <PageShell>
      <PageHero
        eyebrow="Корпусная мебель"
        title="Комоды, столы, стеллажи, шкафы"
        description="Производство в Березино. Под индивидуальные размеры."
      />
      <div className="container" style={{ padding: "var(--space-2xl) 0" }}>
        <ul style={{ display: "grid", gap: "var(--space-md)", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", listStyle: "none", padding: 0 }}>
          {subCats.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${c.slug}/`}
                style={{
                  display: "block",
                  padding: "var(--space-lg)",
                  border: "1px solid var(--color-border-hairline)",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <h2 style={{ margin: 0, fontSize: "var(--text-xl)" }}>{c.title}</h2>
                <p style={{ margin: "var(--space-xs) 0 0", color: "var(--color-foreground-muted)" }}>
                  {c.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
