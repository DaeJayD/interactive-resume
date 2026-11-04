import type { ReactNode } from "react";

export function PaperSurface({ children }: { children: ReactNode }) {
  return <article className="paper" aria-labelledby="resume-name">{children}</article>;
}
