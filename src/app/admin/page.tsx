import { loadResumeDraft } from "@/lib/resume/draft";
import { importResume, signOut } from "./actions";
import { DraftEditor } from "./DraftEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const draft = await loadResumeDraft();

  return (
    <main className="mx-auto max-w-2xl">
      <h1>Résumé admin</h1>
      {draft.status === "ready" ? (
        <DraftEditor initial={draft.document} initialRevision={draft.revision} />
      ) : (
        <>
          <section className="mt-6 rounded border bg-white p-6">
            <h2 className="mb-2 text-lg font-semibold">Draft</h2>
            {draft.status === "invalid" ? (
              <p>This draft uses an unsupported format or contains invalid content.</p>
            ) : (
              <form action={importResume} className="grid gap-3">
                <p>Import the current résumé as your first draft.</p>
                <button className="print-resume justify-self-start" type="submit">Import résumé</button>
              </form>
            )}
          </section>
          <form action={signOut} className="mt-4">
            <button className="print-resume" type="submit">Sign out</button>
          </form>
        </>
      )}
    </main>
  );
}
