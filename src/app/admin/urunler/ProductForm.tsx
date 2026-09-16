"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import type { FormState } from "@/lib/actions/products";

type Category = { id: string; name: string };
type Allergen = { id: string; name: string };

type ProductInitialData = {
  name: string;
  nameEn: string | null;
  nameRu: string | null;
  description: string | null;
  descriptionEn: string | null;
  descriptionRu: string | null;
  price: number;
  calories: number | null;
  categoryId: string;
  imageUrl: string | null;
  allergenIds: string[];
};

const initialState: FormState = {};

export function ProductForm({
  categories,
  allergens,
  action,
  initialData,
  submitLabel,
}: {
  categories: Category[];
  allergens: Allergen[];
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialData?: ProductInitialData;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(
    initialData?.imageUrl ?? null
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Ürün Adı
          </label>
          <input
            name="name"
            required
            defaultValue={initialData?.name}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Kategori
          </label>
          <select
            name="categoryId"
            required
            defaultValue={initialData?.categoryId}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
          >
            <option value="" disabled>
              Kategori seçin
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Fiyat (₺)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={initialData?.price}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Kalori (opsiyonel)
          </label>
          <input
            name="calories"
            type="number"
            min="0"
            defaultValue={initialData?.calories ?? undefined}
            placeholder="Örn. 350"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Açıklama
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialData?.description ?? undefined}
          placeholder="Ürünün içeriğini kısaca anlatın"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
      </div>

      <details className="rounded-lg border border-neutral-200 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-neutral-700">
          İngilizce ve Rusça çeviriler (opsiyonel)
        </summary>
        <p className="mt-1 mb-3 text-xs text-neutral-500">
          Boş bırakırsanız QR menüde o dil için Türkçe metin gösterilir.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Ürün Adı (İngilizce)
            </label>
            <input
              name="nameEn"
              defaultValue={initialData?.nameEn ?? undefined}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Ürün Adı (Rusça)
            </label>
            <input
              name="nameRu"
              defaultValue={initialData?.nameRu ?? undefined}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Açıklama (İngilizce)
            </label>
            <textarea
              name="descriptionEn"
              rows={2}
              defaultValue={initialData?.descriptionEn ?? undefined}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Açıklama (Rusça)
            </label>
            <textarea
              name="descriptionRu"
              rows={2}
              defaultValue={initialData?.descriptionRu ?? undefined}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </div>
        </div>
      </details>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Ürün Görseli
        </label>
        <div className="flex items-center gap-4">
          {preview && (
            <Image
              src={preview}
              alt="Önizleme"
              width={64}
              height={64}
              className="h-16 w-16 rounded-lg object-cover"
              unoptimized={preview.startsWith("blob:")}
            />
          )}
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="text-sm text-neutral-600"
          />
        </div>
        {initialData?.imageUrl && (
          <label className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
            <input type="checkbox" name="removeImage" />
            Mevcut görseli kaldır
          </label>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-700">
          Alerjen Uyarıları
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allergens.map((allergen) => (
            <label
              key={allergen.id}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                name="allergenIds"
                value={allergen.id}
                defaultChecked={initialData?.allergenIds.includes(allergen.id)}
              />
              {allergen.name}
            </label>
          ))}
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Kaydediliyor..." : submitLabel}
      </button>
    </form>
  );
}
