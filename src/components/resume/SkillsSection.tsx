import type { SkillCategory } from "@/types/resume";
export function SkillsSection({ entries }: { entries: SkillCategory[] }) {
  return (
    <dl className="skills">
      {entries
        .filter((group) => group.skills.length)
        .map((group) => (
          <div key={group.id}>
            <dt>{group.category}</dt>
            <dd>{group.skills.join(" · ")}</dd>
          </div>
        ))}
    </dl>
  );
}
