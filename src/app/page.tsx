import { Contact } from "@/components/site/Contact";
import { FAQs } from "@/components/site/FAQs";
import { FeaturedThumbnails } from "@/components/site/FeaturedThumbnails";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { MovingPortfolioWindow } from "@/components/site/MovingPortfolioWindow";
import { Portfolio, type PortfolioItemView } from "@/components/site/Portfolio";
import { Process } from "@/components/site/Process";
import { Services } from "@/components/site/Services";
import { Stats } from "@/components/site/Stats";
import { Testimonials } from "@/components/site/Testimonials";
import { WhyChoose } from "@/components/site/WhyChoose";
import { getCategoryLabel } from "@/lib/categories";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPortfolioItems(): Promise<PortfolioItemView[]> {
  try {
    const items = await getPrisma().portfolioItem.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return items.map((item) => ({
      id: item.id,
      categoryId: item.categoryId,
      categoryLabel: item.category?.label ?? getCategoryLabel(item.categoryId),
      imageUrl: item.imageUrl,
      isFeatured: item.isFeatured,
      createdAt: item.createdAt.toISOString(),
      displayOrder: item.displayOrder,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const items = await getPortfolioItems();
  const featuredThumbnails = items.filter((item) => item.categoryId === "THUMBNAIL" && item.isFeatured);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <MovingPortfolioWindow items={items} />
        <Stats />
        <Process />
        <FeaturedThumbnails items={featuredThumbnails} />
        <Portfolio items={items} />
        <Services />
        <WhyChoose />
        <Testimonials />
        <FAQs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
