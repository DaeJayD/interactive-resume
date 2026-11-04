import type { Project } from "@/types/resume";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { webUrl } from "@/lib/links";
export function ProjectsSection({ entries }: { entries: Project[] }) {
  return (
    <div className="entries projects">
      {entries.map((project) => (
        <div className="entry" key={project.id} data-project-id={project.id}>
          <div className="entry-heading">
            <h3>{project.name}</h3>
            {project.status && (
              <p className="project-status">{project.status}</p>
            )}
          </div>
          {project.description && <p>{project.description}</p>}
          {!!project.technologies?.length && (
            <p className="technologies">{project.technologies.join(" / ")}</p>
          )}
          {(webUrl(project.githubUrl) || webUrl(project.liveUrl)) && (
            <p className="entry-links">
              {webUrl(project.githubUrl) && (
                <ExternalLink href={project.githubUrl}>
                  Repository<span className="sr-only"> for {project.name}</span>
                </ExternalLink>
              )}
              {webUrl(project.liveUrl) && (
                <ExternalLink href={project.liveUrl}>
                  Live project
                  <span className="sr-only"> for {project.name}</span>
                </ExternalLink>
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
