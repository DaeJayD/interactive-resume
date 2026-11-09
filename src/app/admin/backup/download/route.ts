import { serializeResumeBackup } from "@/lib/resume/backup";
import { loadResumeDraft } from "@/lib/resume/draft";

export async function GET() {
  const draft = await loadResumeDraft();
  if (draft.status !== "ready") {
    return new Response("No saved draft to back up.", {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  }
  return new Response(serializeResumeBackup(draft.document), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="resume-draft-r${draft.revision}.json"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
