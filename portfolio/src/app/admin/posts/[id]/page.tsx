import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Editar post</h1>
      <PostForm initial={{ id: post.id, title: post.title, excerpt: post.excerpt, content: post.content, published: post.published }} />
    </div>
  );
}
