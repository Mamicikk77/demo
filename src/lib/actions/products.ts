"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  saveImage,
  deleteImageFile,
} from "@/lib/imageUpload";

const productSchema = z.object({
  name: z.string().trim().min(1, "Ürün adı gereklidir."),
  nameEn: z.string().trim().optional(),
  nameRu: z.string().trim().optional(),
  description: z.string().trim().optional(),
  descriptionEn: z.string().trim().optional(),
  descriptionRu: z.string().trim().optional(),
  price: z.coerce.number().min(0, "Fiyat 0 veya daha büyük olmalıdır."),
  calories: z.union([z.coerce.number().int().min(0), z.literal("")]).optional(),
  categoryId: z.string().min(1, "Kategori seçilmelidir."),
});

export type FormState = {
  error?: string;
};

function getAllergenIds(formData: FormData): string[] {
  return formData.getAll("allergenIds").map(String).filter(Boolean);
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    nameEn: formData.get("nameEn") ?? undefined,
    nameRu: formData.get("nameRu") ?? undefined,
    description: formData.get("description") ?? undefined,
    descriptionEn: formData.get("descriptionEn") ?? undefined,
    descriptionRu: formData.get("descriptionRu") ?? undefined,
    price: formData.get("price"),
    calories: formData.get("calories") ?? "",
    categoryId: formData.get("categoryId"),
  });
}

export async function createProduct(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseProductForm(formData);

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

  const allergenIds = getAllergenIds(formData);
  const maxSort = await prisma.product.aggregate({ _max: { sortOrder: true } });

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      nameEn: parsed.data.nameEn || null,
      nameRu: parsed.data.nameRu || null,
      description: parsed.data.description || null,
      descriptionEn: parsed.data.descriptionEn || null,
      descriptionRu: parsed.data.descriptionRu || null,
      price: parsed.data.price,
      calories: parsed.data.calories === "" || parsed.data.calories === undefined ? null : Number(parsed.data.calories),
      categoryId: parsed.data.categoryId,
      imageUrl,
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      allergens: {
        create: allergenIds.map((allergenId) => ({ allergenId })),
      },
    },
  });

  revalidatePath("/admin/urunler");
  revalidatePath("/menu");
  redirect("/admin/urunler");
}

export async function updateProduct(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Ürün bulunamadı." };
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

  const allergenIds = getAllergenIds(formData);

  await prisma.$transaction([
    prisma.productAllergen.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        nameEn: parsed.data.nameEn || null,
        nameRu: parsed.data.nameRu || null,
        description: parsed.data.description || null,
        descriptionEn: parsed.data.descriptionEn || null,
        descriptionRu: parsed.data.descriptionRu || null,
        price: parsed.data.price,
        calories: parsed.data.calories === "" || parsed.data.calories === undefined ? null : Number(parsed.data.calories),
        categoryId: parsed.data.categoryId,
        imageUrl,
        allergens: {
          create: allergenIds.map((allergenId) => ({ allergenId })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/urunler");
  revalidatePath("/menu");
  redirect("/admin/urunler");
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (existing?.imageUrl) {
    await deleteImageFile(existing.imageUrl);
  }
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/urunler");
  revalidatePath("/menu");
}

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  await prisma.product.update({ where: { id }, data: { isAvailable } });
  revalidatePath("/admin/urunler");
  revalidatePath("/menu");
}
