import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPortfolioItem, setPublishedStatus } from "@/lib/portfolio-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();
  const { id } = await context.params;
  const { isPublished } = await request.json();
  await setPublishedStatus(id, Boolean(isPublished));
  const item = await getPortfolioItem(id);

  return NextResponse.json({ item });
}
