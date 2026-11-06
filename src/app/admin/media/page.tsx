import Image from "next/image";
import Link from "next/link";
import { draftMediaPrefix } from "@/lib/resume/media-paths";
import { requireResumeOwner } from "@/lib/resume/owner";
import { DeleteImageForm, UploadImageForm } from "./MediaForms";

export const dynamic = "force-dynamic";

export default async function MediaLibrary() {
  const client = await requireResumeOwner();
  const { data, error } = await client.from("resume_assets")
    .select("id, filename, bytes, status, published").order("created_at", { ascending: false });
  if (error) throw new Error("Could not load the media library");

  return (
    <main id="resume" tabIndex={-1} className="mx-auto max-w-2xl">
      <Link href="/admin" className="text-sm">Back to editor</Link>
      <h1 className="my-4">Media library</h1>
      <p>Paste an image reference into an image field in the editor, then add alt text and save the draft.</p>
      <UploadImageForm />
      {data.length === 0 && <p>No uploaded images yet.</p>}
      <ul className="grid list-none gap-3 p-0">
        {data.map((asset) => (
          <li key={asset.id} className="rounded border border-stone-300 bg-white p-4">
            <h2 className="font-semibold break-all">{asset.filename}</h2>
            <p className="mb-2 text-sm text-stone-600">
              {asset.published ? "Published" : asset.status === "ready" ? "Private upload" : asset.status === "uploading" ? "Incomplete upload" : "Removal pending"}
              {" · "}{Math.ceil(asset.bytes / 1000)} KB
            </p>
            {asset.status === "ready" && (
              <>
                <Image className="mb-3 h-auto max-h-40 w-auto object-contain" src={draftMediaPrefix + asset.id}
                  alt="" width={160} height={100} unoptimized />
                <label className="mb-3 grid gap-1 text-sm">
                  Image reference
                  <input className="min-w-0 rounded border border-stone-300 p-2" value={draftMediaPrefix + asset.id} readOnly />
                </label>
              </>
            )}
            {asset.published
              ? <p>Kept for published versions.</p>
              : <DeleteImageForm id={asset.id} retry={asset.status === "deleting"} />}
          </li>
        ))}
      </ul>
    </main>
  );
}
