import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { GODZ_MENU } from "./godz-menu-data";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const ALLERGENS: { name: string; nameEn: string; nameRu: string }[] = [
  { name: "Gluten içeren tahıllar", nameEn: "Gluten-containing cereals", nameRu: "Злаки, содержащие глютен" },
  { name: "Kabuklu deniz ürünleri", nameEn: "Crustaceans", nameRu: "Ракообразные" },
  { name: "Yumurta", nameEn: "Egg", nameRu: "Яйцо" },
  { name: "Balık", nameEn: "Fish", nameRu: "Рыба" },
  { name: "Yer fıstığı", nameEn: "Peanuts", nameRu: "Арахис" },
  { name: "Soya", nameEn: "Soy", nameRu: "Соя" },
  { name: "Süt (laktoz dahil)", nameEn: "Milk (incl. lactose)", nameRu: "Молоко (включая лактозу)" },
  { name: "Sert kabuklu yemişler (fındık, ceviz, badem vb.)", nameEn: "Tree nuts (hazelnut, walnut, almond etc.)", nameRu: "Орехи (фундук, грецкий орех, миндаль и т.д.)" },
  { name: "Kereviz", nameEn: "Celery", nameRu: "Сельдерей" },
  { name: "Hardal", nameEn: "Mustard", nameRu: "Горчица" },
  { name: "Susam", nameEn: "Sesame", nameRu: "Кунжут" },
  { name: "Kükürt dioksit ve sülfitler", nameEn: "Sulphur dioxide and sulphites", nameRu: "Диоксид серы и сульфиты" },
  { name: "Lüpin", nameEn: "Lupin", nameRu: "Люпин" },
  { name: "Yumuşakçalar", nameEn: "Molluscs", nameRu: "Моллюски" },
];

async function main() {
  for (const allergen of ALLERGENS) {
    await prisma.allergen.upsert({
      where: { name: allergen.name },
      update: { nameEn: allergen.nameEn, nameRu: allergen.nameRu },
      create: allergen,
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

  // "Ana Yemekler" sadece yeni (üç dilli) menüde var — eski menüde
  // "Sıcak Yemekler" adıyla geçiyordu. Bu yüzden tek başlı bir eşleşme
  // kontrolü için güvenilir bir işaret: bazı kategori isimleri (ör.
  // "Salatalar") eski ve yeni menüde ortak olduğundan, tek bir isim
  // eşleşmesi yanlışlıkla "zaten seed edilmiş" sanılmasına yol açabilir.
  const newMenuMarker = await prisma.category.findFirst({
    where: { name: "Ana Yemekler" },
  });
  const hasNewMenu = Boolean(newMenuMarker);

  if (!hasNewMenu) {
    // Denemeler sırasında oluşan eski/yer tutucu kategorileri temizle —
    // bu veritabanı henüz gerçek işletme verisi içermiyorsa (ilk kurulum)
    // eski GODZ menüsünü yeni üç dilli menüyle değiştiriyoruz.
    await prisma.category.deleteMany({});

    const allergenByName = new Map(
      (await prisma.allergen.findMany()).map((a) => [a.name, a.id])
    );

    for (const [categoryIndex, category] of GODZ_MENU.entries()) {
      await prisma.category.create({
        data: {
          name: category.name,
          nameEn: category.nameEn ?? null,
          nameRu: category.nameRu ?? null,
          section: category.section,
          imageUrl: category.image ?? null,
          sortOrder: categoryIndex,
          products: {
            create: category.items.map((item, itemIndex) => ({
              name: item.name,
              nameEn: item.nameEn ?? null,
              nameRu: item.nameRu ?? null,
              description: item.description || null,
              descriptionEn: item.descriptionEn || null,
              descriptionRu: item.descriptionRu || null,
              price: item.price,
              calories: item.calories ?? null,
              imageUrl: item.image ?? null,
              sortOrder: itemIndex,
              allergens: {
                create: (item.allergenNames ?? [])
                  .map((name) => allergenByName.get(name))
                  .filter((id): id is string => Boolean(id))
                  .map((allergenId) => ({ allergenId })),
              },
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
