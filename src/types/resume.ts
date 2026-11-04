export interface Profile {
  id: string;
  fullName: string;
  headline: string;
  location?: string;
  email?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

/** Initial schema; other résumé sections will be added in the next increment. */
export interface ResumeConfiguration {
  profile: Profile;
  summary?: string;
  skills: SkillCategory[];
}
