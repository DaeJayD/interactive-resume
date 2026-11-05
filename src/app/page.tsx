import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { resume } from "@/data/resume";
export default function Home() {
  return (
    <main id="resume" tabIndex={-1}>
      <div className="workspace-label">
        <span>Living résumé</span>
        <span>Professional record</span>
      </div>
      <ResumeDocument resume={resume} />
    </main>
  );
}
