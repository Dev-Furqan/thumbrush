import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPortfolioItem, setFeaturedStatus } from "@/lib/portfolio-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();
  const { id } = await context.params;
  const { isFeatured } = await request.json();
  await setFeaturedStatus(id, Boolean(isFeatured));
  const item = await getPortfolioItem(id);

  return NextResponse.json({ item });
}
