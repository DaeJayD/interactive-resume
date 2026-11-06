# Phase 10 · Publishing and version history

After [owner setup](phase-8.md) and the [draft editor migration](phase-9.md),
apply [the publication migration](../supabase/migrations/202611060003_publish_resume.sql).

Save a draft, open **Preview saved draft**, and choose **Publish revision**.
The preview publishes the revision it displays. Reload the preview if the
draft has changed. After publishing, the dashboard requests a cache refresh
and checks the version served by the public page.

The database saves a private copy of the complete draft and a public snapshot
with only the content included in the configured pages. Both changes commit
in one transaction. Repeating a request for an already published revision
returns its version without changing the current publication.

**Publication history** shows which version is current. **Restore as draft**
copies a prior version into a new draft revision. Preview it before publishing
again. A restore requires the draft revision shown when history was opened.

The public site serves the bundled résumé until the first publication. Once
configured, it reads the public snapshot and refreshes on demand or after the
five-minute cache window. If the public page still serves a different version,
use **Refresh public page** and check again. A failed regeneration leaves the
last successful page cached. Without a cached page, a database failure returns
a server error. Apply migrations before building against a configured project.

For acceptance, publish two different revisions and check the public page
after each. Retry the first revision and confirm the second stays live. Restore
the first as a draft and confirm the second stays live until the restored
draft is published. Check that a project excluded from all pages is absent
from both public HTML and the public snapshot.
