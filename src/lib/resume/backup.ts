import { z } from "zod";
import type { ResumeConfiguration } from "@/types/resume";
import { resumeSchema } from "./schema";

export const draftByteLimit = 400_000;
export const backupByteLimit = 500_000;

const backupSchema = z.strictObject({
  format: z.literal("interactive-resume-draft"),
  version: z.literal(1),
  document: resumeSchema,
});

export function serializeResumeBackup(document: ResumeConfiguration) {
  return JSON.stringify({ format: "interactive-resume-draft", version: 1, document });
}

export function readResumeBackup(payload: string) {
  try {
    const result = backupSchema.safeParse(JSON.parse(payload));
    if (result.success) return result.data.document;
  } catch {
    // Invalid JSON and unsupported backup formats both fail validation.
  }
  return null;
}
