import type { Metadata } from "next";
import type { ReactNode } from "react";
import { resume } from "@/data/resume";
import "./globals.css";
export const metadata: Metadata = {
  title: `${resume.profile.fullName} | Résumé`,
  description: resume.summary || resume.profile.headline,
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#resume">
          Skip to résumé
        </a>
        {children}
      </body>
    </html>
  );
}
