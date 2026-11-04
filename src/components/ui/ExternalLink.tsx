import type { ReactNode } from "react";
import { webUrl } from "@/lib/links";

export function ExternalLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  const url = webUrl(href);
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <span>{children}</span>
  );
}
