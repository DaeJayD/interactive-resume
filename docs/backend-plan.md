# Backend and admin dashboard plan

Status — proposed, pending implementation.

## Scope

Manage Dae Jay's résumé through a private, single-owner dashboard. Edit content,
upload images, arrange pages, preview changes, and publish a complete version.
The public résumé continues to use the existing paper renderer and interactions.

## Architecture

Use the existing Next.js App Router application for the dashboard and server
operations, Supabase Auth for owner login, PostgreSQL for content, and Supabase
Storage for images. Keep the existing Vercel deployment.

The current `ResumeConfiguration` describes the whole document, including
profile, projects, experience, education, skills, page groupings, and theme.
Store a versioned JSONB document matching this shape. This keeps publishing
atomic and reuses `ResumeDocument` for both public display and draft preview.
The tradeoff is that cross-project reporting would require JSON queries or a
later schema migration.

Use Server Actions for dashboard mutations and a server-only repository module
for reads. Every operation validates the session, owner identity, and input.
Supabase's cookie-based SSR integration supplies separate browser and server
clients and session refresh through Next.js Proxy. Follow the installed Next.js
guides when implementing these boundaries. [Supabase SSR guide](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs)

## Data model

| Table | Main fields | Purpose |
| --- | --- | --- |
| `resume_drafts` | singleton ID, owner ID, document JSONB, schema version, revision, updated time | Editable document with optimistic concurrency |
| `resume_versions` | version ID, document JSONB, schema version, source draft revision, created time | Immutable publication history |
| `resume_publication` | singleton ID, current version ID, published time | Pointer to the live version |
| `resume_assets` | asset ID, owner ID, private object path, published object path, MIME type, size, created time | Image ownership and lifecycle |

Keep existing entry IDs stable. Use a runtime schema to validate documents,
including unique IDs, valid section references, supported colors, lengths,
safe URLs, and optional fields. Preserve partial dates such as `2026` and
`Present`. Add schema version migrations when the document format changes.

Admin access is restricted to one provisioned user ID. Disable public signup.
Database and storage policies allow this owner to manage drafts and assets.
Anonymous readers can retrieve only the current publication and its document,
including through direct database API requests. Past versions remain private.
Use row-level security as a database boundary in addition to server checks.
Privileged credentials stay in server-only environment variables. [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Dashboard

- `/admin/login` — owner login and password recovery.
- `/admin` — draft status, last publication, and editing sections.
- `/admin/preview` — authenticated draft rendered through `ResumeDocument`.
- `/admin/history` — published versions and restore-to-draft action.

Provide forms for profile, summary, contact details, skills, education,
experience, projects, custom sections, theme, and page arrangement. Include
add, remove, reorder, and visibility controls. Visibility changes must update
page references and the published document so hidden content cannot appear in
public response payloads. Reordering supports keyboard-accessible buttons.

Start with an explicit Save draft button, field-level validation, unsaved-change
indicators, and navigation warnings. A save supplies the revision it edited.
An outdated revision returns a conflict with a reload option, protecting edits
made in another tab. A preview clearly indicates which saved revision it shows.

## Publishing and recovery

1. Save and validate the draft. Publish a specific saved revision.
2. Verify referenced image objects exist and prepare immutable public copies.
3. In one database transaction, lock/check the draft revision, insert its
   immutable version, and update the publication pointer. Concurrent edits
   produce a conflict. Use an idempotency key so retries return the same result.
4. Invalidate the public page cache after the transaction commits. Provide a
   retryable refresh action if cache invalidation fails. Show the version
   currently served so a database commit is distinguishable from a live update.
5. Verify a fresh public request contains the published version and content.

Cache only the public published document. Draft and admin responses remain
private and uncached. Choose the cache implementation supported by the existing
Next.js configuration, with on-demand invalidation and a bounded refresh period.
Keep the last successful public response when regeneration fails. Define an
explicit unavailable response for a cold start during a database outage.

Restoring an old version creates a new draft revision. The owner previews and
publishes it through the same workflow. Export the document as validated JSON
for a portable backup, and verify an import can restore it to a draft.

## Media

Support JPEG, PNG, and WebP images with a proposed 5 MB upload limit. Validate
file contents, size, and dimensions on the server, require alt text, and use
generated storage keys. Upload drafts into a private bucket. Resolve temporary
signed URLs only in authenticated previews. Publishing creates immutable copies
in a public bucket and replaces references with stable public URLs. Public
bucket files can be accessed by anyone with their URL. [Storage access models](https://supabase.com/docs/guides/storage/buckets/fundamentals)

Use asset IDs in stored draft data and resolve them to the renderer's image
shape. Maintain references from drafts and retained versions. Delete an asset
only after checking all references. A failed publish can leave unused copies,
which a retry or cleanup operation can reconcile without breaking a live version.

## Delivery phases

Continue numbering after the seven completed frontend phases. Each phase is a
separate runnable increment suitable for review and commit.

| Phase | Deliverable | Acceptance gate |
| --- | --- | --- |
| 8 — Foundation and owner access | Supabase configuration, SQL migrations, runtime schema, owner login, protected dashboard, initial import | Owner can sign in and read imported draft. Anonymous and other authenticated users cannot access or modify it, including direct API calls. Import preserves current project removals. |
| 9 — Content editing | Forms for all existing content types, page arrangement, draft save, preview | Edit, reorder, remove, refresh, and preview work. Stale saves are rejected. Public content remains at its published version. |
| 10 — Publishing | Public data adapter, transactional publish, cache refresh, publication history, restore | A draft becomes live without redeployment. Retry and concurrent publish checks pass. Restore and database/cache failure behavior are exercised. |
| 11 — Media management | Image uploads, private preview, publication copies, reference-aware deletion | Invalid files are rejected, draft files require authentication, published images load publicly, retained versions keep their images. |
| 12 — Release verification | Backup/import, access checks, responsive admin checks, production setup | Full login → edit → preview → publish → public read → restore flow passes on the hosted app. Existing print and animation behavior is checked. |

## Implementation locations

- `src/app/admin/` — login, dashboard, preview, history, and Server Actions.
- `src/lib/supabase/` — request-scoped SSR clients and session handling.
- `src/lib/resume/` — validation, persistence, publication, and asset resolution.
- `src/proxy.ts` — session refresh for authenticated routes.
- `supabase/migrations/` — tables, policies, and atomic publication function.
- `src/app/page.tsx` — published document loader feeding the existing renderer.

Seed from the current local résumé after the requested project removals. Use an
idempotent, owner-run import that never overwrites an existing edited draft.
Keep development and production database environments separate. Before release,
configure login redirect URLs and verify password recovery delivery, production
policies, environment variables, and public publication readback.

The proposed stack and image limit are planning choices. Backend implementation
and service provisioning begin with Phase 8.
