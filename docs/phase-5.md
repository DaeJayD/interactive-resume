# Phase 5: professional experience previews

## Delivered

Job titles now activate professional detail panels through mouse hover, keyboard
focus, click, or tap. The panel displays organization, job title, known dates,
summary, responsibilities, optional employment type/location/technologies, and
optional employer imagery. A validated company website becomes a real external
link; a missing or invalid URL produces no action. Unknown dates and media remain
absent. Existing résumé facts were reused without adding employer claims or URLs.

The first experience preserves its partial date, `2026`; Creamery Studios shows
`2022 – 2023`; Fashion Business has no fabricated date row. Roles without a
summary or responsibilities have a concise text fallback.

## Shared interaction architecture

The previous project-specific provider was generalized to `ContextualPreview.tsx`.
`ResumePreviewProvider` and `PreviewTrigger` now serve a discriminated union of
project and experience entries. All résumé sections share one active preview,
including when moving between projects and experience. `ProjectPreview.tsx` is a
small project trigger adapter. Server-rendered section content remains unchanged.

The shared controller retains pinning, grace-period hover exit, keyboard entry,
Escape/close/outside dismissal, focus restoration, viewport clamping, and mobile
bottom sheets. The generic dialog heading and close label identify its content
kind. Positioning moved into `preview-position.ts`, with project description/link
helpers remaining in `project-preview.ts`. Paper motion resets and stays still
for either preview type. Shared visual classes now use neutral entry names.

The heading is sticky inside scrollable panels, keeping the close button visible
while long responsibilities are read. Panel content scrolls independently; text
is not truncated or forced into a fixed résumé sheet height. Entry animation
continues to respect reduced motion.

## Files

- `ContextualPreview.tsx`: shared provider, trigger, portal, input, and lifecycle.
- `ExperiencePreviewContent.tsx`: employer, dates, summary, duties, optional media/links.
- `ExperienceSection.tsx`: activates the shared trigger from each job title.
- `preview.ts`: typed project/experience union and accessible names.
- `experience-preview.ts`: truthful date formatting and description fallback.
- `preview-position.ts`: shared viewport placement, extracted without new behavior.
- `ProjectPreview.tsx`, `ProjectPreviewContent.tsx`, `ResumeDocument.tsx`, and
  `PaperSurface.tsx`: updated to use the common controller and motion boundary.
- `experience-preview.test.tsx`: five new content and composition regressions.

No dependency or résumé dataset change was needed.

## Validation

- `npm test`: 23 tests passed. New coverage includes minimal experience, partial
  and present date values, long summaries/multiple responsibilities, optional
  metadata/technologies, safe company links, image alt text, and mixed triggers.
- `npm run lint`: passed.
- `npm run typecheck`: passed in strict mode.
- `npm run build`: passed; static route generation retained.
- Browser: technical experience opened by hover and dismissed after pointer exit.
- Browser: Tab entered its close control; Escape dismissed and returned focus to
  the source title. Paper computed transforms remained `none` while open.
- Browser: switching Creamery Studios to VaseNizz POS to Fashion Business left
  exactly one active dialog. Dates and missing company actions matched the source.
- Browser: active experience previews fit at 320, 390, 768, and 1440px, with document
  scroll width equal to client width at every size.
- Browser: at 320x640, scrolling the panel reached the final responsibility while
  the close control remained visible inside the panel.
- Production browser: experience opened after hydration, keyboard Escape restored
  focus, and project/experience switching retained one shared panel. Mobile outside
  click dismissed it. Captured production browser error log was empty.
- `git diff --check`: passed.

These checks use a desktop browser with viewport overrides, not a physical phone.
Optional company links and images are covered by fixtures because the source
provides none. Reduced-motion styling is retained; the OS preference was not
changed. A complete screen-reader audit remains separate.

## Phase boundary and next step

Phase 5 is complete. Phase 6 should address multi-page navigation, responsive
interaction refinement, and a broader accessibility review across profile,
project, and experience states. Preserve the shared one-panel behavior, truthful
missing-data handling, readable document, and independent paper motion boundary.
Export, deployment, and production optimization remain scheduled for Phase 7.
