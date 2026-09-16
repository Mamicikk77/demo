import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function csvRow(values: string[]): string {
  return values.map(csvEscape).join(",") + "\r\n";
}

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  let csv = csvRow(["Kategori", "Ürün", "Açıklama", "Fiyat", "Not", "Öne Çıkar", "Görünür"]);

  for (const category of categories) {
    for (const product of category.products) {
      csv += csvRow([
        category.name,
        product.name,
        product.description ?? "",
        String(product.price),
        category.description ?? "",
        category.isFeatured ? "EVET" : "HAYIR",
        product.isAvailable ? "EVET" : "HAYIR",
      ]);
    }
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
