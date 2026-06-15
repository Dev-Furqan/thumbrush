import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();
  const { id } = await context.params;
  const { isPublished } = await request.json();
  const item = await getPrisma().portfolioItem.update({
    where: { id },
    data: { isPublished: Boolean(isPublished) },
  });

  return NextResponse.json({ item });
}
