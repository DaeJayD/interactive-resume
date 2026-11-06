import { PrintResumeButton } from "@/components/resume/PrintResumeButton";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { loadPublishedResume } from "@/lib/resume/published";

export const revalidate = 300;

export async function generateMetadata() {
  const { document } = await loadPublishedResume();
  return {
    title: `${document.profile.fullName} | Résumé`,
    description: document.summary || document.profile.headline,
  };
}

export default async function Home() {
  const { document, version } = await loadPublishedResume();
  return (
    <main id="resume" tabIndex={-1} data-resume-version={version}>
      <div className="workspace-label">
        <span>Living résumé</span>
        <span>Professional record</span>
      </div>
      <div className="resume-actions">
        <PrintResumeButton />
      </div>
      <ResumeDocument resume={document} />
    </main>
  );
}
