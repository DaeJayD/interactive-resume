# Phase 2: paper motion

## Implemented

`PaperSurface` is a small client boundary around server-rendered résumé content.
A stationary frame supplies pointer coordinates and perspective. Only its inner
paper surface transforms, avoiding a feedback loop from transformed bounds.
The paper follows a damped spring and returns to rest after the pointer leaves.

Maximum motion is 1.5px translation on either axis, 0.45 degrees rotation around
X, and 0.65 degrees around Y, with 1800px perspective. A separate shadow layer
animates only its transform and opacity. Paper shading remains static. No text
warping or local deformation is applied.

The model in `src/lib/paper-motion.ts` uses bounded time substeps of at most
1/120 seconds, clamps delayed-frame time to 50ms, and stops animation frames
when settled. Pointer data and spring state stay outside React state, avoiding
continuous React renders. The compositor hint is applied only during movement.
No new runtime or development dependency was added for Phase 2.

## Reading and input behavior

- Enabled only for a fine pointer with hover, viewport wider than 700px, and
  `prefers-reduced-motion: no-preference`.
- Touch/pen pointer events do not drive motion; scrolling and pinch gestures
  are not intercepted.
- Reduced-motion and input capability changes reset motion immediately. CSS
  independently forces static paper under reduced motion, coarse input, or a
  narrow viewport.
- Pointer down resets the surface so text selection and clicking remain steady.
  Motion stays off while a text selection exists or a descendant link is focused.
- Scrolling, resizing, window blur, and hiding the document reset the surface.
- Listener and animation-frame cleanup runs on unmount, including development
  effect re-initialization. There is no perpetual idle animation.
- Print presentation stays untransformed.

## Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: nine tests passed: the five existing rendering tests plus four
  tests for pointer normalization, spring convergence/return without overshoot,
  delayed frames and multiple refresh rates, and bounded visual output.
- `npm run build`: passed with static generation preserved.
- Browser: observed real pointer-driven nonzero translation/rotation and shadow
  displacement, followed by removal of motion styles and the active-frame marker
  after pointer exit.
- Production browser: pointer-driven transforms and moving shadow were observed
  after hydration; captured error log was empty. Selecting summary text reset the
  sheet and further pointer movement kept it still.
- Browser: keyboard focus reset the surface; moving the pointer while a contact
  link was focused left it still.
- Browser: 390px viewport disabled motion and kept the computed transform at
  `none`. At 390/768/1440px, document scroll width matched client width, with no
  horizontal overflow.

The browser checks exercised a desktop browser with viewport overrides, not a
physical touch device. Reduced-motion behavior is implemented in the media-query
listener and CSS guard; an operating-system reduced-motion toggle was not changed
for this check. The spring tests validate simulation behavior, not measured display
FPS or GPU performance.

- `git diff --check`: passed.

## Phase boundary

Phase 2 is complete. Résumé content and existing navigation remain intact.
Localized paper deformation is optional and intentionally omitted to preserve
text clarity. Profile focus panels, project previews, and experience previews are
not implemented. Phase 3 should build owner activation and focus transitions at
`ResumeHeader`, while keeping motion suppression during keyboard focus and text
selection.
