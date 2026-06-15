"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, requireAdmin, setAdminSession, validateAdminCredentials } from "@/lib/auth";
import { categories } from "@/lib/categories";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { getPrisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/validations";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function portfolioPayload(formData: FormData) {
  const parsed = portfolioSchema.safeParse({
    categoryId: formValue(formData, "categoryId"),
    imageUrl: formValue(formData, "imageUrl"),
    imagePublicId: formValue(formData, "imagePublicId") || null,
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
    displayOrder: formValue(formData, "displayOrder") || "0",
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues.map((issue) => issue.message).join(" "),
    };
  }

  return {
    success: true as const,
    data: {
      ...parsed.data,
      imagePublicId: parsed.data.imagePublicId || null,
    },
  };
}

export async function loginAction(_state: { error: string }, formData: FormData) {
  const email = formValue(formData, "email");
  const password = formValue(formData, "password");

  if (!validateAdminCredentials(email, password)) {
    return { error: "Invalid admin email or password." };
  }

  await setAdminSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createPortfolioItem(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const payload = portfolioPayload(formData);

  if (!payload.success) {
    redirect(`/admin/portfolio/new?error=${encodeURIComponent(payload.error)}`);
  }

  await prisma.portfolioItem.create({
    data: payload.data,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const payload = portfolioPayload(formData);
  if (!payload.success) {
    redirect(`/admin/portfolio/${id}/edit?error=${encodeURIComponent(payload.error)}`);
  }

  const current = await prisma.portfolioItem.findUnique({ where: { id } });

  if (!current) {
    throw new Error("Portfolio item not found.");
  }

  await prisma.portfolioItem.update({
    where: { id },
    data: payload.data,
  });

  if (current.imagePublicId && current.imagePublicId !== payload.data.imagePublicId) {
    await deleteCloudinaryImage(current.imagePublicId);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolioItem(id: string) {
  await requireAdmin();
  const prisma = getPrisma();
  const item = await prisma.portfolioItem.delete({ where: { id } });

  await deleteCloudinaryImage(item.imagePublicId);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  await getPrisma().portfolioItem.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
}

export async function togglePublished(id: string, isPublished: boolean) {
  await requireAdmin();
  await getPrisma().portfolioItem.update({ where: { id }, data: { isPublished } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
}

export async function ensureDefaultCategories() {
  const prisma = getPrisma();
  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { id: category.id },
        update: { label: category.label },
        create: category,
      }),
    ),
  );
}
