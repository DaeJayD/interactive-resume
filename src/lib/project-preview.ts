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

export function previewPosition(
  anchor: { left: number; right: number; top: number; bottom: number },
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
) {
  const margin = 16;
  const gap = 12;
  const rightFits = anchor.right + gap + panel.width <= viewport.width - margin;
  const leftFits = anchor.left - panel.width - gap >= margin;
  let left = rightFits
    ? anchor.right + gap
    : leftFits
      ? anchor.left - panel.width - gap
      : anchor.left;
  let maxHeight = Math.max(0, viewport.height - margin * 2);
  let top = Math.max(
    margin,
    Math.min(anchor.top, viewport.height - panel.height - margin),
  );
  if (!rightFits && !leftFits) {
    const below = viewport.height - margin - anchor.bottom - gap;
    const above = anchor.top - gap - margin;
    const available = Math.max(below, above);
    if (available >= 120) {
      maxHeight = available;
      top =
        below >= above
          ? anchor.bottom + gap
          : anchor.top - gap - Math.min(panel.height, available);
    }
  }
  left = Math.max(
    margin,
    Math.min(left, viewport.width - panel.width - margin),
  );
  return {
    left,
    top,
    maxHeight,
  };
}
