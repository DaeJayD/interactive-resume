"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  previewTitle,
  previewTriggerLabel,
  type PreviewEntry,
} from "@/lib/preview";
import { previewPosition } from "@/lib/preview-position";
import { ProjectPreviewContent } from "./ProjectPreviewContent";
import { ExperiencePreviewContent } from "./ExperiencePreviewContent";

type Activation = "hover" | "focus" | "click";
interface Selection {
  entry: PreviewEntry;
  anchor: HTMLButtonElement;
  triggerId: string;
  pinned: boolean;
}
interface PreviewContextValue {
  activeId?: string;
  panelId: string;
  activate: (
    entry: PreviewEntry,
    triggerId: string,
    anchor: HTMLButtonElement,
    mode: Activation,
  ) => void;
  leave: () => void;
  keep: () => void;
  focusPanel: () => void;
}
const PreviewContext = createContext<PreviewContextValue | null>(null);

export function ResumePreviewProvider({
  children,
  themeStyle,
}: {
  children: ReactNode;
  themeStyle?: CSSProperties;
}) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    maxHeight: number;
  } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredAnchor = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();

  const keep = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);
  const close = useCallback(
    (restore: boolean) => {
      keep();
      setSelection(null);
      setPosition(null);
      if (
        restore &&
        selection?.anchor.isConnected &&
        document.activeElement !== selection.anchor
      ) {
        restoredAnchor.current = selection.anchor;
        selection.anchor.focus({ preventScroll: true });
      }
    },
    [keep, selection],
  );

  const activate = useCallback(
    (
      entry: PreviewEntry,
      triggerId: string,
      anchor: HTMLButtonElement,
      mode: Activation,
    ) => {
      keep();
      if (mode === "focus" && restoredAnchor.current === anchor) {
        restoredAnchor.current = null;
        return;
      }
      setSelection((current) => {
        if (mode === "hover" && current?.pinned) return current;
        if (
          mode === "click" &&
          current?.triggerId === triggerId &&
          current.pinned
        )
          return null;
        if (current?.triggerId === triggerId)
          return mode === "click" ? { ...current, pinned: true } : current;
        return { entry, anchor, triggerId, pinned: mode === "click" };
      });
    },
    [keep],
  );

  const leave = useCallback(() => {
    keep();
    timerRef.current = setTimeout(() => {
      setSelection((current) => {
        if (
          current?.pinned ||
          current?.anchor === document.activeElement ||
          panelRef.current?.contains(document.activeElement)
        )
          return current;
        return null;
      });
    }, 180);
  }, [keep]);

  useLayoutEffect(() => {
    if (!selection) return;
    function place() {
      if (!selection || !panelRef.current) return;
      const anchor = selection.anchor.getBoundingClientRect();
      if (anchor.bottom < 0 || anchor.top > window.innerHeight) {
        close(false);
        return;
      }
      const bounds = panelRef.current.getBoundingClientRect();
      const next = previewPosition(anchor, bounds, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setPosition((current) =>
        current?.left === next.left &&
        current?.top === next.top &&
        current?.maxHeight === next.maxHeight
          ? current
          : next,
      );
    }
    place();
    const observer = new ResizeObserver(place);
    if (panelRef.current) observer.observe(panelRef.current);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [selection, close]);

  useEffect(() => {
    window.dispatchEvent(new Event("resumepreviewchange"));
    if (!selection) return;
    function outside(event: Event) {
      const target = event.target;
      if (
        !(target instanceof Node) ||
        selection!.anchor.contains(target) ||
        panelRef.current?.contains(target)
      )
        return;
      if (
        event.type === "focusin" &&
        target instanceof Element &&
        target.closest("[data-preview-trigger]")
      )
        return;
      close(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(panelRef.current?.contains(document.activeElement) ?? false);
      }
    }
    function hide() {
      if (document.hidden) close(false);
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [selection, close]);
  useEffect(() => () => keep(), [keep]);

  return (
    <PreviewContext.Provider
      value={{
        activeId: selection?.triggerId,
        panelId,
        activate,
        leave,
        keep,
        focusPanel: () => closeRef.current?.focus(),
      }}
    >
      <div className="resume-preview-root" data-preview-open={!!selection}>
        {children}
      </div>
      {selection &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            className="entry-preview"
            role="dialog"
            aria-modal="false"
            aria-labelledby={`${panelId}-title`}
            style={
              {
                ...themeStyle,
                "--preview-max-height": position
                  ? `${position.maxHeight}px`
                  : undefined,
                left: position?.left ?? 16,
                top: position?.top ?? 16,
                visibility: position ? "visible" : "hidden",
              } as CSSProperties
            }
            onPointerEnter={keep}
            onPointerLeave={leave}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const controls = panelRef.current?.querySelectorAll<HTMLElement>(
                "button, a[href], video[controls]",
              );
              if (!controls?.length) return;
              if (
                (event.shiftKey && document.activeElement === controls[0]) ||
                (!event.shiftKey &&
                  document.activeElement === controls[controls.length - 1])
              ) {
                event.preventDefault();
                close(true);
              }
            }}
          >
            <div className="entry-preview-heading">
              <div>
                <p className="eyebrow">
                  {selection.entry.kind === "project"
                    ? "Project preview"
                    : "Experience preview"}
                </p>
                <h2 id={`${panelId}-title`}>{previewTitle(selection.entry)}</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="preview-close"
                aria-label={`Close ${selection.entry.kind} preview`}
                onClick={() => close(true)}
              >
                ×
              </button>
            </div>
            {selection.entry.kind === "project" ? (
              <ProjectPreviewContent
                key={selection.triggerId}
                project={selection.entry.project}
              />
            ) : (
              <ExperiencePreviewContent
                key={selection.triggerId}
                experience={selection.entry.experience}
              />
            )}
          </div>,
          document.body,
        )}
    </PreviewContext.Provider>
  );
}

export function PreviewTrigger({ entry }: { entry: PreviewEntry }) {
  const preview = useContext(PreviewContext);
  const id = useId();
  const pointerActivation = useRef(false);
  if (!preview) return <span>{previewTitle(entry)}</span>;
  const open = preview.activeId === id;
  return (
    <button
      type="button"
      className="entry-trigger"
      data-preview-trigger="true"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? preview.panelId : undefined}
      aria-label={previewTriggerLabel(entry)}
      onPointerEnter={(event) => {
        if (
          event.pointerType === "mouse" &&
          window.matchMedia(
            "(hover: hover) and (pointer: fine) and (min-width: 701px)",
          ).matches
        )
          preview.activate(entry, id, event.currentTarget, "hover");
      }}
      onPointerDown={() => {
        pointerActivation.current = true;
      }}
      onPointerCancel={() => {
        pointerActivation.current = false;
      }}
      onPointerLeave={() => {
        pointerActivation.current = false;
        preview.leave();
      }}
      onFocus={(event) => {
        if (!pointerActivation.current)
          preview.activate(entry, id, event.currentTarget, "focus");
      }}
      onBlur={preview.leave}
      onClick={(event) => {
        pointerActivation.current = false;
        preview.activate(entry, id, event.currentTarget, "click");
      }}
      onKeyDown={(event) => {
        if (
          open &&
          (event.key === "ArrowDown" ||
            (event.key === "Tab" && !event.shiftKey))
        ) {
          event.preventDefault();
          preview.focusPanel();
        }
      }}
    >
      {previewTitle(entry)}
      <span className="entry-trigger-cue" aria-hidden="true">
        +
      </span>
    </button>
  );
}
