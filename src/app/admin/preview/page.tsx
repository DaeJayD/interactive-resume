import Link from "next/link";
import { redirect } from "next/navigation";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { loadResumeDraft } from "@/lib/resume/draft";
import { PublicationControls } from "../PublicationControls";

export const dynamic = "force-dynamic";

export default async function DraftPreview() {
  const draft = await loadResumeDraft();
  if (draft.status !== "ready") redirect("/admin");

  return (
    <main id="resume" tabIndex={-1}>
      <div className="workspace-label">
        <span>Private draft · Revision {draft.revision}</span>
        <Link href="/admin">Back to editor</Link>
      </div>
      <PublicationControls revision={draft.revision} />
      <ResumeDocument resume={draft.document} />
    </main>
  );
}
