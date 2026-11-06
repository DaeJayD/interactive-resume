import "server-only";
import { cache } from "react";
import { resume } from "@/data/resume";
import { createAnonymousSupabaseClient } from "@/lib/supabase/anonymous";
import { publicResumeDocument } from "./public-document";
import { resumeSchema } from "./schema";

export const loadPublishedResume = cache(async () => {
  const bundled = { document: publicResumeDocument(resume), version: "bundled" };
  const client = createAnonymousSupabaseClient();
  if (!client) return bundled;
  const { data, error } = await client
    .from("resume_publication")
    .select("document, version_id, schema_version")
    .maybeSingle();
  if (error) throw new Error("Published résumé temporarily unavailable");
  if (!data) return bundled;
  if (data.schema_version !== 1 || typeof data.version_id !== "string") {
    throw new Error("Unsupported published résumé version");
  }
  return { document: resumeSchema.parse(data.document), version: data.version_id };
});
