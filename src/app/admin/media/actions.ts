"use server";

import { revalidatePath } from "next/cache";
import { imageByteLimit, normalizeResumeImage } from "@/lib/resume/image-upload";
import { draftMediaBucket, mediaId, publishedMediaBucket } from "@/lib/resume/media";
import { requireResumeOwner } from "@/lib/resume/owner";

export async function uploadImage(_previous: string, formData: FormData) {
  const client = await requireResumeOwner();
  const file = formData.get("image");
  if (!(file instanceof File) || !file.size || file.size > imageByteLimit) {
    return "Choose a JPEG, PNG, or WebP image up to 4 MB.";
  }

  let image: Buffer;
  try {
    image = await normalizeResumeImage(Buffer.from(await file.arrayBuffer()));
  } catch {
    return "Choose a valid, still JPEG, PNG, or WebP image no larger than 4096 × 4096 pixels.";
  }

  const id = crypto.randomUUID();
  const filename = file.name.trim().slice(0, 180) || "Image";
  const { error: registrationError } = await client.from("resume_assets").insert({
    id, filename, bytes: image.length,
  });
  if (registrationError) return "Could not register the image. Try again.";

  const { error: uploadError } = await client.storage.from(draftMediaBucket).upload(id, image, {
    contentType: "image/webp",
    cacheControl: "0",
    upsert: false,
  });
  if (uploadError) {
    revalidatePath("/admin/media");
    return "Upload was interrupted. Remove the incomplete image before retrying.";
  }

  const { data, error: readyError } = await client.from("resume_assets")
    .update({ status: "ready" }).eq("id", id).eq("status", "uploading").select("id").maybeSingle();
  revalidatePath("/admin/media");
  if (readyError || !data) return "Could not finish the upload. Remove the incomplete image before retrying.";
  return "Image uploaded. Copy its reference into an image field in the editor.";
}

export async function deleteImage(id: string) {
  const client = await requireResumeOwner();
  if (!mediaId.safeParse(id).success) return "Invalid image.";

  const { data, error } = await client.from("resume_assets")
    .update({ status: "deleting" }).eq("id", id).select("id").maybeSingle();
  if (error?.code === "23514") return "This image is still used by a saved draft or version.";
  if (error) return "Could not remove the image. Try again.";
  if (!data) return "This image was already removed.";

  revalidatePath("/admin/media");
  const removals = await Promise.all([draftMediaBucket, publishedMediaBucket].map((bucket) =>
    client.storage.from(bucket).remove([id]),
  ));
  if (removals.some((result) => result.error)) return "Removal was interrupted. Retry to finish.";

  const removed = await client.from("resume_assets").delete().eq("id", id)
    .eq("status", "deleting").select("id").maybeSingle();
  revalidatePath("/admin/media");
  if (removed.error || !removed.data) return "Removal was interrupted. Retry to finish.";
  return "Image removed.";
}
