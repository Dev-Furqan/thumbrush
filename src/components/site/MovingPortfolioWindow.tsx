import Image from "next/image";
import type { PortfolioItemView } from "@/components/site/Portfolio";

type MovingPortfolioWindowProps = {
  items: PortfolioItemView[];
};

function MovingRow({ items, reverse = false }: { items: PortfolioItemView[]; reverse?: boolean }) {
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="marquee-row">
      <div className={reverse ? "marquee-track marquee-track-reverse" : "marquee-track"}>
        {loopItems.map((item, index) => (
          <div className="thumbnail-window-card" key={`${item.id}-${index}`}>
            <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="(min-width: 1024px) 360px, (min-width: 640px) 280px, 220px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MovingPortfolioWindow({ items }: MovingPortfolioWindowProps) {
  if (!items.length) return null;

  const firstRow = items.filter((_, index) => index % 2 === 0);
  const secondRow = items.filter((_, index) => index % 2 === 1);

  return (
    <section className="moving-showcase" aria-labelledby="moving-portfolio-title">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-red-400">Work That Feels Clickable</p>
          <h2 id="moving-portfolio-title" className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">
            A live window of thumbnails, posters, and brand visuals.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            This moving showcase highlights the kind of bold, high-contrast creative we build for creators and businesses. New published portfolio uploads can flow into the site automatically, keeping the work fresh without changing code.
          </p>
        </div>
      </div>

      <div className="thumbnail-window">
        <MovingRow items={firstRow.length ? firstRow : items} />
        <MovingRow items={secondRow.length ? secondRow : items} reverse />
      </div>
    </section>
  );
}
