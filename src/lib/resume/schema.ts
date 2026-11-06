import { z } from "zod";
import type { ResumeConfiguration } from "@/types/resume";

const id = z.string().min(1).max(120);
const title = z.string().trim().min(1).max(200);
const text = z.string().max(12000).optional();
const url = z.url({ protocol: /^https?$/ }).max(2048);
const image = z.object({ src: z.union([url, z.string().regex(/^\/(?![\/\\])/)]), alt: title });
const labels = z.array(title).max(100);
const color = z.string().regex(/^#[\da-f]{6}$/i).optional();
const dated = { startDate: text, endDate: text };

function entries<T extends z.ZodType<{ id: string }>>(entry: T) {
  return z.array(entry).max(100).refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    "Entry IDs must be unique",
  );
}

const section = z.object({
  id,
  title,
  kind: z.enum(["summary", "skills", "education", "experience", "projects", "custom"]),
  itemIds: z.array(id).max(100).optional(),
});

export const resumeSchema = z.object({
  profile: z.object({
    id, fullName: title, headline: title, location: text, email: z.email().optional(),
    phone: text, image: image.optional(), shortSummary: text, biography: text,
    socialLinks: entries(z.object({ id, label: title, url })).optional(),
    details: entries(z.object({ id, label: title, value: z.string().max(12000) })).optional(),
  }),
  summary: text,
  skills: entries(z.object({ id, category: title, skills: labels })).optional(),
  education: entries(z.object({ id, institution: title, program: title, ...dated, description: text })).optional(),
  experience: entries(z.object({
    id, employer: title, title, ...dated, employmentType: text, location: text, summary: text,
    responsibilities: z.array(z.string().max(12000)).max(100).optional(),
    technologies: labels.optional(), companyWebsite: url.optional(), previewImage: image.optional(),
  })).optional(),
  projects: entries(z.object({
    id, name: title, description: text, detailedDescription: text, technologies: labels.optional(),
    image: image.optional(), gallery: z.array(image).max(20).optional(), demoVideo: url.optional(),
    githubUrl: url.optional(), liveUrl: url.optional(), status: text, featured: z.boolean(),
  })).optional(),
  customSections: entries(z.object({
    id, title, entries: entries(z.object({ id, title, description: text })),
  })).optional(),
  theme: z.object({ accent: color, paper: color, typography: z.enum(["editorial", "sans"]).optional() }).optional(),
  pages: entries(z.object({ id, sections: entries(section) })).optional(),
}).superRefine((document, context) => {
  const collections = {
    skills: document.skills,
    education: document.education,
    experience: document.experience,
    projects: document.projects,
    custom: document.customSections,
  };
  document.pages?.forEach((page, pageIndex) => {
    page.sections.forEach(({ kind, itemIds }, sectionIndex) => {
      if (!itemIds) return;
      const items = kind === "summary" ? [] : collections[kind] ?? [];
      if (new Set(itemIds).size !== itemIds.length ||
          itemIds.some((id) => !items.some((item) => item.id === id))) {
        context.addIssue({
          code: "custom",
          path: ["pages", pageIndex, "sections", sectionIndex, "itemIds"],
          message: "Page entries must refer to unique IDs in the matching section",
        });
      }
    });
  });
}) satisfies z.ZodType<ResumeConfiguration>;
