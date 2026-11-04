# Phase 4: contextual project previews

## Delivered

Every project name is an accessible preview control. Mouse hover on a wide screen
or keyboard focus opens the project; click/tap pins it. The floating preview shows
project name, description, optional status, technology tags, available imagery,
and valid repository/live/demo video links. A missing description receives a clear
fallback. Absent media uses a styled text cover, including Finance Tracker, which
has no additional source details. No project URL or image was fabricated.

One shared provider manages the active project across every résumé page. A body
portal escapes transformed paper containing blocks and clipping. Desktop placement
uses available side space, then vertical space, with viewport clamping and bounded
scrollable height. Narrow screens use a bottom sheet. Resize, scrolling, and media
size changes update position; scrolling the source out of view closes the preview.
Paper movement resets and remains still while a preview is open.

## Input and accessibility

- Each trigger exposes `aria-haspopup`, `aria-expanded`, and an active `aria-controls`.
- The nonmodal dialog has a project-specific accessible name and a 44px close control.
- Hover exit has a 180ms grace period for crossing the gap into the interactive panel.
- Click pins a panel; repeating the click closes it. Selecting another project
  replaces the shared panel rather than stacking previews.
- Tab or ArrowDown from the active trigger enters its controls. Tab at the panel
  boundary closes it and returns focus to the trigger; the next Tab continues
  through the document. Escape and Close restore focus when needed.
- Outside pointer/focus changes dismiss it without taking focus from the new target.
- Pointer focus is separated from click activation so a mobile sheet cannot cover
  its source control before the tap finishes. Mobile hover activation is disabled.
- No focus trap, backdrop, auto-playing media, or disabled placeholder links.
- Reduced-motion CSS removes entry animation. Media failure falls back to text.

## Source boundaries

- `ProjectPreview.tsx`: shared client provider, trigger, lifecycle, portal, positioning,
  focus restoration, dismissal, and keyboard entry.
- `ProjectPreviewContent.tsx`: media/text presentation and actual link actions.
- `project-preview.ts`: description fallback, URL selection, viewport placement.
- `ProjectsSection.tsx`: keeps static project entry content server rendered and
  delegates its title control to the client boundary.
- `ResumeDocument.tsx`: supplies the shared provider and theme colors.
- `PaperSurface.tsx`: resets and suppresses motion during project preview activity.

The first gallery image is supported; a full gallery carousel is not included.
Demo video URLs open as links, supporting both video files and hosted video pages.
No dependency or new résumé facts were added.

## Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed in strict mode.
- `npm run build`: passed with static route generation.
- `git diff --check`: passed.

- `npm test`: all 18 tests passed. Five project-preview tests cover missing
  descriptions/media, genuine URLs, configured imagery/technology/video links,
  side/vertical/edge positioning, and server-rendered collapsed controls.
- Browser: clicked VaseNizz POS, switched to Ryser, and confirmed one dialog.
  Repeated click dismissed it.
- Browser: Tab entered the close control; Escape closed and restored project focus.
- Browser: hovered Finance Tracker at the document bottom, crossed into its panel,
  and left it. The text fallback opened, remained reachable, and then dismissed.
- Browser: no dead links appeared for projects without URLs.
- Browser: paper transforms stayed `none` while a project preview was active.
- Browser: open preview stayed within the viewport at 320, 390, 768, and 1440px,
  with client and scroll widths equal at each size.
- Narrow-screen click activation and bottom-sheet presentation visually inspected.
- Production browser: preview opened after hydration, Tab entered and exited its
  controls, focus returned to the source, and the next Tab activated the next
  project. Outside click dismissed the mobile sheet. Captured error log was empty.

These are desktop browser viewport checks, not physical-device touch validation.
Real project media/links are absent from the source; their rendering paths are
covered by fixtures rather than claims of live project verification. OS reduced
motion was not toggled, and this is not a full assistive-technology audit.

## Phase boundary

Phase 4 stops at project previews and genuine project links. Phase 5 should add
experience previews, reusing the portal placement and dismissal behavior where
appropriate. Preserve the static résumé, independent data model, profile
interaction, and paper motion suppression. Experience interaction is not yet built.
