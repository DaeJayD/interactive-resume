"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishDraft, refreshPublication, restoreVersion } from "./publication-actions";

export function PublicationControls({ revision }: { revision?: number }) {
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  function run(action: typeof refreshPublication) {
    setStatus("");
    startTransition(async () => {
      try {
        const result = await action();
        if (result.message) {
          setStatus(result.message);
          return;
        }
        if (!result.refreshRequested) {
          setStatus("Publication saved. Use Refresh public page to retry the update.");
          return;
        }
        try {
          const response = await fetch("/", { cache: "no-store", credentials: "omit" });
          if (!response.ok) throw new Error("Public page unavailable");
          const html = new DOMParser().parseFromString(await response.text(), "text/html");
          const served = html.querySelector("[data-resume-version]")?.getAttribute("data-resume-version");
          setStatus(served === result.version
            ? "Verified this version on the public résumé."
            : "The public page is serving a different version. Check history or refresh again.");
        } catch {
          setStatus("Publication saved. The public page could not be verified yet.");
        }
      } catch {
        setStatus("Could not confirm the update. Try again.");
      }
    });
  }

  return (
    <section className="mx-auto mb-4 max-w-[794px] rounded border border-stone-300 bg-stone-50 p-4 print:hidden" aria-label="Publication controls">
      <div className="flex flex-wrap items-center gap-3">
        {revision !== undefined && (
          <button className="print-resume disabled:opacity-50" type="button" disabled={pending} onClick={() => run(() => publishDraft(revision))}>
            Publish revision {revision}
          </button>
        )}
        <button className="print-resume disabled:opacity-50" type="button" disabled={pending} onClick={() => run(refreshPublication)}>
          Refresh public page
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="text-sm">Open public résumé ↗</a>
      </div>
      <p role="status" className="mt-2 text-sm">{pending ? "Checking publication…" : status}</p>
    </section>
  );
}

export function RestoreVersionButton({ id, revision }: { id: string; revision: number }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <button className="print-resume disabled:opacity-50" type="button" disabled={pending} onClick={() => {
        if (!window.confirm("Replace the current saved draft with this version?")) return;
        setMessage("");
        startTransition(async () => {
          try {
            const error = await restoreVersion(id, revision);
            if (error) setMessage(error);
            else router.push("/admin");
          } catch {
            setMessage("Could not confirm the restore. Reload the editor to check your draft.");
          }
        });
      }}>
        {pending ? "Restoring…" : "Restore as draft"}
      </button>
      {message && <p role="status" className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
