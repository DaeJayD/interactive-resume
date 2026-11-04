# Interactive Living Résumé

A reusable résumé built with Next.js App Router, strict TypeScript, and Tailwind
CSS. Phase 1 provides the static document; Phase 2 adds subtle paper motion. The example contains the owner's résumé across three flowing
paper sheets. All personal content lives in `src/data/resume.ts`.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To use another port: `npm run dev -- --port 3100`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Replace the résumé

Edit `src/data/resume.ts` against `ResumeConfiguration` in `src/types/resume.ts`.
Only `profile.id`, `profile.fullName`, and `profile.headline` are required at the
configuration level. Optional arrays and missing details are omitted safely.

The configuration contains `profile`, `summary`, `skills`, `education`,
`experience`, `projects`, `customSections`, `theme`, and `pages`. Every collection
entry uses a stable ID. A page contains a stable ID and ordered section definitions:

```ts
{ id: "work", sections: [
  { id: "selected", kind: "projects", title: "Selected work", itemIds: ["project-id"] }
] }
```

Section kinds are summary, skills, education, experience, projects, and custom.
Omit `itemIds` to include all items of that kind. Omit `pages` to render the generic
section order on one flowing sheet. Unknown IDs and empty optional sections are
omitted. Supply unique page IDs, section IDs within each page, and entry IDs.
Titles, ordering, grouping, and content can be replaced without changing components.

Theme options are six-digit hex `accent` and `paper` colors, and `typography`
(`editorial` or `sans`). Check contrast when changing colors. Local optional
profile images can go in `public/images/profile`; supply a `src` and meaningful
`alt`. Project and experience media fields are reserved for later preview phases.
No example images or project links are fabricated.

## Structure

```text
src/
  app/                  # route, metadata, global paper styles
  components/
    paper/PaperSurface.tsx
    resume/             # document, page, header, and collection sections
    ui/                 # section heading and safe external link
  data/resume.ts        # owner content and page composition
  lib/links.ts          # external URL validation
  lib/paper-motion.ts   # bounded spring model and transform limits
  types/resume.ts       # reusable content schema
tests/resume.test.tsx    # rendering and missing-data regressions
tests/paper-motion.test.tsx # spring stability and motion limits
docs/phase-1.md         # completion report and Phase 2 handoff
```

See [Phase 1 report](docs/phase-1.md) for component roles, validation evidence,
content provenance and the static foundation. See [Phase 2 report](docs/phase-2.md)
for paper motion, validation, and the next phase.

## Paper motion

On wide screens with a fine mouse pointer, each sheet follows the cursor with
small spring-smoothed translation, perspective tilt, and a shifting shadow.
Motion remains static on touch and narrow screens, under reduced-motion
preferences, while selecting text, and while links have keyboard focus. Scrolling,
resizing, and leaving the window reset the sheet. No animation dependency is needed.

Limits and spring tuning live in `src/lib/paper-motion.ts`. `PaperSurface` is the
only client component; the résumé content is passed in as server-rendered children.
Profile focus and project/experience previews remain for later phases.
