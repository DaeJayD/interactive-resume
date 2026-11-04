import { PaperSurface } from "@/components/paper/PaperSurface";
import type { ResumeConfiguration } from "@/types/resume";

export function ResumeDocument({ resume }: { resume: ResumeConfiguration }) {
  const { profile, summary, skills } = resume;
  const categories = skills.filter((group) => group.skills.length > 0);

  return (
    <PaperSurface>
      <header className="resume-header" data-profile-id={profile.id}>
        <p className="eyebrow">Curriculum vitae</p>
        <h1 id="resume-name">{profile.fullName}</h1>
        <p className="headline">{profile.headline}</p>
        {(profile.location || profile.email) && (
          <div className="contact">
            {profile.location && <span>{profile.location}</span>}
            {profile.email && <span>{profile.email}</span>}
          </div>
        )}
      </header>

      {summary && (
        <section aria-labelledby="summary-heading" className="resume-section">
          <h2 id="summary-heading">Profile</h2>
          <p>{summary}</p>
        </section>
      )}

      {categories.length > 0 && (
        <section aria-labelledby="skills-heading" className="resume-section">
          <h2 id="skills-heading">Skills</h2>
          <dl className="skills">
            {categories.map((group) => (
              <div key={group.id}>
                <dt>{group.category}</dt>
                <dd>{group.skills.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </PaperSurface>
  );
}
