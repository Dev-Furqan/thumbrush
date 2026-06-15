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

function storageErrorMessage(action: string) {
  return `Admin storage is not available. Check the production database connection and migrations, then try to ${action} again.`;
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

  try {
    await ensureDefaultCategories();
    await prisma.portfolioItem.create({
      data: payload.data,
    });
  } catch (error) {
    console.error("[admin] failed to create portfolio item", error);
    redirect(`/admin/portfolio/new?error=${encodeURIComponent(storageErrorMessage("save this image"))}`);
  }

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

  let current;
  try {
    await ensureDefaultCategories();
    current = await prisma.portfolioItem.findUnique({ where: { id } });

    if (!current) {
      redirect(`/admin/portfolio?error=${encodeURIComponent("Portfolio item not found.")}`);
    }

    await prisma.portfolioItem.update({
      where: { id },
      data: payload.data,
    });
  } catch (error) {
    console.error("[admin] failed to update portfolio item", error);
    redirect(`/admin/portfolio/${id}/edit?error=${encodeURIComponent(storageErrorMessage("update this image"))}`);
  }

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
  let item;
  try {
    item = await getPrisma().portfolioItem.delete({ where: { id } });
  } catch (error) {
    console.error("[admin] failed to delete portfolio item", error);
    return;
  }

  await deleteCloudinaryImage(item.imagePublicId);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  try {
    await getPrisma().portfolioItem.update({ where: { id }, data: { isFeatured } });
  } catch (error) {
    console.error("[admin] failed to toggle featured status", error);
    return;
  }
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
}

export async function togglePublished(id: string, isPublished: boolean) {
  await requireAdmin();
  try {
    await getPrisma().portfolioItem.update({ where: { id }, data: { isPublished } });
  } catch (error) {
    console.error("[admin] failed to toggle published status", error);
    return;
  }
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
