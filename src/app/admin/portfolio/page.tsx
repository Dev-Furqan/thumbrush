import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortfolioTable } from "@/components/admin/PortfolioTable";
import { requireAdmin } from "@/lib/auth";
import { listPortfolioItems } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  await requireAdmin();
  const portfolioData = await listPortfolioItems({ includeDrafts: true }).then((items) => ({ storageError: false, items })).catch((error) => {
    console.error("[admin] failed to load portfolio items", error);
    return { storageError: true, items: [] };
  });
  const { storageError, items } = portfolioData;
  const serializedItems = items.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-red-500">Portfolio Management</p>
          <h1 className="mt-2 text-3xl font-black text-white">Uploaded Images</h1>
        </div>
        <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 text-sm font-bold text-slate-950 transition hover:bg-white" href="/admin/portfolio/new">
          <Plus size={18} /> Add New
        </Link>
      </div>
      {storageError ? (
        <div className="mt-6 rounded-lg border border-amber-300/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          Admin storage is not available on this deployment. Check the production database connection and run migrations before managing images.
        </div>
      ) : null}
      <div className="mt-8">
        <PortfolioTable items={serializedItems} />
      </div>
    </AdminShell>
  );
}
