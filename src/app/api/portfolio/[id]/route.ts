import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { getPrisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  await requireAdmin();
  const { id } = await context.params;
  const json = await request.json();
  const parsed = portfolioSchema.partial().parse(json);

  const item = await getPrisma().portfolioItem.update({
    where: { id },
    data: {
      ...parsed,
      imagePublicId: parsed.imagePublicId || undefined,
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, context: RouteContext) {
  await requireAdmin();
  const { id } = await context.params;
  const item = await getPrisma().portfolioItem.delete({ where: { id } });

  await deleteCloudinaryImage(item.imagePublicId);
  return NextResponse.json({ ok: true });
}
