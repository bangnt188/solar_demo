import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { storageConfig } from "@/config/server";
import { AppError } from "@/core/errors";

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export function mediaKey(kind: "landing" | "projects" | "equipment", ownerId: string, assetId = randomUUID()): string {
  if (!uuid.test(ownerId) || !uuid.test(assetId) || !["landing", "projects", "equipment"].includes(kind)) throw new AppError("INVALID_INPUT", "Định danh ảnh không hợp lệ.");
  return `${kind}/${ownerId.toLowerCase()}/${assetId.toLowerCase()}.webp`;
}
function assertKey(key: string) {
  const parts = key.split("/");
  if (parts.length !== 3 || !["landing", "projects", "equipment"].includes(parts[0]) || !uuid.test(parts[1]) || !parts[2].endsWith(".webp") || !uuid.test(parts[2].slice(0, -5))) throw new AppError("INVALID_INPUT", "Object key không hợp lệ.");
}

export async function normalizeImage(bytes: Uint8Array) {
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new AppError("INVALID_INPUT", "Ảnh phải nhỏ hơn hoặc bằng 3 MiB.");
  const input = Buffer.from(bytes);
  const png = input.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpeg = input[0] === 255 && input[1] === 216 && input[2] === 255;
  const webp = input.subarray(0, 4).toString() === "RIFF" && input.subarray(8, 12).toString() === "WEBP";
  if (!png && !jpeg && !webp) throw new AppError("INVALID_INPUT", "Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP.");
  try {
    const decoder = sharp(input, { limitInputPixels: 20_000_000, failOn: "error", animated: true });
    const metadata = await decoder.metadata();
    if ((metadata.pages ?? 1) !== 1) throw new Error("animated");
    const { data, info } = await decoder.rotate().webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
    if (data.length > MAX_IMAGE_BYTES) throw new Error("output too large");
    return { bytes: data, mimeType: "image/webp" as const, sizeBytes: data.length, width: info.width, height: info.height };
  } catch { throw new AppError("INVALID_INPUT", "Ảnh không hợp lệ hoặc vượt giới hạn 20 megapixel."); }
}

type Command = PutObjectCommand | HeadObjectCommand | DeleteObjectCommand | HeadBucketCommand;
export type StorageTransport = (command: Command) => Promise<unknown>;
/** The transport is replaceable in tests; validation and key scope remain shared. */
export function createImageStorage(bucket: string, send: StorageTransport) {
  return {
    check: () => send(new HeadBucketCommand({ Bucket: bucket })),
    async put(key: string, bytes: Uint8Array) {
      assertKey(key);
      const image = await normalizeImage(bytes);
      await send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: image.bytes, ContentType: image.mimeType, CacheControl: "public, max-age=31536000, immutable", IfNoneMatch: "*" }));
      return { key, mimeType: image.mimeType, sizeBytes: image.sizeBytes, width: image.width, height: image.height };
    },
    head(key: string) { assertKey(key); return send(new HeadObjectCommand({ Bucket: bucket, Key: key })); },
    remove(key: string) { assertKey(key); return send(new DeleteObjectCommand({ Bucket: bucket, Key: key })); },
  };
}
let storage: ReturnType<typeof createImageStorage> | undefined;
export function getImageStorage() {
  if (storage) return storage;
  const { bucket, ...config } = storageConfig();
  const client = new S3Client({ ...config, region: "auto", maxAttempts: 2, requestHandler: new NodeHttpHandler({ connectionTimeout: 3000, requestTimeout: 10000 }) });
  storage = createImageStorage(bucket, command => {
    const options = { abortSignal: AbortSignal.timeout(15000) };
    if (command instanceof PutObjectCommand) return client.send(command, options);
    if (command instanceof HeadObjectCommand) return client.send(command, options);
    if (command instanceof DeleteObjectCommand) return client.send(command, options);
    return client.send(command, options);
  });
  return storage;
}
