import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/lib/actions/products";
import { ProductForm } from "../ProductForm";

export default async function YeniUrunPage() {
  const [categories, allergens] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.allergen.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/urunler"
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          ← Ürünlere dön
        </Link>
        <h1 className="mt-1 text-lg font-semibold text-neutral-900">
          Yeni Ürün
        </h1>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Ürün ekleyebilmek için önce en az bir{" "}
          <Link href="/admin/kategoriler" className="underline">
            kategori oluşturmalısınız
          </Link>
          .
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <ProductForm
            categories={categories}
            allergens={allergens}
            action={createProduct}
            submitLabel="Ürünü Ekle"
          />
        </div>
      )}
    </div>
  );
}
