import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.project.createMany({
    data: [
      {
        title: "Bot de Discord — Recordatorios",
        description: "Bot que gestiona recordatorios y tareas para un servidor de Discord.",
        content: "## Que hace\nGuarda recordatorios por usuario y avisa cuando toca.\n\n## Stack\nPython, discord.py, SQLite.",
        tags: "python,discord,bot",
        featured: true,
        order: 1,
      },
      {
        title: "Clon de Tetris",
        description: "Tetris jugable hecho con HTML5 Canvas y JavaScript puro.",
        content: "## Que hace\nTetris completo con puntuacion y niveles de velocidad.\n\n## Stack\nJavaScript, Canvas API.",
        tags: "javascript,juegos,canvas",
        featured: true,
        order: 2,
      },
    ],
  });

  await prisma.post.create({
    data: {
      title: "Como empece a programar a los 15",
      slug: "como-empece-a-programar",
      excerpt: "Mi primer post: por que decidi aprender a programar y que aprendi en el camino.",
      content: "# Como empece\n\nEste es mi primer post del blog. Aqui voy a escribir sobre lo que aprendo.\n\n## Lo primero que aprendi\n\n- Variables\n- Bucles\n- Que Google es tu mejor amigo",
      published: true,
    },
  });

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
