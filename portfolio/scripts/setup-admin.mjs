// Este script se ejecuta automaticamente en cada "npm run build"
// (por ejemplo, en cada despliegue en Vercel). Es idempotente:
// si ya existe un usuario admin en la base de datos, no hace nada.
// Si no existe ninguno, genera uno con contraseña aleatoria segura
// y la muestra UNA SOLA VEZ en el log de despliegue.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// Genera una contraseña aleatoria legible (evita caracteres ambiguos como 0/O, 1/l).
function generatePassword(length = 20) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#%*";
  const bytes = randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += alphabet[bytes[i] % alphabet.length];
  }
  return password;
}

async function main() {
  const existingAdmin = await prisma.adminUser.findFirst();

  if (existingAdmin) {
    console.log("[setup-admin] Ya existe un usuario admin, no se crea otro.");
    return;
  }

  const email = process.env.ADMIN_EMAIL?.trim() || "admin@portfolio.local";
  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.create({
    data: { email, passwordHash },
  });

  // Estas lineas aparecen en el log de build de Vercel (o en tu terminal en local).
  // Cópialas ahora: no se van a volver a mostrar.
  console.log("");
  console.log("========================================================");
  console.log(" CREDENCIALES DE ADMINISTRADOR GENERADAS AUTOMATICAMENTE ");
  console.log("========================================================");
  console.log(` Email:      ${email}`);
  console.log(` Contraseña: ${password}`);
  console.log("--------------------------------------------------------");
  console.log(" Guarda esto en un lugar seguro (un gestor de contraseñas).");
  console.log(" Entra en /admin/login y cambia la contraseña desde");
  console.log(" /admin/settings en cuanto puedas.");
  console.log("========================================================");
  console.log("");
}

main()
  .catch((err) => {
    console.error("[setup-admin] Error creando el usuario admin:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
