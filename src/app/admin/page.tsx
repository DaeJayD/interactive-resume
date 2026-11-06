import { requireResumeOwner } from "@/lib/resume/owner";
import { resumeSchema } from "@/lib/resume/schema";
import { importResume, signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const client = await requireResumeOwner();
  const { data: draft, error } = await client
    .from("resume_drafts")
    .select("document, schema_version, revision")
    .maybeSingle();
  if (error) throw new Error("Could not load résumé draft");
  const document = draft?.schema_version === 1 ? resumeSchema.parse(draft.document) : null;

  return (
    <main className="mx-auto max-w-2xl">
      <h1>Résumé admin</h1>
      <section className="mt-6 rounded border bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">Draft</h2>
        {document ? (
          <>
            <p>{document.profile.fullName} · Revision {draft?.revision}</p>
            <p>{document.projects?.length ?? 0} projects · {document.experience?.length ?? 0} experience entries</p>
          </>
        ) : draft ? (
          <p>This draft uses an unsupported format.</p>
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
    </main>
  );
}
