# Interactive Living Résumé

First increment: a runnable Next.js App Router foundation with strict TypeScript,
Tailwind CSS, a typed résumé configuration, and a responsive paper document shell.
This is the first small commit toward Phase 1, not the completed Phase 1 renderer.

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` and `npm start`.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
git diff --check
```

## Content and components

- `src/types/resume.ts`: initial profile, skill category, and configuration types.
- `src/data/resume.ts`: labeled sample content; replace with verified résumé facts.
- `src/components/resume/ResumeDocument.tsx`: semantic profile, summary, and skills.
- `src/components/paper/PaperSurface.tsx`: boundary for future paper effects.
- `src/app/globals.css`: document typography, paper styling, and responsive layout.

Missing optional contact details and empty summary/skill lists are omitted. Text
flows vertically rather than being clipped to a fixed paper height. System fonts
avoid a remote font dependency.

## Next increment

Continue Phase 1 with verified reference content, education, experience, projects,
and their typed fields and section components. Complete browser validation across
desktop and mobile before declaring Phase 1 complete. Paper motion, focus panels,
previews, export, and deployment remain outside this increment.
