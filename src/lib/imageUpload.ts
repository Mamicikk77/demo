import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/uploads";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function saveImage(file: File): Promise<string> {
  await mkdir(/*turbopackIgnore: true*/ UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

export async function deleteImageFile(imageUrl: string | null) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  try {
    await unlink(
      path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, imageUrl.slice("/uploads/".length))
    );
  } catch {
    // dosya zaten yoksa yoksay
  }
}
