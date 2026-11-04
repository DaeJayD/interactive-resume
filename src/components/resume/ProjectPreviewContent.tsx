"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/types/resume";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { projectDescription, projectLinks } from "@/lib/project-preview";
import { webUrl } from "@/lib/links";

export function ProjectPreviewContent({ project }: { project: Project }) {
  const image = project.image ?? project.gallery?.[0];
  const [imageFailed, setImageFailed] = useState(false);
  const links = projectLinks(project);
  const video = webUrl(project.demoVideo);
  return (
    <>
      {image && !imageFailed ? (
        <Image
          className="project-preview-image"
          src={image.src}
          alt={image.alt}
          width={640}
          height={360}
          unoptimized
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="project-preview-text-cover">
          <span>Project overview</span>
          <span>{project.status || "Selected work"}</span>
        </div>
      )}
      <p className="project-preview-description">
        {projectDescription(project)}
      </p>
      {!!project.technologies?.length && (
        <ul className="project-preview-tags" aria-label="Technologies">
          {project.technologies.map((technology, index) => (
            <li key={`${technology}-${index}`}>{technology}</li>
          ))}
        </ul>
      )}
      {(links.length > 0 || video) && (
        <nav
          className="project-preview-links"
          aria-label={`${project.name} links`}
        >
          {links.map((link) => (
            <ExternalLink key={link.id} href={link.url}>
              {link.label}
            </ExternalLink>
          ))}
          {video && <ExternalLink href={video}>Demo video</ExternalLink>}
        </nav>
      )}
    </>
  );
}
