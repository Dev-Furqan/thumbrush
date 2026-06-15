import { BarChart3, Images, LogOut, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions";

const nav = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/portfolio", label: "Portfolio", icon: Images },
  { href: "/admin/portfolio/new", label: "Add Work", icon: Plus },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-white/10 bg-slate-950/80 p-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <Link href="/" className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
        <Sparkles className="text-red-500" size={22} />
        <div>
          <p className="font-black text-white">Thumbrush</p>
          <p className="text-xs text-white/50">Admin Studio</p>
        </div>
      </Link>
      <nav className="mt-6 grid gap-2">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-white/68 transition hover:bg-white/8 hover:text-white" href={href} key={href}>
            <Icon size={18} /> {label}
          </Link>
        ))}
      </nav>
      <form action={logoutAction} className="mt-6">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/10" type="submit">
          <LogOut size={18} /> Logout
        </button>
      </form>
    </aside>
  );
}
