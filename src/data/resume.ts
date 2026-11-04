import type { ResumeConfiguration } from "@/types/resume";

/** Demonstration content only. No personal or employment facts are implied. */
export const resume = {
  profile: {
    id: "sample-profile",
    fullName: "Your name",
    headline: "Professional title",
  },
  summary:
    "A short introduction to your work, interests, and professional direction. Replace this sample with a verified summary from your résumé.",
  skills: [
    {
      id: "sample-expertise",
      category: "Areas of expertise",
      skills: ["Your primary skill", "Your supporting skill", "Your specialty"],
    },
  ],
} satisfies ResumeConfiguration;
