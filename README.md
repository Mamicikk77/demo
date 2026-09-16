# QR Menü Yönetim Paneli

İşletme sahiplerinin QR menülerindeki ürünleri, fiyatları, açıklamaları,
kategorileri, alerjen uyarılarını ve kalori bilgilerini kod bilmeden
yönetebilmesi için basit bir yönetim paneli.

## Teknolojiler

- Next.js 16 (App Router, Server Actions)
- Prisma 7 + SQLite (libSQL sürücüsü ile, native derleme gerektirmez)
- Kimlik doğrulama: httpOnly çerez + JWT (jose)
- Tailwind CSS

## Kurulum

```bash
npm install
npm run db:migrate   # veritabanı şemasını oluşturur
npm run db:seed       # örnek admin kullanıcısı, alerjen listesi ve örnek kategori ekler
npm run dev
```

Uygulama http://localhost:3000 adresinde açılır.

## Varsayılan giriş bilgileri

Seed script'i çalıştırıldığında `.env` dosyasındaki `ADMIN_EMAIL` /
`ADMIN_PASSWORD` değerleri kullanılır (varsayılan: `admin@restoran.com` /
`Admin123!`). Prodüksiyona geçmeden önce bu şifreyi mutlaka değiştirin.

## Sayfalar

- `/login` — yönetici girişi
- `/admin/urunler` — ürün listesi, ekleme, düzenleme, silme, stok durumu
- `/admin/kategoriler` — kategori listesi, ekleme, düzenleme, aktif/pasif
- `/menu` — panelin kendi dahili, salt-okunur örnek menü sayfası (test amaçlı)
- `/qr-menu` — **GODZ Cafe & Restaurant**'ın gerçek QR menü tasarımı
  (`public/qr-menu/` içinde). Video kapak ekranı ve tam tasarım aynen
  korunuyor; sadece menü içeriğini artık Google Sheets yerine bu panelden
  okuyor. QR kodunuzu bu adrese yönlendirin.
- `/api/menu` — menüyü JSON olarak döner (genel amaçlı entegrasyonlar için)
- `/api/menu/csv` — menüyü GODZ tasarımının beklediği CSV formatında döner
  (`Kategori,Ürün,Açıklama,Fiyat,Not,Öne Çıkar,Görünür`)

## GODZ QR menüsü nasıl bağlı?

`public/qr-menu/config.js` içindeki `sheetCsvUrl` artık bir Google Sheets
linki değil, panelin kendi `/api/menu/csv` uç noktasını gösteriyor. Panelde
yaptığınız her ürün/kategori değişikliği birkaç saniye içinde `/qr-menu`
sayfasına yansır — Google Sheets'e dokunmaya gerek kalmadı.

- Bir **kategoriyi** "Öne Çıkar" olarak işaretlerseniz (Kategoriler sayfası),
  GODZ tasarımındaki "Godz Sepeti" tarzı vurgulu/çerçeveli kutu olarak
  görünür; kategori açıklaması da o kutunun üstündeki rozet metni olur.
- Bir ürünü **"Tükendi Yap"** ile işaretlerseniz, GODZ menüsünden tamamen
  kaybolur (bu tasarım "tükendi" rozeti değil, tamamen gizleme mantığıyla
  çalışıyor — panelin kendi `/menu` sayfasında ise üstü çizili "Tükendi"
  etiketiyle gösterilir).
- Kalori ve alerjen bilgileri şu an GODZ tasarımında **gösterilmiyor** (o
  tasarımda bu alanlar için yer yok); panelin kendi `/menu` sayfasında
  görünürler. İsterseniz GODZ tasarımına da küçük bir alerjen/kalori satırı
  ekleyebiliriz.
- Panel ve QR menü aynı alan adı altında yayınlandığı sürece (`/api/menu/csv`
  göreli bir yol olduğu için) hiçbir ayar değiştirmeden çalışır. QR menüyü
  **farklı bir alan adında** (örn. ayrı bir Netlify sitesi) yayınlamak
  isterseniz, `config.js`'teki `sheetCsvUrl` değerini panelin tam adresine
  çevirin (örn. `https://panel.godzcafe.com/api/menu/csv`).

