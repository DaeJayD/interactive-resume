import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPreviewContent } from "../src/components/resume/ProjectPreviewContent";
import {
  ProjectPreviewProvider,
  ProjectTrigger,
} from "../src/components/resume/ProjectPreview";
import {
  previewPosition,
  projectDescription,
  projectLinks,
} from "../src/lib/project-preview";
import type { Project } from "../src/types/resume";

const minimal: Project = { id: "study", name: "Design study", featured: false };
test("missing project media and descriptions have a text-only fallback", () => {
  const html = renderToStaticMarkup(
    <ProjectPreviewContent project={minimal} />,
  );
  assert.match(html, /Project overview/);
  assert.match(html, /Additional details have not been provided/);
  assert.doesNotMatch(html, /<img|<nav|undefined/);
  assert.equal(
    projectDescription({
      ...minimal,
      description: "Short",
      detailedDescription: "Full account",
    }),
    "Full account",
  );
});
test("only valid project URLs become actions", () => {
  const project = {
    ...minimal,
    githubUrl: "javascript:alert(1)",
    liveUrl: "https://example.com/work",
    demoVideo: "data:text/html,test",
  };
  assert.deepEqual(
    projectLinks(project).map((link) => link.id),
    ["live"],
  );
  const html = renderToStaticMarkup(
    <ProjectPreviewContent project={project} />,
  );
  assert.match(html, /Live project/);
  assert.doesNotMatch(html, /javascript:|Demo video|Repository/);
});
test("configured media and technologies render without invented assets", () => {
  const html = renderToStaticMarkup(
    <ProjectPreviewContent
      project={{
        ...minimal,
        gallery: [{ src: "/work.jpg", alt: "Printed publication" }],
        technologies: ["Typography", "Print"],
        demoVideo: "https://example.com/demo",
      }}
    />,
  );
  assert.match(html, /alt="Printed publication"/);
  assert.match(html, /Typography/);
  assert.match(html, /Demo video/);
});
test("preview placement stays inside desktop and short viewports", () => {
  const anchor = { left: 800, right: 920, top: 720, bottom: 750 };
  assert.deepEqual(
    previewPosition(
      anchor,
      { width: 360, height: 400 },
      { width: 1280, height: 800 },
    ),
    { left: 428, top: 384, maxHeight: 768 },
  );
  const result = previewPosition(
    { left: 20, right: 150, top: -20, bottom: 10 },
    { width: 340, height: 300 },
    { width: 390, height: 400 },
  );
  assert.ok(result.left >= 16 && result.left + 340 <= 390 - 16);
  assert.ok(result.top >= 16 && result.top + 300 <= 400 - 16);
  const crowdedAnchor = { left: 200, right: 500, top: 300, bottom: 330 };
  const crowded = previewPosition(
    crowdedAnchor,
    { width: 360, height: 400 },
    { width: 701, height: 720 },
  );
  assert.ok(crowded.top >= crowdedAnchor.bottom + 12);
  assert.ok(crowded.top + crowded.maxHeight <= 720 - 16);
});
test("server rendering preserves usable document content and collapsed triggers", () => {
  const html = renderToStaticMarkup(
    <ProjectPreviewProvider>
      <ProjectTrigger project={minimal} />
    </ProjectPreviewProvider>,
  );
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /Design study/);
  assert.doesNotMatch(html, /role="dialog"/);
});
