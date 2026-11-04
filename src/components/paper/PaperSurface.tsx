import type { ReactNode } from "react";
export function PaperSurface({ children }: { children: ReactNode }) {
  return <div className="paper">{children}</div>;
}
