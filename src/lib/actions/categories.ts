"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  saveImage,
  deleteImageFile,
} from "@/lib/imageUpload";

const categorySchema = z.object({
  name: z.string().trim().min(1, "Kategori adı gereklidir."),
  nameEn: z.string().trim().optional(),
  nameRu: z.string().trim().optional(),
  description: z.string().trim().optional(),
  descriptionEn: z.string().trim().optional(),
  descriptionRu: z.string().trim().optional(),
  section: z.enum(["food", "drink"]).default("food"),
});

export type FormState = {
  error?: string;
};

function revalidateMenu() {
  revalidatePath("/admin/kategoriler");
  revalidatePath("/menu");
}

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    nameEn: formData.get("nameEn") ?? undefined,
    nameRu: formData.get("nameRu") ?? undefined,
    description: formData.get("description") ?? undefined,
    descriptionEn: formData.get("descriptionEn") ?? undefined,
    descriptionRu: formData.get("descriptionRu") ?? undefined,
    section: formData.get("section") || "food",
  });
}

export async function createCategory(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseCategoryForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  const imageFile = formData.get("image");
  let imageUrl: string | null = null;

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return { error: "Sadece JPEG, PNG, WEBP veya GIF görsel yükleyebilirsiniz." };
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return { error: "Görsel boyutu 5 MB'ı aşamaz." };
    }
    imageUrl = await saveImage(imageFile);
  }

  const isFeatured = formData.get("isFeatured") === "on";
  const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      nameEn: parsed.data.nameEn || null,
      nameRu: parsed.data.nameRu || null,
      description: parsed.data.description || null,
      descriptionEn: parsed.data.descriptionEn || null,
      descriptionRu: parsed.data.descriptionRu || null,
      section: parsed.data.section,
      imageUrl,
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
  const parsed = parseCategoryForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Kategori bulunamadı." };
  }

  const imageFile = formData.get("image");
  let imageUrl = existing.imageUrl;

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return { error: "Sadece JPEG, PNG, WEBP veya GIF görsel yükleyebilirsiniz." };
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return { error: "Görsel boyutu 5 MB'ı aşamaz." };
    }
    await deleteImageFile(existing.imageUrl);
    imageUrl = await saveImage(imageFile);
  }

  const removeImage = formData.get("removeImage") === "on";
  if (removeImage && !imageFile) {
    await deleteImageFile(existing.imageUrl);
    imageUrl = null;
  }

  const isFeatured = formData.get("isFeatured") === "on";

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      nameEn: parsed.data.nameEn || null,
      nameRu: parsed.data.nameRu || null,
      description: parsed.data.description || null,
      descriptionEn: parsed.data.descriptionEn || null,
      descriptionRu: parsed.data.descriptionRu || null,
      section: parsed.data.section,
      imageUrl,
      isFeatured,
    },
  });

  revalidateMenu();
  return {};
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (existing?.imageUrl) {
    await deleteImageFile(existing.imageUrl);
  }
  await prisma.category.delete({ where: { id } });
  revalidateMenu();
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  await prisma.category.update({ where: { id }, data: { isActive } });
  revalidateMenu();
}
