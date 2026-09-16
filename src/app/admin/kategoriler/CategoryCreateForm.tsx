"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import Image from "next/image";
import { createCategory, type FormState } from "@/lib/actions/categories";

const initialState: FormState = {};

export function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(pending);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (prevPending.current && !pending && !state.error) {
      formRef.current?.reset();
      setPreview(null);
    }
    prevPending.current = pending;
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <label className="mb-1 block text-xs font-medium text-neutral-600">
            Kategori Adı
          </label>
          <input
            name="name"
            required
            placeholder="Örn. Başlangıçlar"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="mb-1 block text-xs font-medium text-neutral-600">
            Açıklama (opsiyonel)
          </label>
          <input
            name="description"
            placeholder="Kısa açıklama"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-neutral-600">
            Bölüm
          </label>
          <select
            name="section"
            defaultValue="food"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900"
          >
            <option value="food">Yemek</option>
            <option value="drink">İçecek</option>
          </select>
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-neutral-600">
          <input type="checkbox" name="isFeatured" />
          Öne çıkar (vurgulu kutu)
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">
          Kategori Görseli (opsiyonel)
        </label>
        <div className="flex items-center gap-3">
          {preview && (
            <Image
              src={preview}
              alt="Önizleme"
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg object-cover"
              unoptimized
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
            placeholder="Kategori adı (İngilizce)"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <input
            name="nameRu"
            placeholder="Kategori adı (Rusça)"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <input
            name="descriptionEn"
            placeholder="Açıklama (İngilizce)"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <input
            name="descriptionRu"
            placeholder="Açıklama (Rusça)"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
        </div>
      </details>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Ekleniyor..." : "Ekle"}
      </button>
      {state.error && (
        <p className="w-full text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
