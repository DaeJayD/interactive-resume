# Phase 6 · Page navigation

The résumé keeps all sheets in one continuous document. A sticky numbered
navigation bar marks the current sheet with `aria-current="page"`. Previous
and Next links appear at the end of each applicable sheet. Single-sheet
configurations omit the extra navigation.

Page links use native URL fragments based on the rendered page number. This
supports direct links and browser history, and transfers keyboard focus to
the target sheet. The skip link targets the focusable main landmark. Navigation
links have 44px minimum heights, and print styles hide navigation controls.

The browser checks used the production build. A direct link to page 2 landed
on and focused that sheet. Enter on page 3 moved focus and the current-page
marker. Browser Back restored page 2. At a 320px viewport, the Next link moved
to page 2, and client and scroll widths both measured 305px. Tab and Escape
returned focus from project, experience, and profile panels to their source
controls. The sampled browser error log was empty.

Lint, strict TypeScript, all 23 tests, the production build, and
`git diff --check` passed. Accessibility checks used a desktop browser with
viewport overrides. Physical touch devices and a full screen-reader audit
remain unverified.

Phase 7 covers export, deployment, and production optimization.
