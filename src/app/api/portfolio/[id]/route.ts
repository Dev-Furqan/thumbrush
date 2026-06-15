import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deletePortfolioItem, getPortfolioItem, updatePortfolioItem } from "@/lib/portfolio-store";
import { portfolioSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();
  const { id } = await context.params;
  const json = await request.json();
  const parsed = portfolioSchema.partial().parse(json);

  const current = await getPortfolioItem(id);
  const item = await updatePortfolioItem(id, {
    categoryId: parsed.categoryId ?? current?.categoryId ?? "THUMBNAIL",
    imageUrl: parsed.imageUrl ?? current?.imageUrl ?? "",
    imagePublicId: parsed.imagePublicId ?? current?.imagePublicId ?? null,
    isFeatured: parsed.isFeatured ?? current?.isFeatured ?? false,
    isPublished: parsed.isPublished ?? current?.isPublished ?? true,
    displayOrder: parsed.displayOrder ?? current?.displayOrder ?? 0,
  });

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, context: RouteContext) {
  await requireAdmin();
  const { id } = await context.params;
  await deletePortfolioItem(id);
  return NextResponse.json({ ok: true });
}
