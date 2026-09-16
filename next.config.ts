import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ürün/kategori görseli yükleme Server Action üzerinden çalışıyor.
  // Next.js'in varsayılan istek boyutu sınırı 1 MB'dır; bu, kendi
  // ALLOWED_IMAGE_TYPES/MAX_IMAGE_BYTES (5 MB) kontrolümüze hiç
  // ulaşmadan telefon fotoğrafı gibi büyük dosyaları reddedip forma
  // beklenmedik bir hata olarak yansımasına (görsel değiştirirken
  // "çökme" hissi) yol açıyordu.
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async rewrites() {
    return [
      { source: "/qr-menu", destination: "/qr-menu/index.html" },
    ];
  },
};

export default nextConfig;
