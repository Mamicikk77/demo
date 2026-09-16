"use client";

import { useActionState, useState } from "react";
import {
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  type FormState,
} from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
};

const initialState: FormState = {};

export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const updateWithId = updateCategory.bind(null, category.id);
  const [state, formAction, pending] = useActionState(updateWithId, initialState);

  if (editing) {
    return (
      <li className="p-4">
        <form
          action={async (formData) => {
            await formAction(formData);
            setEditing(false);
          }}
          className="flex flex-wrap items-end gap-3"
        >
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
          <label className="flex items-center gap-2 pb-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={category.isFeatured}
            />
            Öne çıkar (vurgulu kutu)
          </label>
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
          {state.error && (
            <p className="w-full text-sm text-red-600">{state.error}</p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900">
            {category.name}
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
