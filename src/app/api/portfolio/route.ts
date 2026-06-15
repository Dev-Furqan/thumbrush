import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeDrafts = searchParams.get("drafts") === "true";

  if (includeDrafts) {
    await requireAdmin();
  }

  const items = await getPrisma().portfolioItem.findMany({
    where: includeDrafts ? undefined : { isPublished: true },
    include: { category: true },
    orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  await requireAdmin();
  const json = await request.json();
  const parsed = portfolioSchema.parse(json);

  const item = await getPrisma().portfolioItem.create({
    data: {
      ...parsed,
      imagePublicId: parsed.imagePublicId || null,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
