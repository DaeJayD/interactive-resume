"use client";

import { useEffect, useRef, useState } from "react";

export function PageNavigation({ total }: { total: number }) {
  const navRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const pages = Array.from({ length: total }, (_, index) =>
      document.getElementById(`resume-page-${index + 1}`),
    );
    let frame = 0;

    function update() {
      frame = 0;
      const readingLine =
        (navRef.current?.getBoundingClientRect().bottom ?? 0) + 24;
      let page = 1;
      for (const [index, section] of pages.entries()) {
        if (section && section.getBoundingClientRect().top <= readingLine) {
          page = index + 1;
        }
      }
      if (
        window.scrollY > 0 &&
        Math.ceil(window.scrollY + window.innerHeight) >=
          document.documentElement.scrollHeight
      ) {
        page = total;
      }
      setCurrent(page);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const observer = new ResizeObserver(schedule);
    for (const page of pages) {
      if (page) observer.observe(page);
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [total]);

  return (
    <nav ref={navRef} className="page-navigation" aria-label="Résumé pages">
      <span aria-hidden="true">Pages</span>
      <ol>
        {Array.from({ length: total }, (_, index) => {
          const number = index + 1;
          return (
            <li key={number}>
              <a
                href={`#resume-page-${number}`}
                aria-label={`Page ${number}`}
                aria-current={number === current ? "page" : undefined}
              >
                {String(number).padStart(2, "0")}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
