import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
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

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-neutral-50 px-4 py-10">
      <h1 className="mb-8 text-center text-2xl font-semibold text-neutral-900">
        Menü
      </h1>

      <div className="space-y-10">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="mb-3 border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-900">
              {category.name}
            </h2>
            <div className="space-y-4">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className={`flex gap-3 rounded-xl bg-white p-3 shadow-sm ${
                    !product.isAvailable ? "opacity-50" : ""
                  }`}
                >
                  {product.imageUrl && (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-neutral-900">
                        {product.name}
                        {!product.isAvailable && (
                          <span className="ml-2 text-xs font-normal text-red-500">
                            (Tükendi)
                          </span>
                        )}
                      </h3>
                      <span className="whitespace-nowrap text-sm font-semibold text-neutral-900">
                        {product.price.toFixed(2)} ₺
                      </span>
                    </div>
                    {product.description && (
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                      {product.calories != null && (
                        <span>{product.calories} kcal</span>
                      )}
                      {product.allergens.length > 0 && (
                        <span className="text-amber-600">
                          Alerjenler:{" "}
                          {product.allergens
                            .map((a) => a.allergen.name)
                            .join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
