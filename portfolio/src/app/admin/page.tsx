import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [projectCount, postCount, commentCount, visitCount] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.visit.count(),
  ]);

  const cards = [
    { label: "Proyectos", value: projectCount, href: "/admin/projects" },
    { label: "Posts del blog", value: postCount, href: "/admin/posts" },
    { label: "Comentarios recibidos", value: commentCount, href: "/admin/posts" },
    { label: "Visitas totales", value: visitCount, href: "/admin/analytics" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-surface border border-white/8 rounded-sig p-5 hover:border-accent/40 transition-colors"
          >
            <p className="font-mono text-3xl font-semibold text-accent">{c.value}</p>
            <p className="text-muted text-sm mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
