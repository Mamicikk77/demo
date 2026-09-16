"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  type FormState,
} from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  nameEn: string | null;
  nameRu: string | null;
  description: string | null;
  descriptionEn: string | null;
  descriptionRu: string | null;
  imageUrl: string | null;
  section: string;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
};

const initialState: FormState = {};

export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const updateWithId = updateCategory.bind(null, category.id);
  const [state, formAction, pending] = useActionState(updateWithId, initialState);
  const [preview, setPreview] = useState<string | null>(category.imageUrl);

  if (editing) {
    return (
      <li className="p-4">
        <form
          action={async (formData) => {
            await formAction(formData);
            setEditing(false);
          }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Kategori Adı
              </label>
              <input
                name="name"
                defaultValue={category.name}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Açıklama
              </label>
              <input
                name="description"
                defaultValue={category.description ?? ""}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
            <div className="min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Bölüm
              </label>
              <select
                name="section"
                defaultValue={category.section}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
              >
                <option value="food">Yemek</option>
                <option value="drink">İçecek</option>
              </select>
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={category.isFeatured}
              />
              Öne çıkar (vurgulu kutu)
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Kategori Görseli
            </label>
            <div className="flex items-center gap-3">
              {preview && (
                <Image
                  src={preview}
                  alt="Önizleme"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-lg object-cover"
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
            {category.imageUrl && (
              <label className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
                <input type="checkbox" name="removeImage" />
                Mevcut görseli kaldır
              </label>
            )}
          </div>

          <details className="rounded-lg border border-neutral-200 px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-neutral-700">
              İngilizce ve Rusça çeviriler (opsiyonel)
            </summary>
            <p className="mt-1 mb-3 text-xs text-neutral-500">
              Boş bırakırsanız QR menüde o dil için Türkçe metin gösterilir.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="nameEn"
                defaultValue={category.nameEn ?? ""}
                placeholder="Kategori adı (İngilizce)"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
              <input
                name="nameRu"
                defaultValue={category.nameRu ?? ""}
                placeholder="Kategori adı (Rusça)"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
              <input
                name="descriptionEn"
                defaultValue={category.descriptionEn ?? ""}
                placeholder="Açıklama (İngilizce)"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
              <input
                name="descriptionRu"
                defaultValue={category.descriptionRu ?? ""}
                placeholder="Açıklama (Rusça)"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              />
            </div>
          </details>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Vazgeç
            </button>
          </div>
          {state.error && (
            <p className="w-full text-sm text-red-600">{state.error}</p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
              Görsel yok
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-900">
              {category.name}
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
              {category.section === "drink" ? "İçecek" : "Yemek"}
            </span>
            {!category.isActive && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                Pasif
              </span>
            )}
            {category.isFeatured && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                Öne çıkan
              </span>
            )}
          </div>
          {category.description && (
            <p className="text-sm text-neutral-500">{category.description}</p>
          )}
          <p className="text-xs text-neutral-400">
            {category.productCount} ürün
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <form
          action={async () => {
            await toggleCategoryActive(category.id, !category.isActive);
          }}
        >
          <button
            type="submit"
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            {category.isActive ? "Pasif Yap" : "Aktif Yap"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Düzenle
        </button>
        <form
          onSubmit={(e) => {
            const message =
              category.productCount > 0
                ? `Bu kategoride ${category.productCount} ürün var. Kategoriyi silerseniz bu ürünler de silinir. Emin misiniz?`
                : "Bu kategoriyi silmek istediğinize emin misiniz?";
            if (!window.confirm(message)) {
              e.preventDefault();
            }
          }}
          action={async () => {
            await deleteCategory(category.id);
          }}
        >
          <button
            type="submit"
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
          >
            Sil
          </button>
        </form>
      </div>
    </li>
  );
}
