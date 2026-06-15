import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="mesh-bg grid min-h-screen place-items-center p-4">
      <div className="glass w-full max-w-md rounded-lg p-6">
        <Link className="text-2xl font-black text-white" href="/">
          Thum<span className="text-red-500">brush</span>
        </Link>
        <h1 className="mt-8 text-3xl font-black text-white">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-white/58">Sign in to upload, publish, and manage portfolio work.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
