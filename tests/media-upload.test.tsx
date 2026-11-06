import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { normalizeResumeImage } from "../src/lib/resume/image-upload";

test("résumé uploads are decoded and converted to a still WebP", async () => {
  const source = await sharp({
    create: { width: 32, height: 24, channels: 3, background: "#ece7d9" },
  }).png().toBuffer();
  const { format, width, height } = await sharp(await normalizeResumeImage(source)).metadata();
  assert.deepEqual({ format, width, height }, { format: "webp", width: 32, height: 24 });
});

test("image uploads reject SVG, corrupted rasters, and excessive dimensions", async () => {
  await assert.rejects(normalizeResumeImage(Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'/>")));
  await assert.rejects(normalizeResumeImage(Buffer.from([255, 216, 255, 0])));
  const wide = await sharp({
    create: { width: 4097, height: 10, channels: 3, background: "#fff" },
  }).jpeg().toBuffer();
  await assert.rejects(normalizeResumeImage(wide));
});
