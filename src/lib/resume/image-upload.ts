import sharp from "sharp";

export const imageByteLimit = 4_000_000;
const acceptedFormats = new Set(["jpeg", "png", "webp"]);
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export async function normalizeResumeImage(input: Buffer) {
  if (!input.length || input.length > imageByteLimit) throw new Error("Invalid file size");

  const jpeg = input.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
  const png = input.subarray(0, 8).equals(pngSignature);
  const webp = input.toString("ascii", 0, 4) === "RIFF" && input.toString("ascii", 8, 12) === "WEBP";
  if (!jpeg && !png && !webp) throw new Error("Unsupported image signature");

  const image = sharp(input, { limitInputPixels: 16_777_216, failOn: "warning" });
  const { format, width, height, pages } = await image.metadata();
  if (!format || !acceptedFormats.has(format) || !width || !height ||
      width > 4096 || height > 4096 || (pages ?? 1) > 1) {
    throw new Error("Unsupported image dimensions or format");
  }
  const result = await image.autoOrient().resize({
    width: 2400,
    height: 2400,
    fit: "inside",
    withoutEnlargement: true,
  }).webp({ quality: 83 }).toBuffer();
  if (result.length > imageByteLimit) throw new Error("Encoded image exceeds the file size limit");
  return result;
}
