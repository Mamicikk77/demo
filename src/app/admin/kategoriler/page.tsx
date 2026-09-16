import { prisma } from "@/lib/prisma";
import { CategoryCreateForm } from "./CategoryCreateForm";
import { CategoryRow } from "./CategoryRow";

export default async function KategorilerPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Kategoriler</h1>
        <p className="text-sm text-neutral-500">
          Menünüzdeki kategorileri buradan yönetin.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-medium text-neutral-900">
          Yeni Kategori Ekle
        </h2>
        <CategoryCreateForm />
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {categories.length === 0 ? (
          <p className="p-6 text-sm text-neutral-500">
            Henüz kategori eklenmedi.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={{
                  id: category.id,
                  name: category.name,
                  nameEn: category.nameEn,
                  nameRu: category.nameRu,
                  description: category.description,
                  descriptionEn: category.descriptionEn,
                  descriptionRu: category.descriptionRu,
                  imageUrl: category.imageUrl,
                  section: category.section,
                  isActive: category.isActive,
                  isFeatured: category.isFeatured,
                  productCount: category._count.products,
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
