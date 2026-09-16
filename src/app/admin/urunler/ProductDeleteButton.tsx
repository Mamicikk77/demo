"use client";

import { deleteProduct } from "@/lib/actions/products";

export function ProductDeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      onSubmit={(e) => {
        if (!window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)) {
          e.preventDefault();
        }
      }}
      action={async () => {
        await deleteProduct(id);
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
      >
        Sil
      </button>
    </form>
  );
}
