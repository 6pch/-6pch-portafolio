import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/ProjectForm";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Editar proyecto</h1>
      <ProjectForm
        initial={{
          id: project.id,
          title: project.title,
          description: project.description,
          content: project.content,
          imageUrl: project.imageUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          demoUrl: project.demoUrl ?? "",
          tags: project.tags,
          featured: project.featured,
        }}
      />
    </div>
  );
}
