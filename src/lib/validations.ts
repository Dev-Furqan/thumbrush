import { z } from "zod";
import { categories } from "@/lib/categories";

const categoryIds = categories.map((category) => category.id) as [string, ...string[]];

export const portfolioSchema = z.object({
  categoryId: z.enum(categoryIds),
  imageUrl: z.string().trim().min(1, "Upload an image first."),
  imagePublicId: z.string().trim().optional().nullable(),
  isFeatured: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
export type PortfolioFormInput = z.input<typeof portfolioSchema>;

export const uploadSchema = z.object({
  type: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
  size: z.number().max(5 * 1024 * 1024, "Image must be 5MB or smaller."),
});
