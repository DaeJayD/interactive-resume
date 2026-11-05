import type { Project } from "@/types/resume";
import { webUrl } from "./links";

export function projectDescription(project: Project): string {
  return (
    project.detailedDescription?.trim() ||
    project.description?.trim() ||
    "Additional details have not been provided for this project."
  );
}

export function projectLinks(project: Project) {
  return [
    { id: "repository", label: "Repository", url: webUrl(project.githubUrl) },
    { id: "live", label: "Live project", url: webUrl(project.liveUrl) },
  ].filter((link): link is typeof link & { url: string } => !!link.url);
}
