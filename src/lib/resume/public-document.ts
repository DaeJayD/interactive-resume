import type { ResumeConfiguration, ResumeSection, SectionKind } from "@/types/resume";

function visibleEntries<T extends { id: string }>(
  entries: T[] | undefined,
  sections: ResumeSection[],
  kind: SectionKind,
) {
  const matching = sections.filter((section) => section.kind === kind);
  if (matching.some((section) => section.itemIds === undefined)) return entries;

  const visibleIds = new Set(matching.flatMap((section) => section.itemIds ?? []));
  return entries?.filter((entry) => visibleIds.has(entry.id));
}

export function publicResumeDocument(draft: ResumeConfiguration): ResumeConfiguration {
  // The renderer uses every collection when there are no explicit page groupings.
  if (!draft.pages?.length) return draft;

  const sections = draft.pages.flatMap((page) => page.sections);
  return {
    ...draft,
    summary: sections.some((section) => section.kind === "summary") ? draft.summary : undefined,
    skills: visibleEntries(draft.skills, sections, "skills"),
    education: visibleEntries(draft.education, sections, "education"),
    experience: visibleEntries(draft.experience, sections, "experience"),
    projects: visibleEntries(draft.projects, sections, "projects"),
    customSections: visibleEntries(draft.customSections, sections, "custom"),
  };
}
