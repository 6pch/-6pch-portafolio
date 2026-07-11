import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProjectsList() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Proyectos</h1>
        <Link href="/admin/projects/new" className="bg-accent text-bg text-sm font-medium rounded-lg px-4 py-2">
          + Nuevo proyecto
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/admin/projects/${p.id}`}
            className="bg-surface border border-white/8 rounded-sig p-4 flex items-center justify-between hover:border-accent/40"
          >
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-muted text-sm">{p.description}</p>
            </div>
            {p.featured && <span className="font-mono text-xs text-amber">destacado</span>}
          </Link>
        ))}
        {projects.length === 0 && <p className="text-muted">No hay proyectos todavía.</p>}
      </div>
    </div>
  );
}
