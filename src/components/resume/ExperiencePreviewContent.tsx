"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { experienceDates, experienceSummary } from "@/lib/experience-preview";
import { webUrl } from "@/lib/links";
import type { Experience } from "@/types/resume";

export function ExperiencePreviewContent({
  experience,
}: {
  experience: Experience;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const dates = experienceDates(experience);
  const summary = experienceSummary(experience);
  const website = webUrl(experience.companyWebsite);
  return (
    <>
      {experience.previewImage && !imageFailed && (
        <Image
          className="entry-preview-image"
          src={experience.previewImage.src}
          alt={experience.previewImage.alt}
          width={640}
          height={360}
          unoptimized
          onError={() => setImageFailed(true)}
        />
      )}
      <p className="experience-preview-employer">{experience.employer}</p>
      {(dates || experience.location || experience.employmentType) && (
        <dl className="experience-preview-meta">
          {dates && (
            <div>
              <dt>Dates</dt>
              <dd>{dates}</dd>
            </div>
          )}
          {experience.employmentType && (
            <div>
              <dt>Type</dt>
              <dd>{experience.employmentType}</dd>
            </div>
          )}
          {experience.location && (
            <div>
              <dt>Location</dt>
              <dd>{experience.location}</dd>
            </div>
          )}
        </dl>
      )}
      {summary && <p className="entry-preview-description">{summary}</p>}
      {!!experience.responsibilities?.length && (
        <section
          className="experience-preview-duties"
          aria-label="Responsibilities"
        >
          <h3>Responsibilities</h3>
          <ul>
            {experience.responsibilities.map((responsibility, index) => (
              <li key={`${index}-${responsibility}`}>{responsibility}</li>
            ))}
          </ul>
        </section>
      )}
      {!!experience.technologies?.length && (
        <ul className="entry-preview-tags" aria-label="Technologies">
          {experience.technologies.map((technology, index) => (
            <li key={`${index}-${technology}`}>{technology}</li>
          ))}
        </ul>
      )}
      {website && (
        <nav
          className="entry-preview-links"
          aria-label={`${experience.employer} links`}
        >
          <ExternalLink href={website}>Company website</ExternalLink>
        </nav>
      )}
    </>
  );
}
