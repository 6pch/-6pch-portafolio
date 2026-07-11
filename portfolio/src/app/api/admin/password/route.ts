import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/verifyOrigin";
import { passwordChangeSchema, firstZodError } from "@/lib/validation";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!isSameOriginRequest(req)) return NextResponse.json({ error: "Origen no válido" }, { status: 403 });

  const parsed = passwordChangeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
  }
  const { currentPassword, newPassword } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email: session.user.email } });
  if (!admin) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 400 });

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: newHash, passwordChanged: true },
  });

  return NextResponse.json({ ok: true });
}
