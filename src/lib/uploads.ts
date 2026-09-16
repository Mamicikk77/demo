import path from "path";

// Yerelde proje kökünde bir "uploads" klasörü kullanılır. Railway gibi kalıcı
// disk (volume) sağlayan bir ortamda UPLOAD_DIR env değişkeni volume'un
// bağlandığı yola (örn. /app/data/uploads) ayarlanmalıdır — veritabanı
// dosyasıyla (dev.db) aynı volume içinde, farklı bir alt klasör olarak.
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export function contentTypeForFile(filename: string): string {
  return CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? "application/octet-stream";
}

// Yol geçişini (path traversal) önlemek için: dosya adı sadece rastgele
// üretilmiş (randomUUID + uzantı) bir isim olmalı, hiçbir ayraç içermemeli.
export function isSafeUploadFilename(filename: string): boolean {
  return /^[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/.test(filename);
}
