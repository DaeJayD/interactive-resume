import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeDocument } from "../src/components/resume/ResumeDocument";
import { resume } from "../src/data/resume";
import { webUrl } from "../src/lib/links";
import type { ResumeConfiguration } from "../src/types/resume";

const minimal: ResumeConfiguration = {
  profile: {
    id: "designer",
    fullName: "Example Designer",
    headline: "Editorial designer",
  },
};
const render = (value: ResumeConfiguration) =>
  renderToStaticMarkup(<ResumeDocument resume={value} />);

test("minimal profile renders without optional collections, contacts, or media", () => {
  const html = render(minimal);
  assert.match(html, /Example Designer/);
  assert.doesNotMatch(html, /<h2|mailto:|tel:|undefined|<img/);
  assert.equal((html.match(/class="paper"/g) || []).length, 1);
});
test("reference dataset includes every configured project and experience", () => {
  const html = render(resume);
  for (const project of resume.projects || [])
    assert.ok(html.includes(project.name));
  for (const experience of resume.experience || [])
    assert.ok(html.includes(experience.employer));
  assert.equal((html.match(/class="paper"/g) || []).length, 3);
  assert.equal((html.match(/<h1/g) || []).length, 1);
});
test("unsafe and missing external URLs never become links", () => {
  for (const value of [
    undefined,
    "",
    "javascript:alert(1)",
    "data:text/html,test",
    "/relative",
    "https://user:secret@example.com",
  ])
    assert.equal(webUrl(value), undefined);
  assert.equal(webUrl("https://example.com/work"), "https://example.com/work");
  const html = render({
    ...minimal,
    projects: [
      {
        id: "work",
        name: "Print study",
        featured: false,
        liveUrl: "javascript:alert(1)",
      },
    ],
  });
  assert.doesNotMatch(html, /javascript:|Live project/);
});
test("non-developer content, long descriptions, custom sections and missing dates render", () => {
  const description = "A long account of editorial work. ".repeat(150);
  const html = render({
    ...minimal,
    summary: description,
    skills: [{ id: "empty", category: "Hidden category", skills: [] }],
    experience: [
      {
        id: "studio",
        employer: "Example studio",
        title: "Designer",
        summary: description,
      },
    ],
    projects: [
      { id: "book", name: "Book design", description, featured: true },
    ],
    customSections: [
      {
        id: "languages",
        title: "Languages",
        entries: [{ id: "english", title: "English" }],
      },
    ],
  });
  assert.ok(html.includes(description));
  assert.match(html, /Example studio/);
  assert.match(html, /Book design/);
  assert.match(html, /Languages/);
  assert.doesNotMatch(html, /Hidden category|Present|undefined/);
});
test("empty page groupings and unresolved IDs do not produce blank trailing pages", () => {
  const html = render({
    ...minimal,
    pages: [
      { id: "first", sections: [] },
      {
        id: "empty",
        sections: [
          {
            id: "missing",
            kind: "projects",
            title: "Hidden projects",
            itemIds: ["unknown"],
          },
        ],
      },
    ],
  });
  assert.equal((html.match(/class="paper"/g) || []).length, 1);
  assert.doesNotMatch(html, /Hidden projects/);
});
