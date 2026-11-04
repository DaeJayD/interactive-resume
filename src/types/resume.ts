export interface ResumeImage {
  src: string;
  alt: string;
}
export interface SocialLink {
  id: string;
  label: string;
  url: string;
}
export interface Profile {
  id: string;
  fullName: string;
  headline: string;
  location?: string;
  email?: string;
  phone?: string;
  image?: ResumeImage;
  shortSummary?: string;
  biography?: string;
  socialLinks?: SocialLink[];
  details?: { id: string; label: string; value: string }[];
}
export interface Experience {
  id: string;
  employer: string;
  title: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  summary?: string;
  responsibilities?: string[];
  technologies?: string[];
  companyWebsite?: string;
  previewImage?: ResumeImage;
}
export interface Project {
  id: string;
  name: string;
  description?: string;
  detailedDescription?: string;
  technologies?: string[];
  image?: ResumeImage;
  gallery?: ResumeImage[];
  demoVideo?: string;
  githubUrl?: string;
  liveUrl?: string;
  status?: string;
  featured: boolean;
}
export interface Education {
  id: string;
  institution: string;
  program: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}
export interface CustomSection {
  id: string;
  title: string;
  entries: { id: string; title: string; description?: string }[];
}
export type SectionKind =
  "summary" | "skills" | "education" | "experience" | "projects" | "custom";
export interface ResumeSection {
  id: string;
  kind: SectionKind;
  title: string;
  /** Omit to include every entry of this kind. Order follows this array. */
  itemIds?: string[];
}
export interface ResumeTheme {
  accent?: string;
  paper?: string;
  typography?: "editorial" | "sans";
}
export interface ResumeConfiguration {
  profile: Profile;
  summary?: string;
  skills?: SkillCategory[];
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  customSections?: CustomSection[];
  theme?: ResumeTheme;
  /** Static page groupings, with flowing heights. No interactive navigation. */
  pages?: { id: string; sections: ResumeSection[] }[];
}
