"use client";

import Image from "next/image";
import { useEffect, useId, useReducer, useRef } from "react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import {
  closedProfile,
  profileBiography,
  profileFocusReducer,
  profileIsOpen,
} from "@/lib/profile-focus";
import { webUrl } from "@/lib/links";
import type { Profile } from "@/types/resume";

export function ProfileSection({ profile }: { profile: Profile }) {
  const [state, dispatch] = useReducer(profileFocusReducer, closedProfile);
  const open = profileIsOpen(state);
  const panelId = useId();
  const regionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ignoreRestoredFocus = useRef(false);
  const links = profile.socialLinks?.filter((link) => webUrl(link.url)) ?? [];

  function close(restoreFocus: boolean) {
    dispatch({ type: "close" });
    if (
      restoreFocus &&
      triggerRef.current &&
      document.activeElement !== triggerRef.current
    ) {
      ignoreRestoredFocus.current = true;
      triggerRef.current.focus({ preventScroll: true });
    }
  }

  useEffect(() => {
    const region = regionRef.current;
    region?.dispatchEvent(new Event("profilefocuschange", { bubbles: true }));
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (
        region &&
        event.target instanceof Node &&
        !region.contains(event.target)
      ) {
        dispatch({ type: "close" });
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const restore = !!region?.contains(document.activeElement);
      dispatch({ type: "close" });
      if (
        restore &&
        triggerRef.current &&
        document.activeElement !== triggerRef.current
      ) {
        ignoreRestoredFocus.current = true;
        triggerRef.current.focus({ preventScroll: true });
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      ref={regionRef}
      className="profile-region"
      data-profile-open={open}
      data-profile-pinned={state.pinned}
      onPointerEnter={(event) => {
        if (
          event.pointerType === "mouse" &&
          window.matchMedia("(hover: hover) and (pointer: fine)").matches
        ) {
          dispatch({ type: "hover", value: true });
        }
      }}
      onPointerLeave={() => dispatch({ type: "hover", value: false })}
      onFocus={() => {
        if (ignoreRestoredFocus.current) {
          ignoreRestoredFocus.current = false;
          return;
        }
        dispatch({ type: "focus", value: true });
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          dispatch({ type: "focus", value: false });
        }
      }}
    >
      <p className="eyebrow">Curriculum vitae</p>
      <h1 id="resume-name">
        <button
          ref={triggerRef}
          type="button"
          className="profile-trigger"
          aria-label={`About ${profile.fullName}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => dispatch({ type: "toggle" })}
        >
          <span className="profile-name">{profile.fullName}</span>
          {profile.image && (
            <Image
              className="profile-image"
              src={profile.image.src}
              alt={profile.image.alt}
              width={88}
              height={88}
              unoptimized
            />
          )}
          <span className="profile-cue" aria-hidden="true">
            Profile <span>{open ? "−" : "+"}</span>
          </span>
        </button>
      </h1>
      <p className="headline">{profile.headline}</p>

      <div
        id={panelId}
        className="profile-panel"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="profile-panel-clip">
          <section
            className="profile-panel-content"
            aria-label={`More about ${profile.fullName}`}
          >
            <div className="profile-panel-heading">
              <h2>About me</h2>
              <button
                className="profile-close"
                type="button"
                onClick={() => close(true)}
              >
                Close profile <span aria-hidden="true">×</span>
              </button>
            </div>
            <p className="profile-biography">{profileBiography(profile)}</p>
            {!!profile.details?.length && (
              <dl className="profile-details">
                {profile.details.map((detail) => (
                  <div key={detail.id}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {links.length > 0 && (
              <nav className="profile-links" aria-label="Profile links">
                {links.map((link) => (
                  <ExternalLink key={link.id} href={link.url}>
                    {link.label}
                  </ExternalLink>
                ))}
              </nav>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
