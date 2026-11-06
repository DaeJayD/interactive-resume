# Phase 11 · Media library

After [Phase 10 setup](phase-10.md), apply
[the media migration](../supabase/migrations/202611060004_resume_media.sql).
It creates the image registry and both Storage buckets with their access policies.

Open **Media library** from the editor. Upload a still JPEG, PNG, or WebP of
up to 4 MB and 4096 × 4096 pixels. The app converts it to WebP and removes
embedded metadata. Paste its image reference into a profile, experience, or
project image field. Add descriptive alt text and save. The saved draft preview
loads uploads through the authenticated admin route.

Publishing prepares an immutable copy for each managed image in the public
snapshot. The database releases those copies in the publication transaction.
An interrupted publication can leave a prepared copy in private storage. Retry
the publication to reuse it.

To remove an image, first remove its references and save. The library rejects
removal while a draft or retained version uses the image. Released copies
remain readable for retained versions and cached pages. If an upload or
removal is interrupted, use the library entry to finish removing its files.

Check the full flow with a dedicated Supabase project. Open an uploaded image
in an anonymous window and confirm the draft URL is unavailable. Attach the
image to a draft, preview it, publish, and confirm the public image loads.
Try removing the published image and confirm the library keeps it for history.
Upload and remove an unused image to verify cleanup.
