"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { UPLOAD_DIR } from "@/lib/uploads";

const productSchema = z.object({
  name: z.string().trim().min(1, "Ürün adı gereklidir."),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, "Fiyat 0 veya daha büyük olmalıdır."),
  calories: z.union([z.coerce.number().int().min(0), z.literal("")]).optional(),
  categoryId: z.string().min(1, "Kategori seçilmelidir."),
});

export type FormState = {
  error?: string;
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function saveImage(file: File): Promise<string> {
  await mkdir(/*turbopackIgnore: true*/ UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, filename), buffer);
  return `/uploads/${filename}`;
}

async function deleteImageFile(imageUrl: string | null) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/")) return;
  try {
    await unlink(
      path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, imageUrl.slice("/uploads/".length))
    );
  } catch {
    // dosya zaten yoksa yoksay
  }
}

function getAllergenIds(formData: FormData): string[] {
  return formData.getAll("allergenIds").map(String).filter(Boolean);
}

export async function createProduct(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
    price: formData.get("price"),
    calories: formData.get("calories") ?? "",
    categoryId: formData.get("categoryId"),
  });

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
      description: parsed.data.description || null,
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
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? undefined,
    price: formData.get("price"),
    calories: formData.get("calories") ?? "",
    categoryId: formData.get("categoryId"),
  });

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
        description: parsed.data.description || null,
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
