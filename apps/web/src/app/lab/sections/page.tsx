import { PageShell } from "@/shared/ui/PageShell";
import { CollectionSwitcher, type CollectionItem } from "@/widgets/CollectionSwitcher";
import { getProductsByCategory } from "@/entities/product";

export const metadata = {
  title: "Lab — sections",
  robots: { index: false, follow: false },
};

const CHAIR_LABELS: Record<string, string> = {
  m1: "М1",
  m2: "М2",
  m3: "М3",
  "m3-1": "М3-1",
  "m3-g": "М3-Г",
  "pm-1": "ПМ-1",
};

const CHAIR_DESCRIPTIONS: Record<string, string> = {
  m1: "Базовое театральное кресло с откидным сиденьем. Антивандальная обивка.",
  m2: "Конференц-вариант с подлокотниками. Усиленная конструкция.",
  m3: "Премиум-сегмент. Деревянные подлокотники, повышенный комфорт.",
  "m3-1": "Топовая модель. Высокая спинка, мягкое сиденье, расширенные опции.",
  "m3-g": "Гостевое исполнение М3. Без откидного сиденья.",
  "pm-1": "Полумягкое для образовательных и общественных пространств.",
};

const CHAIR_PRICES: Record<string, string> = {
  m1: "от 260 BYN",
  m2: "от 295 BYN",
  m3: "от 340 BYN",
  "m3-1": "от 380 BYN",
  "m3-g": "от 320 BYN",
  "pm-1": "от 215 BYN",
};

function toItem(p: { slug: string; name: string; summary: string; hero: { src: string; alt: string } }): CollectionItem {
  return {
    slug: p.slug,
    name: p.name,
    shortLabel: CHAIR_LABELS[p.slug] ?? p.name,
    description: CHAIR_DESCRIPTIONS[p.slug] ?? p.summary,
    priceLabel: CHAIR_PRICES[p.slug],
    hero: p.hero.src,
    thumb: p.hero.src,
    href: `/kresla/${p.slug}/`,
  };
}

function toCribItem(p: { slug: string; name: string; summary: string; hero: { src: string; alt: string } }): CollectionItem {
  return {
    slug: p.slug,
    name: p.name,
    shortLabel: p.name.toUpperCase(),
    description: p.summary,
    priceLabel: undefined,
    hero: p.hero.src,
    thumb: p.hero.src,
    href: `/krovatki/${p.slug}/`,
  };
}

export default function SectionsLabPage() {
  const chairs = getProductsByCategory("chairs").map(toItem);
  const cribs = getProductsByCategory("cribs").map(toCribItem);

  return (
    <PageShell>
      <header
        style={{
          padding: "var(--space-md) 0",
          borderBlockEnd: "1px solid var(--color-border-hairline)",
          background: "var(--color-surface-alt)",
        }}
      >
        <div className="container" style={{ display: "flex", gap: "var(--space-md)", alignItems: "baseline" }}>
          <span style={{ fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--color-accent)" }}>
            1
          </span>
          <h2 style={{ margin: 0, fontSize: "var(--text-xl)" }}>
            CollectionSwitcher — компактный каталог
          </h2>
          <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-foreground-muted)" }}>
            BOCA-style: chips-свитчер + showcase + round CTA. Reusable widget с props.
          </p>
        </div>
      </header>

      <CollectionSwitcher
        eyebrow="Коллекция · 2026"
        title="ТЕАТРАЛЬНЫЕ КРЕСЛА"
        items={chairs}
        defaultSlug="m3-1"
        catalogHref="/kresla/"
        catalogLabel="Все кресла →"
      />

      <hr style={{ border: 0, borderBlockStart: "1px solid var(--color-border-hairline)" }} />

      <CollectionSwitcher
        eyebrow="ELIS Kids Beds"
        title="ДЕТСКИЕ КРОВАТКИ"
        items={cribs}
        catalogHref="/krovatki/"
        catalogLabel="Все кроватки →"
      />
    </PageShell>
  );
}
