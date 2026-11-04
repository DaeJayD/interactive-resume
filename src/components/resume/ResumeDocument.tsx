import type { CSSProperties, ReactNode } from "react";
import { ResumeHeader } from "./ResumeHeader";
import { ResumePage } from "./ResumePage";
import { SkillsSection } from "./SkillsSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { ProjectsSection } from "./ProjectsSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ResumeConfiguration, ResumeSection } from "@/types/resume";

const defaultSections: ResumeSection[] = [
  { id: "summary", kind: "summary", title: "Summary" },
  { id: "skills", kind: "skills", title: "Skills" },
  { id: "education", kind: "education", title: "Education" },
  { id: "experience", kind: "experience", title: "Experience" },
  { id: "projects", kind: "projects", title: "Projects" },
  { id: "custom", kind: "custom", title: "Additional information" },
];
function select<T extends { id: string }>(
  entries: T[] = [],
  ids?: string[],
): T[] {
  if (!ids) return entries;
  return ids.flatMap((id) => entries.filter((entry) => entry.id === id));
}
function sectionContent(
  section: ResumeSection,
  resume: ResumeConfiguration,
): ReactNode {
  switch (section.kind) {
    case "summary": {
      const summary = resume.summary || resume.profile.shortSummary;
      return summary ? <p>{summary}</p> : null;
    }
    case "skills": {
      const entries = select(resume.skills, section.itemIds).filter(
        (entry) => entry.skills.length,
      );
      return entries.length ? <SkillsSection entries={entries} /> : null;
    }
    case "education": {
      const entries = select(resume.education, section.itemIds);
      return entries.length ? <EducationSection entries={entries} /> : null;
    }
    case "experience": {
      const entries = select(resume.experience, section.itemIds);
      return entries.length ? <ExperienceSection entries={entries} /> : null;
    }
    case "projects": {
      const entries = select(resume.projects, section.itemIds);
      return entries.length ? <ProjectsSection entries={entries} /> : null;
    }
    case "custom": {
      const entries = select(resume.customSections, section.itemIds).filter(
        (entry) => entry.entries.length,
      );
      return entries.length
        ? entries.map((group) => (
            <div className="custom-group" key={group.id}>
              <h3>{group.title}</h3>
              {group.entries.map((entry) => (
                <div className="entry" key={entry.id}>
                  <h4>{entry.title}</h4>
                  {entry.description && <p>{entry.description}</p>}
                </div>
              ))}
            </div>
          ))
        : null;
    }
  }
}
function safeColor(value?: string) {
  return value && /^#[0-9a-f]{6}$/i.test(value) ? value : undefined;
}
export function ResumeDocument({ resume }: { resume: ResumeConfiguration }) {
  const configured = resume.pages?.length
    ? resume.pages
    : [{ id: "resume", sections: defaultSections }];
  const pages = configured
    .map((page) => ({
      ...page,
      rendered: page.sections
        .map((section) => ({
          section,
          content: sectionContent(section, resume),
        }))
        .filter((item) => item.content !== null),
    }))
    .filter((page, index) => index === 0 || page.rendered.length > 0);
  const style = {
    "--accent": safeColor(resume.theme?.accent),
    "--paper": safeColor(resume.theme?.paper),
  } as CSSProperties;
  return (
    <article
      className="resume-document"
      aria-labelledby="resume-name"
      style={style}
      data-typography={resume.theme?.typography ?? "editorial"}
    >
      {pages.map((page, index) => (
        <ResumePage
          key={page.id}
          number={index + 1}
          total={pages.length}
          name={resume.profile.fullName}
        >
          {index === 0 && <ResumeHeader profile={resume.profile} />}
          {page.rendered.map(({ section, content }) => (
            <section
              key={section.id}
              aria-labelledby={`${page.id}-${section.id}`}
              className="resume-section"
            >
              <SectionHeading id={`${page.id}-${section.id}`}>
                {section.title}
              </SectionHeading>
              {content}
            </section>
          ))}
        </ResumePage>
      ))}
    </article>
  );
}
