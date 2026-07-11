import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      {session && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/8">
          <nav className="flex gap-5 font-mono text-sm">
            <Link href="/admin" className="text-accent">dashboard</Link>
            <Link href="/admin/projects" className="text-muted hover:text-ink">proyectos</Link>
            <Link href="/admin/posts" className="text-muted hover:text-ink">posts</Link>
            <Link href="/admin/analytics" className="text-muted hover:text-ink">analíticas</Link>
            <Link href="/admin/settings" className="text-muted hover:text-ink">ajustes</Link>
          </nav>
          <SignOutButton />
        </div>
      )}
      {children}
    </div>
  );
}
