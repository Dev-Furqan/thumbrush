import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-lg border border-white/12 bg-white/8 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-red-500/70 focus:bg-white/10",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-lg border border-white/12 bg-white/8 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-red-500/70 focus:bg-white/10",
        className,
      )}
      {...props}
    />
  );
}
