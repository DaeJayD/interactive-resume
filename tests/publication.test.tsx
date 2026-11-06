import assert from "node:assert/strict";
import { test } from "node:test";
import { publicResumeDocument } from "../src/lib/resume/public-document";
import { resumeSchema } from "../src/lib/resume/schema";
import type { ResumeConfiguration } from "../src/types/resume";

const draft: ResumeConfiguration = {
  profile: { id: "owner", fullName: "Résumé Owner", headline: "Developer" },
  summary: "Draft-only summary",
  projects: [
    { id: "public", name: "Public project", featured: true },
    { id: "hidden", name: "Draft-only project", featured: false },
  ],
  experience: [{ id: "hidden-job", employer: "Draft-only employer", title: "Developer" }],
  pages: [{
    id: "projects",
    sections: [{ id: "selected", kind: "projects", title: "Projects", itemIds: ["public"] }],
  }],
};

test("the public snapshot excludes draft-only content and retains valid page references", () => {
  const snapshot = resumeSchema.parse(publicResumeDocument(draft));
  assert.deepEqual(snapshot.projects?.map(({ id }) => id), ["public"]);
  assert.doesNotMatch(JSON.stringify(snapshot), /Draft-only/);
  assert.equal(draft.projects?.length, 2);
});

test("publication preserves collections included by an unrestricted section", () => {
  const snapshot = publicResumeDocument({
    ...draft,
    pages: [
      ...draft.pages!,
      { id: "all", sections: [{ id: "all-projects", kind: "projects", title: "All projects" }] },
    ],
  });
  assert.deepEqual(snapshot.projects, draft.projects);
  assert.deepEqual(publicResumeDocument({ ...draft, pages: [] }).experience, draft.experience);
});
