import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function localized(tr: string | null, en: string | null, ru: string | null) {
  return { tr: tr ?? "", en: en || tr || "", ru: ru || tr || "" };
}

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: { sortOrder: "asc" },
        include: { allergens: { include: { allergen: true } } },
      },
    },
  });

  const payload = categories.map((category) => ({
    id: category.id,
    section: category.section,
    img: category.imageUrl,
    title: localized(category.name, category.nameEn, category.nameRu),
    items: category.products.map((product) => {
      const allergenNames = {
        tr: product.allergens.map((a) => a.allergen.name).join(", "),
        en: product.allergens
          .map((a) => a.allergen.nameEn || a.allergen.name)
          .join(", "),
        ru: product.allergens
          .map((a) => a.allergen.nameRu || a.allergen.name)
          .join(", "),
      };

      return {
        id: product.id,
        img: product.imageUrl,
        n: localized(product.name, product.nameEn, product.nameRu),
        d: localized(product.description, product.descriptionEn, product.descriptionRu),
        alg: allergenNames,
        p: product.price,
        kcal: product.calories,
      };
    }),
  }));

  return NextResponse.json(
    { categories: payload },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
