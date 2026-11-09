# Phase 12 · Backup and release checks

Open **Draft backup** from the admin dashboard. Download a JSON copy of the
saved draft or restore a backup. Restoring into an existing draft checks the
revision shown on the backup page before replacing it. Reload the page if
someone saves or restores another revision first.

Backups contain private content and image references. Store them privately.
Back up uploaded image files separately. A restored reference must still point
to an available image in the connected project.

## Release checklist

1. Apply the migrations in order and [register the owner](phase-8.md). Disable
   public signup and check that an unauthenticated request to each admin route
   redirects to login.
2. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the target environment.
   Store credentials outside Git.
3. Sign in and import the résumé. Save a change, download its backup, edit
   again, then restore the backup. Check the saved revision in the preview.
4. Upload an image and attach it to the draft. Verify that the image preview
   requires sign-in and that its public copy loads after publication.
5. Publish, compare the public page with the saved preview, and verify the
   public version. Restore an older version and confirm that the live page
   keeps the current publication until the restored draft is published.
6. Check narrow and wide layouts, keyboard navigation, reduced motion, and
   the pagination of a saved PDF.
