import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductAvailabilityToggle } from "./ProductAvailabilityToggle";
import { ProductDeleteButton } from "./ProductDeleteButton";

export default async function UrunlerPage() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { category: true, allergens: { include: { allergen: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Ürünler</h1>
          <p className="text-sm text-neutral-500">
            Menünüzdeki ürünleri buradan yönetin.
          </p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          + Yeni Ürün
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">
            Henüz ürün eklenmedi. Başlamak için &quot;Yeni Ürün&quot; butonuna
            tıklayın.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <ul className="divide-y divide-neutral-100">
            {products.map((product) => (
              <li key={product.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        Görsel yok
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-neutral-900">
                        {product.name}
                      </span>
                      {!product.isAvailable && (
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                          Tükendi
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-neutral-500">
                      {product.category.name}
                      {product.calories != null ? ` · ${product.calories} kcal` : ""}
                    </p>
                    {product.allergens.length > 0 && (
                      <p className="truncate text-xs text-amber-600">
                        Alerjenler:{" "}
                        {product.allergens.map((a) => a.allergen.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                  <span className="text-sm font-semibold text-neutral-900">
                    {product.price.toFixed(2)} ₺
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <ProductAvailabilityToggle
                      id={product.id}
                      isAvailable={product.isAvailable}
                    />
                    <Link
                      href={`/admin/urunler/${product.id}`}
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Düzenle
                    </Link>
                    <ProductDeleteButton id={product.id} name={product.name} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
