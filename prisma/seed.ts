import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { GODZ_MENU } from "./godz-menu-data";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const ALLERGENS = [
  "Gluten içeren tahıllar",
  "Kabuklu deniz ürünleri",
  "Yumurta",
  "Balık",
  "Yer fıstığı",
  "Soya",
  "Süt (laktoz dahil)",
  "Sert kabuklu yemişler (fındık, ceviz, badem vb.)",
  "Kereviz",
  "Hardal",
  "Susam",
  "Kükürt dioksit ve sülfitler",
  "Lüpin",
  "Yumuşakçalar",
];

async function main() {
  for (const name of ALLERGENS) {
    await prisma.allergen.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const email = process.env.ADMIN_EMAIL ?? "admin@restoran.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "İşletme Sahibi",
      passwordHash,
    },
  });

  // Denemeler sırasında oluşan yer tutucu kategorileri temizle (gerçek
  // menü verisiyle çakışmaması için) — sadece bu iki isimle, kullanıcının
  // kendi eklediği hiçbir şeye dokunmaz.
  await prisma.category.deleteMany({
    where: { name: { in: ["Örnek Kategori", "İçecekler"] } },
  });

  const godzCategoryNames = GODZ_MENU.map((c) => c.name);
  const hasGodzMenu = await prisma.category.findFirst({
    where: { name: { in: godzCategoryNames } },
  });

  if (!hasGodzMenu) {
    for (const [categoryIndex, category] of GODZ_MENU.entries()) {
      await prisma.category.create({
        data: {
          name: category.name,
          description: category.note ?? null,
          isFeatured: category.isFeatured ?? false,
          sortOrder: categoryIndex,
          products: {
            create: category.items.map(([name, description, price], itemIndex) => ({
              name,
              description: description || null,
              price,
              sortOrder: itemIndex,
            })),
          },
        },
      });
    }
  }

  console.log("Seed tamamlandı.");
  console.log(`Giriş bilgileri -> e-posta: ${email} | şifre: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
