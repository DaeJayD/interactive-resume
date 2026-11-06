import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { ResumeConfiguration } from "@/types/resume";
import { draftMediaPrefix, mapResumeImages, publishedMediaPrefix } from "./media-paths";

export const draftMediaBucket = "resume-drafts";
export const publishedMediaBucket = "resume-published";
export const mediaId = z.uuid();

export async function preparePublishedImages(client: SupabaseClient, document: ResumeConfiguration) {
  const images = new Set<string>();
  const published = mapResumeImages(document, (image) => {
    if (!image.src.startsWith(draftMediaPrefix)) return image;
    const id = mediaId.parse(image.src.slice(draftMediaPrefix.length));
    images.add(id);
    return { ...image, src: publishedMediaPrefix + id };
  });
  const draftBucket = client.storage.from(draftMediaBucket);
  const publishedBucket = client.storage.from(publishedMediaBucket);
  for (const id of images) {
    const existing = await publishedBucket.exists(id);
    if (existing.data) continue;

    const copy = await draftBucket.copy(id, id, { destinationBucket: publishedMediaBucket });
    if (copy.error && !(await publishedBucket.exists(id)).data) {
      throw new Error("Could not prepare a résumé image for publication");
    }
  }
  return published;
}

export async function imageResponse(client: SupabaseClient, bucket: string, id: string, isPublic: boolean) {
  const missing = () => new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  if (!mediaId.safeParse(id).success) return missing();
  const { data, error } = await client.storage.from(bucket).download(id);
  if (error || !data || data.type !== "image/webp") return missing();

  return new Response(data, {
    headers: {
      "Content-Type": "image/webp",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": isPublic ? "public, max-age=31536000, immutable" : "private, no-store",
    },
  });
}
