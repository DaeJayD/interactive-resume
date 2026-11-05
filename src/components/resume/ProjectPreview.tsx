"use client";
import type { Project } from "@/types/resume";
import { PreviewTrigger } from "./ContextualPreview";
export function ProjectTrigger({ project }: { project: Project }) {
  return <PreviewTrigger entry={{ kind: "project", project }} />;
}
