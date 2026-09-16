"use client";

import { toggleProductAvailability } from "@/lib/actions/products";

export function ProductAvailabilityToggle({
  id,
  isAvailable,
}: {
  id: string;
  isAvailable: boolean;
}) {
  return (
    <form
      action={async () => {
        await toggleProductAvailability(id, !isAvailable);
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
      >
        {isAvailable ? "Tükendi Yap" : "Stoğa Ekle"}
      </button>
    </form>
  );
}
