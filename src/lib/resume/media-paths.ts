import type { ResumeConfiguration, ResumeImage } from "@/types/resume";

export const draftMediaPrefix = "/admin/media/";
export const publishedMediaPrefix = "/media/";

export function mapResumeImages(
  document: ResumeConfiguration,
  map: (image: ResumeImage) => ResumeImage,
): ResumeConfiguration {
  return {
    ...document,
    profile: { ...document.profile, image: document.profile.image && map(document.profile.image) },
    projects: document.projects?.map((project) => ({
      ...project,
      image: project.image && map(project.image),
      gallery: project.gallery?.map(map),
    })),
    experience: document.experience?.map((entry) => ({
      ...entry,
      previewImage: entry.previewImage && map(entry.previewImage),
    })),
  };
}
