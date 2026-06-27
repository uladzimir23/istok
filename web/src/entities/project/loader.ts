import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { USE_PB } from "@/shared/lib/pocketbase";
import { Project, type Project as ProjectT } from "./schema";

const PROJECTS_DIR = path.resolve(process.cwd(), "..", "content", "projects");
const PB_SNAPSHOT = path.resolve(process.cwd(), ".pb", "projects.json");

let cache: ProjectT[] | null = null;

function loadAll(): ProjectT[] {
  if (cache) return cache;

  // Phase 2 (ADR-010): при USE_PB читаем prebuild-снапшот PB вместо MDX.
  if (USE_PB) {
    const arr = JSON.parse(fs.readFileSync(PB_SNAPSHOT, "utf8")) as unknown[];
    cache = arr
      .map((d) => Project.parse(d))
      .filter((p) => p.published)
      .sort((a, b) => a.order - b.order);
    return cache;
  }

  const projects: ProjectT[] = [];

  if (!fs.existsSync(PROJECTS_DIR)) {
    cache = [];
    return cache;
  }

  for (const entry of fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, entry.name), "utf8");
    const { data } = matter(raw);
    const parsed = Project.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid project ${entry.name}: ${parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`,
      );
    }
    if (parsed.data.published) projects.push(parsed.data);
  }

  // Сортировка по order — витринный индекс «01»…«NN» и порядок в карусели/гриде.
  cache = projects.sort((a, b) => a.order - b.order);
  return cache;
}

export function getAllProjects(): ProjectT[] {
  return loadAll();
}
