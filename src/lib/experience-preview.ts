import type { Experience } from "@/types/resume";

export function experienceDates(experience: Experience): string | undefined {
  return (
    [experience.startDate?.trim(), experience.endDate?.trim()]
      .filter(Boolean)
      .join(" – ") || undefined
  );
}

export function experienceSummary(experience: Experience): string | undefined {
  return (
    experience.summary?.trim() ||
    (experience.responsibilities?.length
      ? undefined
      : "Additional professional details have not been provided for this role.")
  );
}
