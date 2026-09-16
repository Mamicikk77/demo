import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

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

  const existingCategory = await prisma.category.findFirst();
  if (!existingCategory) {
    await prisma.category.create({
      data: {
        name: "Örnek Kategori",
        sortOrder: 0,
      },
    });
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
