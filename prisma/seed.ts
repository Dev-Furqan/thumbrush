import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  ["THUMBNAIL", "Thumbnails"],
  ["POSTER", "Posters"],
  ["SOCIAL_POST", "Social Posts"],
  ["LOGO", "Logos"],
  ["BRANDING", "Branding"],
] as const;

const items = [
  {
    id: "sample-thumbnail-1",
    categoryId: "THUMBNAIL",
    imageUrl: "/sample-work/thumbnail-launch.svg",
    isFeatured: true,
    displayOrder: 1,
  },
  {
    id: "sample-thumbnail-2",
    categoryId: "THUMBNAIL",
    imageUrl: "/sample-work/thumbnail-launch.svg",
    isFeatured: true,
    displayOrder: 2,
  },
  {
    id: "sample-thumbnail-3",
    categoryId: "THUMBNAIL",
    imageUrl: "/sample-work/social-drop.svg",
    isFeatured: true,
    displayOrder: 3,
  },
  {
    id: "sample-poster-1",
    categoryId: "POSTER",
    imageUrl: "/sample-work/poster-neon.svg",
    isFeatured: false,
    displayOrder: 4,
  },
  {
    id: "sample-social-1",
    categoryId: "SOCIAL_POST",
    imageUrl: "/sample-work/social-drop.svg",
    isFeatured: false,
    displayOrder: 5,
  },
  {
    id: "sample-logo-1",
    categoryId: "LOGO",
    imageUrl: "/sample-work/logo-orbit.svg",
    isFeatured: false,
    displayOrder: 6,
  },
  {
    id: "sample-branding-1",
    categoryId: "BRANDING",
    imageUrl: "/sample-work/branding-kit.svg",
    isFeatured: false,
    displayOrder: 7,
  },
];

async function main() {
  for (const [id, label] of categories) {
    await prisma.category.upsert({
      where: { id },
      update: { label },
      create: { id, label },
    });
  }

  for (const item of items) {
    await prisma.portfolioItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
