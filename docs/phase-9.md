# Phase 9 · Draft editor and preview

After completing [owner setup](phase-8.md), apply
[the draft save migration](../supabase/migrations/202611060002_save_resume_draft.sql).

Open `/admin` and import the résumé if the dashboard has no draft. The editor
supports the profile, summary, skills, education, experience, projects, custom
sections, theme, and pages. Open a group to add, edit, remove, or reorder its
entries. In **Pages**, each section can include its entire collection or a
chosen set of entries in a specific order.

**Save draft** validates the document and saves a new revision. **Preview saved
draft** opens that saved revision in a separate tab using the public résumé
renderer. The live résumé reads its published source until Phase 10.

To verify conflict handling, open the dashboard in two tabs at the same
revision. Save an edit in the first, then try to save in the second. The second
tab should report a conflict and offer to reload the latest draft. Confirm the
preview shows the first edit.
