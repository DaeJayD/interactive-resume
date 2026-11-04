import type { Education } from "@/types/resume";
export function EducationSection({ entries }: { entries: Education[] }) {
  return (
    <div className="entries">
      {entries.map((entry) => (
        <div className="entry" key={entry.id}>
          <div className="entry-heading">
            <h3>{entry.program}</h3>
            {(entry.startDate || entry.endDate) && (
              <p className="dates">
                {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
              </p>
            )}
          </div>
          <p className="entry-subtitle">{entry.institution}</p>
          {entry.description && <p>{entry.description}</p>}
        </div>
      ))}
    </div>
  );
}
