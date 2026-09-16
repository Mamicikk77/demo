"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCategory, type FormState } from "@/lib/actions/categories";

const initialState: FormState = {};

export function CategoryCreateForm() {
  const [state, formAction, pending] = useActionState(createCategory, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(pending);

  useEffect(() => {
    if (prevPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    prevPending.current = pending;
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
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
      <label className="flex items-center gap-2 pb-2 text-sm text-neutral-600">
        <input type="checkbox" name="isFeatured" />
        Öne çıkar (vurgulu kutu)
      </label>
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