## Ürün alanları

- Ad, açıklama, fiyat, kalori (opsiyonel)
- Kategori
- Görsel (JPEG/PNG/WEBP/GIF, maks. 5 MB — `UPLOAD_DIR` klasörüne kaydedilir,
  bkz. Railway'e yayınlama)
- Alerjen uyarıları (14 yaygın alerjenden çoklu seçim)
- Stok durumu (tükendi / mevcut)

## Kategori alanları

- Ad, açıklama (GODZ tasarımında kategori notu olarak kullanılır)
- Aktif/Pasif (pasif kategoriler hiçbir menüde görünmez)
- Öne Çıkar (GODZ tasarımında vurgulu/çerçeveli kutu)

## Notlar

- Veritabanı dosyası (`dev.db`) ve yüklenen görseller (`uploads/` klasörü,
  `public/` DIŞINDA — `src/app/uploads/[filename]/route.ts` üzerinden
  servis edilir) git'e dahil edilmez.
- `SESSION_SECRET` değerini prodüksiyonda mutlaka değiştirin.
- `public/qr-menu/index.html` içindeki `godz-logo.png`, `godz-hero.mp4` ve
  `config.js` referansları bilinçli olarak `/qr-menu/...` şeklinde mutlak
  yol kullanır (panel içine gömülü çalışması için). Bu klasörü tekrar
  bağımsız bir statik site olarak (Netlify/GitHub Pages) yayınlamak
  isterseniz, bu üç referansı tekrar göreli hale getirmeniz gerekir
  (`/qr-menu/` ön ekini kaldırın).

## Railway'e yayınlama

Bu proje SQLite dosyasını ve yüklenen görselleri yerel diskte tuttuğu için,
kalıcı disk (volume) sunan bir platform gerekiyor. Railway'de bir servise
**tek** volume bağlanabildiğinden, veritabanı dosyası ve görseller aynı
volume içinde iki alt klasör olarak tutulur.

1. Bu projeyi bir GitHub reposuna yükleyin (panelin kendi reposu — GODZ QR
   menü reposundan farklı, ayrı bir repo).
2. [railway.app](https://railway.app) üzerinde yeni bir proje oluşturup bu
   GitHub reposuna bağlayın ("Deploy from GitHub repo").
3. Servise bir **Volume** ekleyin, mount path olarak `/app/data` girin.
4. Servisin **Variables** (ortam değişkenleri) kısmına şunları ekleyin:
   ```
   DATABASE_URL=file:/app/data/dev.db
   UPLOAD_DIR=/app/data/uploads
   SESSION_SECRET=<rastgele uzun bir metin, örn. openssl rand -hex 32>
   ADMIN_EMAIL=<gerçek giriş e-postanız>
   ADMIN_PASSWORD=<gerçek giriş şifreniz>
   ```
5. Railway otomatik olarak `npm install`, `npm run build` ve `npm run start`
   çalıştırır. `start` script'i deploy sırasında veritabanı şemasını kurar
   (`prisma migrate deploy`) ve admin kullanıcısını/alerjen listesini oluşturur
   (`prisma db seed`) — elle bir şey yapmanız gerekmez.
6. Railway size `https://xxxxx.up.railway.app` gibi bir adres verir. Panel bu
   adreste, QR menü ise aynı adresin `/qr-menu` altında çalışır — GODZ
   menüsünü GitHub Pages'te **ayrı** yayınlıyorsanız, o zaman
   `public/qr-menu/config.js` (ve GitHub'daki kopyası) içindeki `sheetCsvUrl`
   değerini `https://xxxxx.up.railway.app/api/menu/csv` yapmanız gerekir.
7. Koddan bir değişiklik yapıp GitHub'a push ettiğinizde Railway otomatik
   olarak yeniden yayınlar; veritabanı ve görseller volume'de kalıcı olduğu
   için kaybolmaz.
