"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { loadResumeDraft } from "@/lib/resume/draft";
import { preparePublishedImages } from "@/lib/resume/media";
import { requireResumeOwner } from "@/lib/resume/owner";
import { publicResumeDocument } from "@/lib/resume/public-document";

const revisionNumber = z.number().int().min(1).max(2147483646);
const versionId = z.uuid();

function requestPublicRefresh() {
  try {
    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("Could not refresh the public résumé cache", error);
    return false;
  }
}

export async function publishDraft(revision: number) {
  const client = await requireResumeOwner();
  if (!revisionNumber.safeParse(revision).success) {
    return { message: "Invalid draft revision." };
  }

  const draft = await loadResumeDraft(client);
  if (draft.status !== "ready" || draft.revision !== revision) {
    const { data, error } = await client
      .from("resume_versions")
      .select("id")
      .eq("source_revision", revision)
      .maybeSingle();
    if (error) return { message: "Could not check the publication. Try again." };
    if (data) return { version: String(data.id), refreshRequested: requestPublicRefresh() };
    return { message: "The saved draft changed. Reload this preview before publishing." };
  }

  let document;
  try {
    document = await preparePublishedImages(client, publicResumeDocument(draft.document));
  } catch {
    return { message: "Could not prepare a draft image for publication. Check the media library and try again." };
  }
  const { data, error } = await client.rpc("publish_resume_draft", {
    expected_revision: revision,
    public_document: document,
  });
  if (error) return { message: "Could not confirm publication. Try again to check this revision." };
  if (typeof data !== "string") {
    return { message: "The saved draft changed. Reload this preview before publishing." };
  }
  return { version: data, refreshRequested: requestPublicRefresh() };
}

export async function refreshPublication() {
  const client = await requireResumeOwner();
  const { data, error } = await client.from("resume_publication").select("version_id").maybeSingle();
  if (error) return { message: "Could not check the publication. Try again." };
  if (!data) return { message: "Publish a draft first." };
  return { version: String(data.version_id), refreshRequested: requestPublicRefresh() };
}

export async function restoreVersion(id: string, revision: number) {
  const client = await requireResumeOwner();
  if (!versionId.safeParse(id).success || !revisionNumber.safeParse(revision).success) {
    return "Invalid version or draft revision.";
  }
  const { data, error } = await client.rpc("restore_resume_version", {
    selected_version: id,
    expected_revision: revision,
  });
  if (error) return "Could not confirm the restore. Reload the editor to check your draft.";
  if (typeof data !== "number") return "The draft changed or the version is unavailable. Reload history and try again.";
  revalidatePath("/admin");
  return null;
}
