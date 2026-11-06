"use client";

import { useEffect, useState, useTransition } from "react";
import type { ResumeConfiguration } from "@/types/resume";
import { saveDraft, signOut } from "./actions";
import { documentFields, profileFields, sectionCollections, type Field } from "./editor-fields";

type RecordValue = Record<string, unknown>;
type Issue = { path: string; message: string };
const control = "rounded border border-stone-300 bg-white p-2";
const button = "rounded border border-stone-300 bg-white px-3 py-2 text-sm disabled:opacity-50";

function record(value: unknown): RecordValue {
  return value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
}

function rows(value: unknown): RecordValue[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function label(row: RecordValue, fallback: string) {
  return String(row.name || row.title || row.category || row.program || row.label || row.alt || fallback);
}

function move<T>(items: T[], index: number, offset: number) {
  const next = [...items];
  [next[index], next[index + offset]] = [next[index + offset], next[index]];
  return next;
}

function OrderControls({ index, count, name, onMove }: {
  index: number; count: number; name: string; onMove: (offset: number) => void;
}) {
  return (
    <>
      <button type="button" className={button} disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move ${name} up`}>↑</button>
      <button type="button" className={button} disabled={index === count - 1} onClick={() => onMove(1)} aria-label={`Move ${name} down`}>↓</button>
    </>
  );
}

function collection(kind: unknown) {
  return typeof kind === "string" && Object.hasOwn(sectionCollections, kind)
    ? sectionCollections[kind as keyof typeof sectionCollections]
    : null;
}

function References({ parent, document, onChange }: {
  parent: RecordValue; document: RecordValue; onChange: (value: string[] | undefined) => void;
}) {
  const key = collection(parent.kind);
  if (!key) return null;
  const items = rows(document[key]);
  const selected = parent.itemIds as string[] | undefined;
  return (
    <div className="grid gap-2">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={selected === undefined} onChange={(event) => onChange(event.target.checked ? undefined : items.map((item) => String(item.id)))} />
        Include all {parent.kind as string}
      </label>
      {selected && (
        <>
          {selected.map((id, index) => {
            const name = label(items.find((item) => item.id === id) ?? {}, id);
            return (
              <div key={id} className="flex flex-wrap items-center gap-2">
                <span className="mr-auto text-sm">{name}</span>
                <OrderControls index={index} count={selected.length} name={name} onMove={(offset) => onChange(move(selected, index, offset))} />
                <button className={button} type="button" onClick={() => onChange(selected.filter((entry) => entry !== id))}>Exclude</button>
              </div>
            );
          })}
          {items.filter((item) => !selected.includes(String(item.id))).map((item) => (
            <button className={`${button} justify-self-start`} type="button" key={String(item.id)} onClick={() => onChange([...selected, String(item.id)])}>
              Include {label(item, String(item.id))}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function EditorFields({ fields, value, document, path, issues, onChange }: {
  fields: Field[]; value: RecordValue; document: RecordValue; path: string;
  issues: readonly Issue[]; onChange: (value: RecordValue) => void;
}) {
  return fields.map((field) => {
    const { key, label: name, kind } = field;
    const fieldPath = path ? `${path}.${key}` : key;
    const issue = issues.find((issue) => issue.path === fieldPath);
    const current = value[key];
    const change = (next: unknown) => {
      const updated = { ...value, [key]: next };
      if (key === "kind") delete updated.itemIds;
      onChange(updated);
    };
    const nested = { document, issues };

    if (kind === "references") return <References key={key} parent={value} document={document} onChange={change} />;
    if (kind === "object" || kind === "list") {
      const entries = rows(current);
      return (
        <details key={key} className="rounded border border-stone-300 p-3">
          <summary className="cursor-pointer font-medium">{name}{kind === "list" && ` (${entries.length})`}</summary>
          <div className="mt-3 grid gap-3">
            {kind === "object" ? (
              current ? (
                <>
                  <EditorFields {...nested} fields={field.fields} value={record(current)} path={fieldPath} onChange={change} />
                  <button type="button" className={`${button} justify-self-start`} onClick={() => change(undefined)}>Remove {name.toLowerCase()}</button>
                </>
              ) : (
                <button type="button" className={`${button} justify-self-start`} onClick={() => change({})}>Add {name.toLowerCase()}</button>
              )
            ) : (
              <>
                {entries.map((row, index) => {
                  const rowName = label(row, `Entry ${index + 1}`);
                  return (
                    <details key={String(row.id ?? index)} className="rounded bg-stone-50 p-3">
                      <summary className="cursor-pointer text-sm font-semibold">{rowName}</summary>
                      <div className="mt-3 grid gap-3">
                        <EditorFields {...nested} fields={field.fields} value={row} path={`${fieldPath}.${index}`} onChange={(next) => change(entries.map((entry, position) => position === index ? next : entry))} />
                        <div className="flex flex-wrap gap-2">
                          <OrderControls index={index} count={entries.length} name={rowName} onMove={(offset) => change(move(entries, index, offset))} />
                          <button type="button" className={button} onClick={() => change(entries.filter((_, position) => position !== index))}>Remove {rowName}</button>
                        </div>
                      </div>
                    </details>
                  );
                })}
                <button type="button" className={`${button} justify-self-start`} onClick={() => change([...entries, {
                  id: crypto.randomUUID(),
                  ...(key === "projects" ? { featured: false } : {}),
                  ...(key === "sections" ? { kind: "summary" } : {}),
                  ...(key === "pages" ? { sections: [] } : {}),
                  ...(key === "entries" ? {} : key === "customSections" ? { entries: [] } : {}),
                  ...(key === "skills" ? { skills: [] } : {}),
                }])}>Add entry</button>
              </>
            )}
          </div>
        </details>
      );
    }

    const inputValue = kind === "lines" && Array.isArray(current) ? current.join("\n") : String(current ?? "");
    return (
      <label key={key} className={kind === "toggle" ? "flex items-center gap-2 text-sm" : "grid gap-1 text-sm"}>
        {name}
        {kind === "toggle" ? <input type="checkbox" checked={Boolean(current)} onChange={(event) => change(event.target.checked)} /> :
          kind === "choice" ? (
            <select className={control} value={inputValue} onChange={(event) => change(event.target.value || undefined)}>
              {key !== "kind" && <option value="">Default</option>}
              {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ) : kind === "long" || kind === "lines" ? (
            <textarea className={control} rows={3} value={inputValue} aria-invalid={Boolean(issue)}
              onChange={(event) => change(kind === "lines" ? event.target.value.split("\n") : event.target.value || undefined)} />
          ) : <input className={control} value={inputValue} aria-invalid={Boolean(issue)} onChange={(event) => change(event.target.value || undefined)} />}
        {issue && <span className="text-red-800">{issue.message}</span>}
      </label>
    );
  });
}

function prepareDraft(document: RecordValue) {
  const draft = structuredClone(document);
  for (const page of rows(draft.pages)) {
    for (const section of rows(page.sections)) {
      const key = collection(section.kind);
      if (key && Array.isArray(section.itemIds)) {
        const ids = new Set(rows(draft[key]).map((item) => item.id));
        section.itemIds = section.itemIds.filter((id) => ids.has(id));
      }
    }
  }
  function trimLists(value: unknown): unknown {
    if (Array.isArray(value)) return value.filter((entry) => typeof entry !== "string" || entry.trim()).map(trimLists);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, trimLists(entry)]));
    return value;
  }
  return JSON.stringify(trimLists(draft));
}

export function DraftEditor({ initial, initialRevision }: { initial: ResumeConfiguration; initialRevision: number }) {
  const [document, setDocument] = useState<RecordValue>({ ...initial });
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [revision, setRevision] = useState(initialRevision);
  const [issues, setIssues] = useState<readonly Issue[]>([]);
  const [message, setMessage] = useState("");
  const [conflict, setConflict] = useState(false);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(document) !== baseline;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function save() {
    setIssues([]);
    setMessage("");
    startTransition(async () => {
      try {
        const result = await saveDraft(revision, prepareDraft(document));
        if (result.status === "saved") {
          setDocument({ ...result.document });
          setBaseline(JSON.stringify(result.document));
          setRevision(result.revision);
          setMessage(`Saved revision ${result.revision}.`);
        } else if (result.status === "invalid") {
          setIssues(result.issues);
          setMessage("Review the highlighted fields before saving.");
        } else if (result.status === "conflict") {
          setConflict(true);
          setMessage("A newer draft exists. Reload it to continue editing.");
        } else {
          setMessage(result.message);
        }
      } catch {
        setMessage("Could not save the draft. Check your connection and try again.");
      }
    });
  }

  return (
    <>
      <div className="my-4 flex flex-wrap items-center gap-3">
        <p>Revision {revision} · {dirty ? "Unsaved changes" : "Saved"}</p>
        <a href="/admin/preview" target="_blank" rel="noreferrer">Preview saved draft ↗</a>
        <a href="/admin/history" target="_blank" rel="noreferrer">Publication history ↗</a>
        <a href="/admin/media" target="_blank" rel="noreferrer">Media library ↗</a>
        <form action={signOut} onSubmit={(event) => {
          if (dirty && !window.confirm("Sign out and discard unsaved changes?")) event.preventDefault();
        }}>
          <button type="submit" className={button} disabled={pending}>Sign out</button>
        </form>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); if (dirty && !pending && !conflict) save(); }}>
        <fieldset disabled={pending} className="grid min-w-0 gap-4">
          <details className="rounded border border-stone-300 p-3">
            <summary className="cursor-pointer font-medium">Profile</summary>
            <div className="mt-3 grid gap-3">
              <EditorFields fields={profileFields} value={record(document.profile)} document={document} path="profile" issues={issues} onChange={(profile) => setDocument({ ...document, profile })} />
            </div>
          </details>
          <EditorFields fields={documentFields} value={document} document={document} path="" issues={issues} onChange={setDocument} />
          <div className="sticky bottom-2 grid gap-2 rounded border border-stone-300 bg-stone-50 p-3">
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="print-resume disabled:opacity-50" disabled={!dirty || conflict}>{pending ? "Saving…" : "Save draft"}</button>
              <span role="status" className="text-sm">{message}</span>
              {conflict && <button type="button" className={button} onClick={() => window.location.reload()}>Reload latest draft</button>}
            </div>
            {issues.length > 0 && <ul className="max-h-40 overflow-auto text-red-800" aria-label="Draft errors">
              {issues.map(({ path, message }, index) => <li key={index}>{path}: {message}</li>)}
            </ul>}
          </div>
        </fieldset>
      </form>
    </>
  );
}
