import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPostsList() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" }, include: { comments: true } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Posts del blog</h1>
        <Link href="/admin/posts/new" className="bg-accent text-bg text-sm font-medium rounded-lg px-4 py-2">
          + Nuevo post
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/admin/posts/${p.id}`} className="bg-surface border border-white/8 rounded-sig p-4 flex items-center justify-between hover:border-accent/40">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-muted text-sm font-mono">{p.comments.length} comentarios</p>
            </div>
            <span className={`font-mono text-xs ${p.published ? "text-mint" : "text-muted"}`}>
              {p.published ? "publicado" : "borrador"}
            </span>
          </Link>
        ))}
        {posts.length === 0 && <p className="text-muted">No hay posts todavía.</p>}
      </div>
    </div>
  );
}
