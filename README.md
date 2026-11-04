# Interactive Living Résumé

Phase 1: a reusable static résumé built with Next.js App Router, strict TypeScript,
and Tailwind CSS. The example contains the owner's résumé across three flowing
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
  types/resume.ts       # reusable content schema
tests/resume.test.tsx    # rendering and missing-data regressions
docs/phase-1.md         # completion report and Phase 2 handoff
```

See [Phase 1 report](docs/phase-1.md) for component roles, validation evidence,
content provenance, limitations, and the next phase. Phase 2 motion is not implemented.
