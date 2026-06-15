import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-red-600 text-white shadow-[0_0_28px_rgba(255,23,68,0.28)] hover:bg-red-500 hover:shadow-[0_0_38px_rgba(255,23,68,0.34)]",
  secondary: "border border-white/15 bg-white/8 text-white hover:border-red-300/70 hover:bg-white/12",
  ghost: "text-white/80 hover:bg-white/10 hover:text-white",
  danger: "bg-rose-500/14 text-rose-100 hover:bg-rose-500/24",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-black transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({ className, variant = "primary", href, children, ...props }: LinkButtonProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-black transition duration-200 active:scale-[0.98]",
    variants[variant],
    className,
  );

  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("https://wa.me")) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
