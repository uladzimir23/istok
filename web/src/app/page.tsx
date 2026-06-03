import { PageShell } from "@/shared/ui/PageShell";
import { HeroBanner } from "@/widgets/Hero";
import { CategoriesBoard } from "@/widgets/CategoriesBoard";
import { AboutStrip } from "@/widgets/AboutStrip";
import {
  CollectionSwitcher,
  type CollectionItem,
  type CollectionGroup,
} from "@/widgets/CollectionSwitcher";
import { ProjectsTeaser } from "@/widgets/ProjectsTeaser";
import { ProductionProcess } from "@/widgets/ProductionProcess";
import { Certificates } from "@/widgets/Certificates";
import { FAQ } from "@/widgets/FAQ";
import { CTABand } from "@/widgets/CTABand";
import {
  getProductsByCategory,
  getCabinetSubCategory,
  type CabinetSubCategory,
} from "@/entities/product";
import type { Product } from "@/entities/product";

const CHAIR_LABELS: Record<string, string> = {
  m1: "М1", m2: "М2", m3: "М3", "m3-1": "М3-1", "m3-g": "М3-Г", "pm-1": "ПМ-1",
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
  m1: "от 260 BYN", m2: "от 295 BYN", m3: "от 340 BYN",
  "m3-1": "от 380 BYN", "m3-g": "от 320 BYN", "pm-1": "от 215 BYN",
};

const CABINET_SUB_ORDER: CabinetSubCategory[] = ["komody", "stoly", "stelazhi", "shkafy"];
const CABINET_SUB_LABEL: Record<CabinetSubCategory, string> = {
  komody: "Комоды",
  stoly: "Столы",
  stelazhi: "Стеллажи",
  shkafy: "Шкафы",
};

function toChairItem(p: Product): CollectionItem {
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

function toCribItem(p: Product): CollectionItem {
  return {
    slug: p.slug,
    name: p.name,
    shortLabel: p.name.toUpperCase(),
    description: p.summary,
    hero: p.hero.src,
    thumb: p.hero.src,
    href: `/krovatki/${p.slug}/`,
  };
}

function toCabinetItem(p: Product, sub: CabinetSubCategory, indexInSub: number): CollectionItem {
  return {
    slug: p.slug,
    // Короткий лейбл chip'а — просто порядковый номер в группе
    // (типа «01», «02»). Подкатегория уже видна в верхнем tab'е.
    shortLabel: String(indexInSub + 1).padStart(2, "0"),
    name: p.name,
    description: p.summary,
    hero: p.hero.src,
    thumb: p.hero.src,
    href: `/${sub}/${p.slug}/`,
  };
}

function buildCabinetGroups(products: Product[]): CollectionGroup[] {
  const buckets: Record<CabinetSubCategory, Product[]> = {
    komody: [], stoly: [], stelazhi: [], shkafy: [],
  };
  for (const p of products) {
    const sub = getCabinetSubCategory(p);
    if (sub) buckets[sub].push(p);
  }
  return CABINET_SUB_ORDER.map((sub) => ({
    key: sub,
    label: CABINET_SUB_LABEL[sub],
    items: buckets[sub].map((p, i) => toCabinetItem(p, sub, i)),
  })).filter((g) => g.items.length > 0);
}

export default function Home() {
  const chairs = getProductsByCategory("chairs").map(toChairItem);
  const cribs = getProductsByCategory("cribs").map(toCribItem);
  const cabinetGroups = buildCabinetGroups(getProductsByCategory("cabinets"));

  return (
    <PageShell>
      <HeroBanner />
      <CategoriesBoard />
      <AboutStrip />
      <ProductionProcess />
      <CollectionSwitcher
        eyebrow="Коллекция · 2026"
        title="ТЕАТРАЛЬНЫЕ КРЕСЛА"
        items={chairs}
        defaultSlug="m3-1"
        catalogHref="/kresla/"
        catalogLabel="Все кресла"
        withAmbient
      />
      <CollectionSwitcher
        eyebrow="Производство · Берёза + MDF"
        title="КОРПУСНАЯ МЕБЕЛЬ"
        groups={cabinetGroups}
        catalogHref="/korpusnaya/"
        catalogLabel="Вся корпусная"
        withAmbient
      />
      <ProjectsTeaser />
      <Certificates />
      <CollectionSwitcher
        eyebrow="ELIS Kids Beds"
        title="ДЕТСКИЕ КРОВАТКИ"
        items={cribs}
        catalogHref="/krovatki/"
        catalogLabel="Все кроватки"
        withAmbient
      />
      <FAQ />
      <CTABand />
    </PageShell>
  );
}
