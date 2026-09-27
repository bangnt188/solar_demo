import "server-only";
import { PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AppError } from "@/core/errors";
import type { StorageTransport } from "./r2";

/** Same validation/normalization as R2, with metadata kept only in this process. */
export function mockStorageTransport(): StorageTransport {
  const objects = new Map<string, { ContentLength: number; ContentType: string }>();
  return async command => {
    if (command instanceof PutObjectCommand) {
      const { Key, Body, ContentType } = command.input;
      if (!Key || !(Body instanceof Uint8Array) || !ContentType) throw new AppError("INVALID_INPUT", "Mock object không hợp lệ.");
      if (objects.has(Key)) throw new AppError("CONFLICT", "Mock object đã tồn tại.");
      if (objects.size >= 1000) throw new AppError("UNAVAILABLE", "Mock storage đã đạt giới hạn.");
      objects.set(Key, { ContentLength: Body.byteLength, ContentType });
      return {};
    }
    if (command instanceof HeadObjectCommand) {
      const object = objects.get(command.input.Key || "");
      if (!object) throw new AppError("NOT_FOUND", "Mock object không tồn tại.");
      return { ...object };
    }
    if (command instanceof DeleteObjectCommand) objects.delete(command.input.Key || "");
    return {};
  };
}
