import "server-only";
import { requireResumeOwner } from "./owner";
import { resumeSchema } from "./schema";

export async function loadResumeDraft(ownerClient?: Awaited<ReturnType<typeof requireResumeOwner>>) {
  const client = ownerClient ?? await requireResumeOwner();
  const { data, error } = await client
    .from("resume_drafts")
    .select("document, schema_version, revision")
    .maybeSingle();
  if (error) throw new Error("Could not load résumé draft");
  if (!data) return { status: "empty" } as const;
  const parsed = resumeSchema.safeParse(data.document);
  if (data.schema_version !== 1 || !parsed.success) return { status: "invalid" } as const;
  return { status: "ready", document: parsed.data, revision: data.revision as number } as const;
}
