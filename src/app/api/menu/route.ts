import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: { allergens: { include: { allergen: true } } },
      },
    },
  });

  const payload = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    products: category.products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      calories: product.calories,
      isAvailable: product.isAvailable,
      allergens: product.allergens.map((a) => a.allergen.name),
    })),
  }));

  return NextResponse.json(
    { categories: payload },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
