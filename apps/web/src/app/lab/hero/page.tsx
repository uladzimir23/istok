import { PageShell } from "@/shared/ui/PageShell";
import {
  HeroBanner,
  HeroBranded,
  HeroCinematic,
  HeroSplit,
  HeroEditorial,
  HeroTriptych,
  HeroMagazine,
  HeroMarquee,
} from "@/widgets/Hero/variants";

export const metadata = {
  title: "Lab — Hero variants (archive)",
  robots: { index: false, follow: false },
};

interface VariantBlockProps {
  letter: string;
  name: string;
  description: string;
  children: React.ReactNode;
}

function VariantBlock({ letter, name, description, children }: VariantBlockProps) {
  return (
    <article>
      <header
        style={{
          padding: "var(--space-md) 0",
          borderBlockEnd: "1px solid var(--color-border-hairline)",
          background: "var(--color-surface-alt)",
        }}
      >
        <div className="container" style={{ display: "flex", gap: "var(--space-md)", alignItems: "baseline" }}>
          <span style={{ fontWeight: 800, fontSize: "var(--text-2xl)", color: "var(--color-accent)" }}>
            {letter}
          </span>
          <h2 style={{ margin: 0, fontSize: "var(--text-xl)", fontWeight: 700 }}>{name}</h2>
          <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-foreground-muted)" }}>
            {description}
          </p>
        </div>
      </header>
      {children}
    </article>
  );
}

export default function HeroLabPage() {
  return (
    <PageShell>
      <VariantBlock letter="✓ E1" name="Banner (выбран в прод)" description="Cinemascope wordmark snake. На главной /">
        <HeroBanner />
      </VariantBlock>

      <VariantBlock letter="I" name="Branded shape" description="Без видео — silhouette + типографика. Backup-вариант под inner-страницы.">
        <HeroBranded />
      </VariantBlock>

      <VariantBlock letter="F" name="Triptych board" description="3 цветовые панели направлений">
        <HeroTriptych />
      </VariantBlock>

      <VariantBlock letter="G" name="Magazine cover" description="Editorial-обложка">
        <HeroMagazine />
      </VariantBlock>

      <VariantBlock letter="H" name="Marquee + product strip" description="Бегущая строка + лента моделей">
        <HeroMarquee />
      </VariantBlock>

      <VariantBlock letter="A" name="Cinematic Dark" description="Video + KPI">
        <HeroCinematic />
      </VariantBlock>

      <VariantBlock letter="B" name="Split Editorial" description="60/40 без видео">
        <HeroSplit />
      </VariantBlock>

      <VariantBlock letter="C" name="Editorial Minimalism" description="Чистая типографика">
        <HeroEditorial />
      </VariantBlock>
    </PageShell>
  );
}
