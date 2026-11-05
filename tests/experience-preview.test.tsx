import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperiencePreviewContent } from "../src/components/resume/ExperiencePreviewContent";
import {
  ResumePreviewProvider,
  PreviewTrigger,
} from "../src/components/resume/ContextualPreview";
import {
  experienceDates,
  experienceSummary,
} from "../src/lib/experience-preview";
import { previewTriggerLabel } from "../src/lib/preview";
import type { Experience } from "../src/types/resume";

const minimal: Experience = {
  id: "studio",
  employer: "Example studio",
  title: "Designer",
};
test("minimal experience renders without inventing dates, links, or media", () => {
  const html = renderToStaticMarkup(
    <ExperiencePreviewContent experience={minimal} />,
  );
  assert.match(html, /Example studio/);
  assert.match(html, /Additional professional details/);
  assert.doesNotMatch(html, /Dates|Present|<nav|<img|undefined/);
});
test("dates preserve partial and present values without assuming ongoing employment", () => {
  assert.equal(experienceDates(minimal), undefined);
  assert.equal(experienceDates({ ...minimal, startDate: "2026" }), "2026");
  assert.equal(
    experienceDates({ ...minimal, startDate: "2023", endDate: "Present" }),
    "2023 – Present",
  );
});
test("multiple responsibilities and long summaries remain fully readable in markup", () => {
  const summary = "Editorial work. ".repeat(100);
  const responsibilities = [
    "Prepare publication layouts.",
    "Review printed proofs.",
  ];
  const html = renderToStaticMarkup(
    <ExperiencePreviewContent
      experience={{
        ...minimal,
        summary,
        responsibilities,
        technologies: ["Typography"],
        location: "Example city",
        employmentType: "Contract",
      }}
    />,
  );
  assert.ok(html.includes(summary.trim()));
  for (const item of responsibilities) assert.ok(html.includes(item));
  for (const detail of ["Contract", "Example city", "Typography"])
    assert.ok(html.includes(detail));
  assert.equal(experienceSummary({ ...minimal, responsibilities }), undefined);
});
test("company links are validated and optional image alt text is preserved", () => {
  const unsafe = renderToStaticMarkup(
    <ExperiencePreviewContent
      experience={{ ...minimal, companyWebsite: "javascript:alert(1)" }}
    />,
  );
  assert.doesNotMatch(unsafe, /javascript:|Company website/);
  const html = renderToStaticMarkup(
    <ExperiencePreviewContent
      experience={{
        ...minimal,
        companyWebsite: "https://example.com",
        previewImage: { src: "/studio.jpg", alt: "Editorial studio workspace" },
      }}
    />,
  );
  assert.match(html, /Company website/);
  assert.match(html, /alt="Editorial studio workspace"/);
});
test("project and experience controls share one server-safe provider", () => {
  const entry = { kind: "experience", experience: minimal } as const;
  assert.equal(
    previewTriggerLabel(entry),
    "Preview Designer at Example studio",
  );
  const html = renderToStaticMarkup(
    <ResumePreviewProvider>
      <PreviewTrigger entry={entry} />
      <PreviewTrigger
        entry={{
          kind: "project",
          project: { id: "study", name: "Print study", featured: false },
        }}
      />
    </ResumePreviewProvider>,
  );
  assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 2);
  assert.doesNotMatch(html, /role="dialog"/);
});
