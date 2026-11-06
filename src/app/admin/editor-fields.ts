export type Field = {
  key: string;
  label: string;
} & (
  | { kind: "text" | "long" | "lines" | "toggle" | "references" }
  | { kind: "choice"; options: string[] }
  | { kind: "object" | "list"; fields: Field[] }
);

const text = (key: string, label: string): Field => ({ key, label, kind: "text" });
const long = (key: string, label: string): Field => ({ key, label, kind: "long" });
const lines = (key: string, label: string): Field => ({ key, label, kind: "lines" });
const object = (key: string, label: string, fields: Field[]): Field => ({ key, label, kind: "object", fields });
const list = (key: string, label: string, fields: Field[]): Field => ({ key, label, kind: "list", fields });
const choice = (key: string, label: string, options: string[]): Field => ({ key, label, kind: "choice", options });
const image = [text("src", "Image URL or local path"), text("alt", "Alt text")];
const dates = [text("startDate", "Start date"), text("endDate", "End date")];

export const sectionCollections = {
  skills: "skills",
  education: "education",
  experience: "experience",
  projects: "projects",
  custom: "customSections",
} as const;

export const profileFields: Field[] = [
  text("fullName", "Full name"), text("headline", "Headline"), text("location", "Location"),
  text("email", "Email"), text("phone", "Phone"),
  object("image", "Profile image", image),
  long("shortSummary", "Short summary"), long("biography", "Biography"),
  list("socialLinks", "Profile links", [text("label", "Label"), text("url", "URL")]),
  list("details", "Profile details", [text("label", "Label"), long("value", "Value")]),
];

export const documentFields: Field[] = [
  long("summary", "Professional summary"),
  list("skills", "Skills", [text("category", "Category"), lines("skills", "Skills, one per line")]),
  list("education", "Education", [text("institution", "Institution"), text("program", "Program"), ...dates, long("description", "Description")]),
  list("experience", "Experience", [
    text("employer", "Employer"), text("title", "Title"), text("employmentType", "Employment type"),
    text("location", "Location"), ...dates, long("summary", "Summary"),
    lines("responsibilities", "Responsibilities, one per line"), lines("technologies", "Technologies, one per line"),
    text("companyWebsite", "Company website"), object("previewImage", "Preview image", image),
  ]),
  list("projects", "Projects", [
    text("name", "Name"), long("description", "Description"), long("detailedDescription", "Preview description"),
    lines("technologies", "Technologies, one per line"), text("status", "Status"),
    text("githubUrl", "Repository URL"), text("liveUrl", "Live URL"), text("demoVideo", "Demo video URL"),
    { key: "featured", label: "Featured", kind: "toggle" },
    object("image", "Preview image", image), list("gallery", "Gallery", image),
  ]),
  list("customSections", "Custom sections", [
    text("title", "Title"), list("entries", "Entries", [text("title", "Title"), long("description", "Description")]),
  ]),
  object("theme", "Theme", [
    text("accent", "Accent color"), text("paper", "Paper color"),
    choice("typography", "Typography", ["editorial", "sans"]),
  ]),
  list("pages", "Pages", [
    list("sections", "Sections", [
      text("title", "Section title"),
      choice("kind", "Content type", ["summary", ...Object.keys(sectionCollections)]),
      { key: "itemIds", label: "Included entries", kind: "references" },
    ]),
  ]),
];
