# Phase 7 · Export and production release

The print control opens the browser's print workflow. A4 print styles remove
navigation, disclosures, shadows, and paper transforms. Each résumé sheet
starts on a new page, and individual entries avoid breaks where space allows.

Preview positioning coalesces scroll and resize events into one measurement
per animation frame. The frame is cancelled when the panel closes. The résumé
route remains statically generated.

## Verification

- Lint, strict TypeScript, all 23 tests, and the local production build passed.
- The Vercel production build passed. The staged response included the export
  control and résumé sheets before the release was promoted.
- The public URL returned the résumé with HTTP 200 without authentication.
- Live browser checks exercised page navigation, project preview keyboard
  entry, Escape, and focus restoration. The captured error log was empty.
- The export button was visible. Saved PDF pagination and visual layout
  remain unverified.

## Deployment

- Project `dj-c9c9/interactive-resume`
- Deployment `dpl_2W1pQLv9DEdqr1VPMfAvpUHtZP5k`
- [Public production domain](https://daejayd-resume.vercel.app/)
- [Deployment details](https://vercel.com/dj-c9c9/interactive-resume/2W1pQLv9DEdqr1VPMfAvpUHtZP5k)

The release was built from the Phase 7 workspace snapshot. At release time
the GitHub branch was at the Phase 6 commit `a039955`. The production domain
was assigned to this project after confirming that it was unassigned.
