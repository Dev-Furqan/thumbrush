"use client";

import type { PortfolioItem } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deletePortfolioItem, toggleFeatured, togglePublished } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { getCategoryLabel } from "@/lib/categories";
import { formatDate } from "@/lib/utils";

type PortfolioTableProps = {
  items: Array<
    Omit<PortfolioItem, "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    }
  >;
};

export function PortfolioTable({ items }: PortfolioTableProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function runAction(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article className="grid gap-4 rounded-lg border border-white/10 bg-white/6 p-4 md:grid-cols-[180px_1fr_auto] md:items-center" key={item.id}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900 shadow-[0_0_28px_rgba(255,23,68,0.12)]">
            <Image src={item.imageUrl} alt={`${getCategoryLabel(item.categoryId)} upload`} fill className="object-cover" sizes="180px" />
          </div>
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-red-500 px-2 py-1 text-xs font-black text-slate-950">{getCategoryLabel(item.categoryId)}</span>
              <button
                type="button"
                className={`rounded-lg px-3 py-1 text-xs font-bold ${item.isPublished ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-white/55"}`}
                disabled={pending}
                onClick={() => runAction(() => togglePublished(item.id, !item.isPublished))}
              >
                {item.isPublished ? "Published" : "Draft"}
              </button>
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold ${item.isFeatured ? "bg-red-500 text-slate-950" : "bg-white/10 text-white/55"}`}
                disabled={pending}
                onClick={() => runAction(() => toggleFeatured(item.id, !item.isFeatured))}
              >
                <Star size={13} fill={item.isFeatured ? "currentColor" : "none"} /> {item.isFeatured ? "Featured" : "Not featured"}
              </button>
            </div>
            <div className="grid gap-1 text-sm text-white/55 sm:grid-cols-3">
              <span>Order: <strong className="font-mono text-white">{item.displayOrder}</strong></span>
              <span>Uploaded: <strong className="text-white">{formatDate(item.createdAt)}</strong></span>
              <span>{item.imagePublicId ? "Cloudinary image" : "Local image"}</span>
            </div>
          </div>
          <div className="flex gap-2 md:justify-end">
            <Link className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/12 px-3 text-sm font-semibold text-white transition hover:bg-white/10" href={`/admin/portfolio/${item.id}/edit`}>
              <Pencil size={16} /> Edit
            </Link>
            <Button
              variant="danger"
              disabled={pending}
              type="button"
              onClick={() => {
                if (confirm("Delete this uploaded image?")) runAction(() => deletePortfolioItem(item.id));
              }}
            >
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        </article>
      ))}
      {!items.length ? <div className="rounded-lg border border-white/10 bg-white/6 p-10 text-center text-white/55">No uploaded images yet.</div> : null}
    </div>
  );
}
