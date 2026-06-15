import { createPortfolioItem } from "@/app/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ error?: string | string[] }>;
};

export default async function NewPortfolioPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const error = Array.isArray(params?.error) ? params.error[0] : params?.error;

  return (
    <AdminShell>
      <div>
        <p className="text-sm font-bold uppercase text-red-500">New Work</p>
        <h1 className="mt-2 text-3xl font-black text-white">Upload Portfolio Image</h1>
        <p className="mt-2 text-white/55">Upload one image, choose a category, and decide whether it should appear on the live site.</p>
      </div>
      <div className="mt-8">
        <PortfolioForm action={createPortfolioItem} serverError={error} />
      </div>
    </AdminShell>
  );
}
