"use client";

import type { PortfolioItem } from "@prisma/client";
import { Save } from "lucide-react";
import type { FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { categories } from "@/lib/categories";
import { portfolioSchema, type PortfolioFormInput, type PortfolioFormValues } from "@/lib/validations";

type PortfolioFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  serverError?: string;
  item?: (Omit<PortfolioItem, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  }) | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full sm:w-auto" disabled={pending} type="submit">
      <Save size={17} /> {pending ? "Saving..." : "Save Image"}
    </Button>
  );
}

export function PortfolioForm({ action, serverError, item }: PortfolioFormProps) {
  const { clearErrors, register, setError, formState } = useForm<PortfolioFormInput, unknown, PortfolioFormValues>({
    defaultValues: {
      categoryId: item?.categoryId ?? "THUMBNAIL",
      imageUrl: item?.imageUrl ?? "",
      imagePublicId: item?.imagePublicId ?? "",
      isFeatured: item?.isFeatured ?? false,
      isPublished: item?.isPublished ?? true,
      displayOrder: item?.displayOrder ?? 0,
    },
  });

  function validateBeforeSubmit(event: FormEvent<HTMLFormElement>) {
    clearErrors();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const result = portfolioSchema.safeParse(values);

    if (result.success) return;

    event.preventDefault();

    for (const issue of result.error.issues) {
      const fieldName = issue.path[0];
      if (typeof fieldName !== "string") continue;
      setError(fieldName as keyof PortfolioFormInput, { message: issue.message });
    }
  }

  return (
    <form action={action} className="grid gap-6" onSubmit={validateBeforeSubmit}>
      {serverError ? <p className="rounded-lg border border-rose-300/20 bg-rose-500/10 p-3 text-sm text-rose-100">{serverError}</p> : null}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-lg border border-white/10 bg-white/6 p-5">
          <div className="grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-semibold text-white/70">Category</span>
              <select className="min-h-11 w-full rounded-lg border border-white/12 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500/70" {...register("categoryId")}>
                {categories.map((category) => (
                  <option value={category.id} key={category.id}>{category.label}</option>
                ))}
              </select>
              {formState.errors.categoryId ? <span className="mt-1 block text-sm text-rose-200">{formState.errors.categoryId.message}</span> : null}
            </label>
            <label>
              <span className="mb-2 block text-sm font-semibold text-white/70">Display Order</span>
              <Input type="number" min={0} {...register("displayOrder")} />
              <span className="mt-1 block text-xs text-white/45">Lower numbers appear first. Leave as 0 when order does not matter.</span>
            </label>
            <div className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
              <label className="flex items-center justify-between gap-3 text-sm font-semibold text-white/84">
                <span>Featured thumbnail</span>
                <input className="size-5 accent-red-500" type="checkbox" {...register("isFeatured")} defaultChecked={item?.isFeatured ?? false} />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm font-semibold text-white/84">
                <span>Published</span>
                <input className="size-5 accent-red-500" type="checkbox" {...register("isPublished")} defaultChecked={item?.isPublished ?? true} />
              </label>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/6 p-5">
          <ImageUploader imageUrl={item?.imageUrl} imagePublicId={item?.imagePublicId} />
          {formState.errors.imageUrl ? <span className="mt-3 block text-sm text-rose-200">{formState.errors.imageUrl.message}</span> : null}
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
