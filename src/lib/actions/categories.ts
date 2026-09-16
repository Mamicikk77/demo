"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Kategori adı gereklidir."),
  description: z.string().trim().optional(),
});

export type FormState = {
  error?: string;
};

function revalidateMenu() {
  revalidatePath("/admin/kategoriler");
  revalidatePath("/menu");
}

export async function createCategory(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  const isFeatured = formData.get("isFeatured") === "on";
  const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      isFeatured,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });

  revalidateMenu();
  return {};
}

export async function updateCategory(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  const isFeatured = formData.get("isFeatured") === "on";

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      isFeatured,
    },
  });

  revalidateMenu();
  return {};
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidateMenu();
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  await prisma.category.update({ where: { id }, data: { isActive } });
  revalidateMenu();
}
