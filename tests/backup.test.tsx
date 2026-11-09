import assert from "node:assert/strict";
import { test } from "node:test";
import { resume } from "../src/data/resume";
import { readResumeBackup, serializeResumeBackup } from "../src/lib/resume/backup";
import { resumeSchema } from "../src/lib/resume/schema";

test("a saved résumé draft round-trips through the backup format", () => {
  const draft = resumeSchema.parse(resume);
  assert.deepEqual(readResumeBackup(serializeResumeBackup(draft)), draft);
});

test("restore rejects malformed backups, unknown versions, and invalid draft content", () => {
  const backup = JSON.parse(serializeResumeBackup(resume));
  assert.equal(readResumeBackup("{"), null);
  assert.equal(readResumeBackup(JSON.stringify({ ...backup, version: 2 })), null);
  assert.equal(readResumeBackup(JSON.stringify({ ...backup, document: { profile: {} } })), null);
});
