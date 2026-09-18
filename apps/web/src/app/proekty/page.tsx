import { PageShell } from "@/shared/ui/PageShell";
import { PageHero } from "@/shared/ui/PageHero";
import { ProjectsGrid } from "@/widgets/ProjectsGrid";
import { CTABand } from "@/widgets/CTABand";
import { getAllProjects } from "@/entities/project";

export const metadata = {
  title: "Проекты",
  description:
    "Портфолио поставок театральных и зрительских кресел: дома культуры, концертные залы, ВУЗ-аудитории по всей Беларуси.",
};

export default function ProektyPage() {
  const projects = getAllProjects();
  return (
    <PageShell crumbs={[{ label: "Проекты" }]}>
      <PageHero image="/images/categories/projects.jpg"
        eyebrow="Портфолио"
        title="Реализованные проекты"
        description="За 18 лет мы оснастили театры, концертные залы и ВУЗ-аудитории по всей Беларуси. Ниже — выборка поставок зрительских кресел."
      />
      <ProjectsGrid projects={projects} />
      <CTABand />
    </PageShell>
  );
}
