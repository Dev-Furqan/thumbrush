import { notFound } from "next/navigation";
import { updatePortfolioItem } from "@/app/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { requireAdmin } from "@/lib/auth";
import { getPortfolioItem } from "@/lib/portfolio-store";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export default async function EditPortfolioPage({ params, searchParams }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const error = Array.isArray(query?.error) ? query.error[0] : query?.error;
  const itemData = await getPortfolioItem(id).then((item) => ({ storageError: false, item })).catch((loadError) => {
    console.error("[admin] failed to load portfolio item", loadError);
    return { storageError: true, item: null };
  });
  const { storageError, item } = itemData;

  if (storageError) {
    return (
      <AdminShell>
        <div>
          <p className="text-sm font-bold uppercase text-red-500">Edit Work</p>
          <h1 className="mt-2 text-3xl font-black text-white">Edit Uploaded Image</h1>
        </div>
        <div className="mt-8 rounded-lg border border-amber-300/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          Admin storage is not available on this deployment. Check the production database connection and run migrations before editing images.
        </div>
      </AdminShell>
    );
  }

  if (!item) notFound();

  const action = updatePortfolioItem.bind(null, item.id);
  const serializedItem = {
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-bold uppercase text-red-500">Edit Work</p>
        <h1 className="mt-2 text-3xl font-black text-white">Edit Uploaded Image</h1>
        <p className="mt-2 text-white/55">Update the category, featured status, publish status, or display order.</p>
      </div>
      <div className="mt-8">
        <PortfolioForm action={action} item={serializedItem} serverError={error} />
      </div>
    </AdminShell>
  );
}
