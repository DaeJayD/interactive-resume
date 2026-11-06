"use client";

import { useActionState } from "react";
import { deleteImage, uploadImage } from "./actions";

export function UploadImageForm() {
  const [message, action, pending] = useActionState(uploadImage, "");
  return (
    <form action={action} className="my-5 grid gap-3 rounded border border-stone-300 bg-white p-4">
      <label className="grid gap-2 text-sm">
        Upload an image (JPEG, PNG, or WebP, up to 4 MB)
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required disabled={pending} />
      </label>
      <button className="print-resume justify-self-start disabled:opacity-50" type="submit" disabled={pending}>
        {pending ? "Uploading…" : "Upload image"}
      </button>
      {message && <p role="status">{message}</p>}
    </form>
  );
}

export function DeleteImageForm({ id, retry }: { id: string; retry: boolean }) {
  const [message, action, pending] = useActionState(deleteImage.bind(null, id), "");
  return (
    <form action={action} onSubmit={(event) => {
      if (!retry && !window.confirm("Remove this image from the media library?")) event.preventDefault();
    }}>
      <button className="print-resume disabled:opacity-50" type="submit" disabled={pending}>
        {pending ? "Removing…" : retry ? "Retry removal" : "Remove image"}
      </button>
      {message && <p role="status" className="mt-2">{message}</p>}
    </form>
  );
}
