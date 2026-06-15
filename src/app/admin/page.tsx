import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { categories, getCategoryLabel } from "@/lib/categories";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const prisma = getPrisma();
  const [total, grouped, recent] = await Promise.all([
    prisma.portfolioItem.count(),
    prisma.portfolioItem.groupBy({ by: ["categoryId"], _count: true }),
    prisma.portfolioItem.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const counts = Object.fromEntries(grouped.map((group) => [group.categoryId, group._count]));

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-red-500">Dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-white">Image Portfolio Overview</h1>
        </div>
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-black text-slate-950 transition hover:bg-red-500" href="/admin/portfolio/new">
          <Plus size={18} /> Upload Image
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="Total uploaded images" value={total} />
        {categories.map((category) => (
          <Metric label={`Total ${category.label.toLowerCase()}`} value={counts[category.id] ?? 0} key={category.id} />
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-white/10 bg-white/6 p-5">
        <h2 className="text-xl font-black text-white">Recent uploads</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {recent.map((item) => (
            <Link className="group overflow-hidden rounded-lg border border-white/8 bg-white/5 transition hover:border-red-500/40 hover:bg-white/8" href={`/admin/portfolio/${item.id}/edit`} key={item.id}>
              <div className="relative aspect-video bg-slate-900">
                <Image src={item.imageUrl} alt={`${getCategoryLabel(item.categoryId)} upload`} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="220px" />
              </div>
              <div className="p-3">
                <p className="font-bold text-white">{getCategoryLabel(item.categoryId)}</p>
                <p className="mt-1 text-xs text-white/48">{formatDate(item.createdAt)}</p>
                <span className={`mt-3 inline-flex rounded-lg px-2 py-1 text-xs font-bold ${item.isPublished ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-white/50"}`}>
                  {item.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </Link>
          ))}
          {!recent.length ? <p className="rounded-lg border border-white/8 p-5 text-white/50">No images uploaded yet.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/6 p-5">
      <p className="text-sm text-white/48">{label}</p>
      <p className="mt-3 font-mono text-4xl font-black text-white">{value}</p>
    </div>
  );
}
