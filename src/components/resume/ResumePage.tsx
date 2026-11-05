import type { ReactNode } from "react";
import { PaperSurface } from "@/components/paper/PaperSurface";
export function ResumePage({
  children,
  number,
  total,
  name,
}: {
  children: ReactNode;
  number: number;
  total: number;
  name: string;
}) {
  return (
    <PaperSurface>
      <section
        id={`resume-page-${number}`}
        tabIndex={-1}
        className="page-content"
        aria-label={`Résumé page ${number}`}
      >
        {number > 1 && (
          <div className="continuation">
            <span>{name}</span>
            <span>Curriculum vitae</span>
          </div>
        )}
        <div className="page-body">{children}</div>
        <footer className="page-footer">
          <span>{name}</span>
          <span>
            {String(number).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </footer>
        {total > 1 && (
          <nav className="page-steps" aria-label={`Page ${number} navigation`}>
            {number > 1 && (
              <a href={`#resume-page-${number - 1}`}>← Previous page</a>
            )}
            {number < total && (
              <a href={`#resume-page-${number + 1}`}>Next page →</a>
            )}
          </nav>
        )}
      </section>
    </PaperSurface>
  );
}
