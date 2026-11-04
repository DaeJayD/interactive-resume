import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { resume } from "@/data/resume";

export default function Home() {
  return (
    <main>
      <p className="workspace-label">Living Résumé / Sample document</p>
      <ResumeDocument resume={resume} />
    </main>
  );
}
