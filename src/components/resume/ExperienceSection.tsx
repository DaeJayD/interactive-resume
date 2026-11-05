import type { Experience } from "@/types/resume";
import { PreviewTrigger } from "./ContextualPreview";
import { ExternalLink } from "@/components/ui/ExternalLink";
export function ExperienceSection({ entries }: { entries: Experience[] }) {
  return (
    <div className="entries">
      {entries.map((entry) => (
        <div className="entry" key={entry.id} data-experience-id={entry.id}>
          <div className="entry-heading">
            <h3>
              <PreviewTrigger
                entry={{ kind: "experience", experience: entry }}
              />
            </h3>
            {(entry.startDate || entry.endDate) && (
              <p className="dates">
                {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
              </p>
            )}
          </div>
          <p className="entry-subtitle">
            <ExternalLink href={entry.companyWebsite}>
              {entry.employer}
            </ExternalLink>
            {entry.employmentType && ` · ${entry.employmentType}`}
            {entry.location && ` · ${entry.location}`}
          </p>
          {entry.summary && <p>{entry.summary}</p>}
          {!!entry.responsibilities?.length && (
            <ul>
              {entry.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {!!entry.technologies?.length && (
            <p className="technologies">{entry.technologies.join(" / ")}</p>
          )}
        </div>
      ))}
    </div>
  );
}
