import Link from "next/link";
import { requireResumeOwner } from "@/lib/resume/owner";
import { PublicationControls, RestoreVersionButton } from "../PublicationControls";

export const dynamic = "force-dynamic";

export default async function PublicationHistory() {
  const client = await requireResumeOwner();
  const [versions, publication, draft] = await Promise.all([
    client.from("resume_versions").select("id, source_revision, created_at").order("source_revision", { ascending: false }),
    client.from("resume_publication").select("version_id").maybeSingle(),
    client.from("resume_drafts").select("revision").maybeSingle(),
  ]);
  if (versions.error || publication.error || draft.error) throw new Error("Could not load publication history");

  return (
    <main id="resume" tabIndex={-1} className="mx-auto max-w-2xl">
      <Link href="/admin" className="text-sm">Back to editor</Link>
      <h1 className="my-4">Publication history</h1>
      {publication.data && <PublicationControls />}
      {versions.data.length === 0 ? <p>No versions have been published yet.</p> : (
        <ol className="grid gap-3">
          {versions.data.map((version) => (
            <li key={version.id} className="rounded border border-stone-300 bg-white p-4">
              <h2 className="font-semibold">
                Revision {version.source_revision}
                {version.id === publication.data?.version_id && " · Current publication"}
              </h2>
              <p className="mb-2 text-sm text-stone-600">
                <time dateTime={version.created_at}>{new Date(version.created_at).toLocaleDateString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium" })}</time>
              </p>
              {typeof draft.data?.revision === "number" && <RestoreVersionButton id={version.id} revision={draft.data.revision} />}
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
