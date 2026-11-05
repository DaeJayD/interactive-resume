import type { Experience, Project } from "@/types/resume";

export type PreviewEntry =
  | { kind: "project"; project: Project }
  | { kind: "experience"; experience: Experience };

export function previewTitle(entry: PreviewEntry): string {
  return entry.kind === "project" ? entry.project.name : entry.experience.title;
}

export function previewTriggerLabel(entry: PreviewEntry): string {
  return entry.kind === "project"
    ? `Preview ${entry.project.name}`
    : `Preview ${entry.experience.title} at ${entry.experience.employer}`;
}
