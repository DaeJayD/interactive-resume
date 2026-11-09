import Link from "next/link";
import { loadResumeDraft } from "@/lib/resume/draft";
import { importDraftBackup } from "../actions";

export const dynamic = "force-dynamic";

const errors = new Map([
  ["size", "Choose a résumé backup of up to 500 KB."],
  ["format", "This file is invalid, too large, or uses an unsupported backup format."],
  ["stale", "The draft changed. Review the current revision before restoring again."],
  ["image", "An uploaded image referenced in the backup is unavailable."],
  ["restore", "Could not restore the backup. Try again."],
  ["confirm", "Confirm that you want to replace the saved draft."],
]);

export default async function BackupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const draft = await loadResumeDraft();
  const { error } = await searchParams;
  const message = error && errors.get(error);
  return (
    <main id="resume" tabIndex={-1} className="mx-auto max-w-2xl">
      <Link href="/admin" className="text-sm">Back to editor</Link>
      <h1 className="my-4">Draft backup</h1>
      <p>Backups contain private résumé content and image references. Keep the file somewhere private.</p>
      {draft.status === "ready" && (
        <a href="/admin/backup/download" className="my-4 inline-flex items-center print-resume">
          Download saved draft
        </a>
      )}
      {draft.status === "invalid" ? (
        <p className="mt-4">The existing draft cannot be read. Resolve its format before restoring a backup.</p>
      ) : (
        <form action={importDraftBackup.bind(null, draft.status === "ready" ? draft.revision : null)}
          className="mt-4 grid gap-3 rounded border border-stone-300 bg-white p-4">
          {message && <p role="alert">{message}</p>}
          <label className="grid gap-2 text-sm">
            Choose a résumé backup (JSON)
            <input className="max-w-full" type="file" name="backup" accept=".json,application/json" required />
          </label>
          {draft.status === "ready" && (
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="replace" required />
              Replace saved draft revision {draft.revision}
            </label>
          )}
          <button className="print-resume justify-self-start" type="submit">Restore backup</button>
        </form>
      )}
    </main>
  );
}
