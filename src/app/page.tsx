import { PrintResumeButton } from "@/components/resume/PrintResumeButton";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { resume } from "@/data/resume";
export default function Home() {
  return (
    <main id="resume" tabIndex={-1}>
      <div className="workspace-label">
        <span>Living résumé</span>
        <span>Professional record</span>
      </div>
      <div className="resume-actions">
        <PrintResumeButton />
      </div>
      <ResumeDocument resume={resume} />
    </main>
  );
}
