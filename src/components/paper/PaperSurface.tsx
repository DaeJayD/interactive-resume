"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  advancePaper,
  paperSettled,
  paperStyle,
  paperTarget,
  restingPaper,
} from "@/lib/paper-motion";

export function PaperSurface({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const paper = paperRef.current;
    if (!frame || !paper) return;

    const preference = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (min-width: 701px)",
    );
    let state = restingPaper();
    let target = { x: 0, y: 0 };
    let animation = 0;
    let previousTime = 0;
    let pressed = false;

    function draw() {
      const style = paperStyle(state.position);
      paper!.style.setProperty("--paper-transform", style.transform);
      frame!.style.setProperty("--shadow-transform", style.shadowTransform);
      frame!.style.setProperty("--shadow-opacity", style.shadowOpacity);
    }
    function reset() {
      cancelAnimationFrame(animation);
      animation = 0;
      previousTime = 0;
      state = restingPaper();
      target = { x: 0, y: 0 };
      paper!.style.removeProperty("--paper-transform");
      frame!.style.removeProperty("--shadow-transform");
      frame!.style.removeProperty("--shadow-opacity");
      frame!.removeAttribute("data-moving");
    }
    function tick(time: number) {
      const elapsed = previousTime ? (time - previousTime) / 1000 : 1 / 60;
      previousTime = time;
      state = advancePaper(state, target, elapsed);
      draw();
      if (paperSettled(state, target)) {
        animation = 0;
        previousTime = 0;
        if (target.x === 0 && target.y === 0) reset();
        else frame!.removeAttribute("data-moving");
        return;
      }
      animation = requestAnimationFrame(tick);
    }
    function start() {
      if (!animation) {
        frame!.setAttribute("data-moving", "true");
        animation = requestAnimationFrame(tick);
      }
    }
    function move(event: PointerEvent) {
      if (
        !preference.matches ||
        document.hidden ||
        event.pointerType !== "mouse" ||
        pressed ||
        frame!.contains(document.activeElement)
      )
        return;
      if (window.getSelection()?.isCollapsed === false) return;
      const bounds = frame!.getBoundingClientRect();
      target = paperTarget(
        event.clientX - bounds.left,
        event.clientY - bounds.top,
        bounds.width,
        bounds.height,
      );
      start();
    }
    function leave() {
      target = { x: 0, y: 0 };
      if (animation || state.position.x || state.position.y) start();
    }
    function down() {
      pressed = true;
      reset();
    }
    function up() {
      pressed = false;
    }
    function visibility() {
      if (document.hidden) {
        pressed = false;
        reset();
      }
    }
    function blur() {
      pressed = false;
      reset();
    }

    frame.addEventListener("pointermove", move, { passive: true });
    frame.addEventListener("pointerleave", leave);
    frame.addEventListener("pointercancel", blur);
    frame.addEventListener("pointerdown", down);
    frame.addEventListener("focusin", reset);
    window.addEventListener("pointerup", up);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("resize", reset);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", reset);
    return () => {
      reset();
      frame.removeEventListener("pointermove", move);
      frame.removeEventListener("pointerleave", leave);
      frame.removeEventListener("pointercancel", blur);
      frame.removeEventListener("pointerdown", down);
      frame.removeEventListener("focusin", reset);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("resize", reset);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", reset);
    };
  }, []);

  return (
    <div ref={frameRef} className="paper-stage">
      <div ref={paperRef} className="paper">
        {children}
      </div>
    </div>
  );
}
