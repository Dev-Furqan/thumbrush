import type { PortfolioItem } from "@prisma/client";
import { getCategoryLabel } from "@/lib/categories";
import { deleteCloudinaryImage, getCloudinary } from "@/lib/cloudinary";
import { getPrisma } from "@/lib/prisma";
import type { PortfolioFormValues } from "@/lib/validations";

export type PortfolioStoreItem = Omit<PortfolioItem, "createdAt" | "updatedAt"> & {
  createdAt: Date;
  updatedAt: Date;
  category?: { label: string } | null;
};

type ListOptions = {
  includeDrafts?: boolean;
};

type CloudinaryResource = {
  public_id: string;
  secure_url?: string;
  url?: string;
  created_at?: string;
  context?: unknown;
};

const cloudinaryRecordKey = "thumbrush_record";
const cloudinaryFolder = "thumbrush-portfolio";

function shouldPreferCloudinary() {
  return process.env.VERCEL === "1" && process.env.DATABASE_URL?.trim().startsWith("file:");
}

function encodeCloudinaryId(publicId: string) {
  return `cloudinary_${Buffer.from(publicId).toString("base64url")}`;
}

function decodeCloudinaryId(id: string) {
  if (!id.startsWith("cloudinary_")) return null;

  try {
    return Buffer.from(id.slice("cloudinary_".length), "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function contextValue(context: unknown, key: string) {
  if (!context || typeof context !== "object") return undefined;
  const custom = "custom" in context && context.custom && typeof context.custom === "object" ? context.custom : context;
  const value = (custom as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

function cloudinaryBoolean(value: string | undefined, fallback: boolean) {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function cloudinaryDate(value: string | undefined) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function serializeContext(payload: PortfolioFormValues) {
  return [
    `${cloudinaryRecordKey}=true`,
    `categoryId=${payload.categoryId}`,
    `isFeatured=${payload.isFeatured ? "true" : "false"}`,
    `isPublished=${payload.isPublished ? "true" : "false"}`,
    `displayOrder=${payload.displayOrder}`,
    `updatedAt=${new Date().toISOString()}`,
  ].join("|");
}

function fromCloudinaryResource(resource: CloudinaryResource): PortfolioStoreItem | null {
  const imageUrl = resource.secure_url ?? resource.url;
  if (!imageUrl) return null;

  const categoryId = contextValue(resource.context, "categoryId") ?? "THUMBNAIL";
  const createdAt = cloudinaryDate(resource.created_at);
  const updatedAt = cloudinaryDate(contextValue(resource.context, "updatedAt"));

  return {
    id: encodeCloudinaryId(resource.public_id),
    categoryId,
    imageUrl,
    imagePublicId: resource.public_id,
    isFeatured: cloudinaryBoolean(contextValue(resource.context, "isFeatured"), false),
    isPublished: cloudinaryBoolean(contextValue(resource.context, "isPublished"), true),
    displayOrder: Number(contextValue(resource.context, "displayOrder") ?? 0),
    createdAt,
    updatedAt,
    category: { label: getCategoryLabel(categoryId) },
  };
}

async function listCloudinaryItems({ includeDrafts = false }: ListOptions = {}): Promise<PortfolioStoreItem[]> {
  const client = getCloudinary();
  if (!client) throw new Error("Cloudinary is not configured.");

  const result = await client.api.resources_by_context(cloudinaryRecordKey, "true", {
    context: true,
    max_results: 500,
    resource_type: "image",
  });

  const resources: CloudinaryResource[] = Array.isArray(result.resources) ? result.resources : [];

  return resources
    .filter((resource) => resource.public_id.startsWith(`${cloudinaryFolder}/`))
    .map(fromCloudinaryResource)
    .filter((item): item is PortfolioStoreItem => Boolean(item))
    .filter((item) => includeDrafts || item.isPublished)
    .sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
}

async function addCloudinaryContext(publicId: string, payload: PortfolioFormValues) {
  const client = getCloudinary();
  if (!client) throw new Error("Cloudinary is not configured.");
  await client.uploader.add_context(serializeContext(payload), [publicId]);
}

async function getCloudinaryItem(id: string) {
  const publicId = decodeCloudinaryId(id);
  if (!publicId) return null;

  const items = await listCloudinaryItems({ includeDrafts: true });
  return items.find((item) => item.imagePublicId === publicId) ?? null;
}

export async function listPortfolioItems(options: ListOptions = {}): Promise<PortfolioStoreItem[]> {
  if (shouldPreferCloudinary()) {
    return listCloudinaryItems(options);
  }

  try {
    const items = await getPrisma().portfolioItem.findMany({
      where: options.includeDrafts ? undefined : { isPublished: true },
      include: { category: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return items;
  } catch (error) {
    console.error("[portfolio-store] falling back to Cloudinary list", error);
    return listCloudinaryItems(options);
  }
}

export async function getPortfolioItem(id: string): Promise<PortfolioStoreItem | null> {
  const cloudinaryPublicId = decodeCloudinaryId(id);
  if (cloudinaryPublicId) return getCloudinaryItem(id);
  if (shouldPreferCloudinary()) return null;

  try {
    return await getPrisma().portfolioItem.findUnique({ where: { id } });
  } catch (error) {
    console.error("[portfolio-store] falling back to Cloudinary item lookup", error);
    return getCloudinaryItem(id);
  }
}

export async function createPortfolioItem(payload: PortfolioFormValues): Promise<PortfolioStoreItem | null> {
  if (shouldPreferCloudinary()) {
    if (!payload.imagePublicId) throw new Error("Cloudinary image public ID is required.");
    await addCloudinaryContext(payload.imagePublicId, payload);
    return getCloudinaryItem(encodeCloudinaryId(payload.imagePublicId));
  }

  try {
    return await getPrisma().portfolioItem.create({
      data: {
        ...payload,
        imagePublicId: payload.imagePublicId || null,
      },
    });
  } catch (error) {
    console.error("[portfolio-store] falling back to Cloudinary create", error);
    if (!payload.imagePublicId) throw error;
    await addCloudinaryContext(payload.imagePublicId, payload);
    return getCloudinaryItem(encodeCloudinaryId(payload.imagePublicId));
  }
}

export async function updatePortfolioItem(id: string, payload: PortfolioFormValues): Promise<PortfolioStoreItem | null> {
  const cloudinaryPublicId = decodeCloudinaryId(id);

  if (cloudinaryPublicId) {
    await addCloudinaryContext(cloudinaryPublicId, payload);
    return getCloudinaryItem(id);
  }

  if (shouldPreferCloudinary()) {
    if (!payload.imagePublicId) throw new Error("Cloudinary image public ID is required.");
    await addCloudinaryContext(payload.imagePublicId, payload);
    return getCloudinaryItem(encodeCloudinaryId(payload.imagePublicId));
  }

  try {
    return await getPrisma().portfolioItem.update({
      where: { id },
      data: {
        ...payload,
        imagePublicId: payload.imagePublicId || null,
      },
    });
  } catch (error) {
    console.error("[portfolio-store] falling back to Cloudinary update", error);
    if (!payload.imagePublicId) throw error;
    await addCloudinaryContext(payload.imagePublicId, payload);
    return getCloudinaryItem(encodeCloudinaryId(payload.imagePublicId));
  }
}

export async function deletePortfolioItem(id: string) {
  const cloudinaryPublicId = decodeCloudinaryId(id);

  if (cloudinaryPublicId) {
    await deleteCloudinaryImage(cloudinaryPublicId);
    return;
  }

  if (shouldPreferCloudinary()) return;

  try {
    const item = await getPrisma().portfolioItem.delete({ where: { id } });
    await deleteCloudinaryImage(item.imagePublicId);
  } catch (error) {
    console.error("[portfolio-store] failed to delete portfolio item", error);
    throw error;
  }
}

export async function setFeaturedStatus(id: string, isFeatured: boolean) {
  const item = await getPortfolioItem(id);
  if (!item) throw new Error("Portfolio item not found.");

  await updatePortfolioItem(id, {
    categoryId: item.categoryId,
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId,
    isFeatured,
    isPublished: item.isPublished,
    displayOrder: item.displayOrder,
  });
}

export async function setPublishedStatus(id: string, isPublished: boolean) {
  const item = await getPortfolioItem(id);
  if (!item) throw new Error("Portfolio item not found.");

  await updatePortfolioItem(id, {
    categoryId: item.categoryId,
    imageUrl: item.imageUrl,
    imagePublicId: item.imagePublicId,
    isFeatured: item.isFeatured,
    isPublished,
    displayOrder: item.displayOrder,
  });
}
