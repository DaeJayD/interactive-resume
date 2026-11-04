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
      <section className="page-content" aria-label={`Résumé page ${number}`}>
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
      </section>
    </PaperSurface>
  );
}
