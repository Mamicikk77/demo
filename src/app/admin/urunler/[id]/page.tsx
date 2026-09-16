import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "../ProductForm";

export default async function UrunDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, allergens] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { allergens: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.allergen.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  const updateWithId = updateProduct.bind(null, product.id);

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
          Ürünü Düzenle
        </h1>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <ProductForm
          categories={categories}
          allergens={allergens}
          action={updateWithId}
          submitLabel="Değişiklikleri Kaydet"
          initialData={{
            name: product.name,
            nameEn: product.nameEn,
            nameRu: product.nameRu,
            description: product.description,
            descriptionEn: product.descriptionEn,
            descriptionRu: product.descriptionRu,
            price: product.price,
            calories: product.calories,
            categoryId: product.categoryId,
            imageUrl: product.imageUrl,
            allergenIds: product.allergens.map((a) => a.allergenId),
          }}
        />
      </div>
    </div>
  );
}
