# Phase 3: owner profile focus

## Delivered

The owner name is an accessible disclosure button, with an optional portrait in
the same control. Mouse hover or keyboard focus reveals an inline profile panel;
click/tap pins it open. The panel contains biography text, optional labeled
details, and valid profile links. Missing biography falls back to short summary
or headline. The example biography uses facts already present in the résumé.
No profile photograph or new professional claim was added.

The panel expands within the paper, and other résumé sections fade subtly to
78% opacity while remaining readable, interactive, and in normal document flow.
Expansion and emphasis transitions are disabled under reduced motion. The panel
has no fixed height, overlay, focus trap, or hover-only controls.

## Components and behavior

- `ProfileSection.tsx`: client disclosure with hover/focus/pinned state, semantic
  button, `aria-expanded`, linked panel ID, keyboard handling, and focus restoration.
- `profile-focus.ts`: independent disclosure state reducer and biography fallback.
- `ResumeHeader.tsx`: composes the profile boundary and existing contact details.
- `PaperSurface.tsx`: listens for profile activation changes and immediately resets
  paper motion. Pointer tracking remains suppressed while the panel is open.
- `globals.css`: expansion, profile details, responsive controls, and document emphasis.
- `resume.ts`: biography and two factual profile detail entries.

The three activation sources coexist: leaving the pointer does not close a panel
that still holds keyboard focus, and a pinned panel survives hover/focus exit.
The close button, repeated pinned-trigger click, Escape, and outside pointer down
all dismiss it. Close/Escape restores focus to the name only when focus was
inside the disclosure; hover dismissal does not steal focus. Restoration is
suppressed as an activation source so closing does not reopen the panel.

The collapsed panel is both inert and hidden from the accessibility tree. Focus
can move through its close button and real profile links when open. It is an
inline disclosure, not a modal dialog. No new dependency was added.

## Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 13 tests passed. Four new tests cover mixed hover/focus state,
  pinning/dismissal, missing biography and other optional data, invalid profile
  URLs, and optional portrait alternative text. Existing paper and résumé tests
  remain passing.
- `npm run build`: passed; static route generation remains supported.
- Browser: mouse hover opened the panel and pointer exit closed it.
- Browser: keyboard focus opened it and Tab reached the close control.
- Browser: Escape closed it and restored focus to the name without reopening.
- Browser: click pinned it; Close profile and outside click both dismissed it.
- Browser: computed paper transform remained `none` while open; other résumé
  sections settled to 0.78 opacity.
- Browser: open panel had no horizontal overflow at 320, 390, 768, or 1440px.
  Client and scroll widths matched at each viewport.
- Desktop and mobile open-state presentation visually inspected.
- Production browser: disclosure opened after hydration; Escape closed it and the
  next Tab reached the email contact, skipping the inert collapsed panel.
  Captured browser error log was empty.
- `git diff --check`: passed.

Viewport checks use a desktop browser, not a physical phone. The portrait path
was covered by a rendering test; the example does not include a real portrait.
Reduced-motion behavior has CSS guards but was not checked by changing the OS
preference. This is not a complete assistive-technology audit.

## Handoff

Phase 3 stops at owner profile activation and focus. Phase 4 should implement
contextual project previews, keeping project data separate from interaction state
and retaining the existing URL validation. Profile focus and paper motion should
continue to cooperate with keyboard reading and selection. Experience previews
remain deferred to Phase 5.
