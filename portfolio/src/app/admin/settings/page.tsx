import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const admin = session?.user?.email
    ? await prisma.adminUser.findUnique({ where: { email: session.user.email } })
    : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-2">Ajustes</h1>
      <p className="text-muted text-sm mb-6">Cuenta: {session?.user?.email}</p>

      {admin && !admin.passwordChanged && (
        <div className="bg-amber/10 border border-amber/30 text-amber text-sm rounded-lg px-4 py-3 mb-6 font-mono">
          Estás usando la contraseña generada automáticamente al desplegar. Te recomiendo cambiarla ahora.
        </div>
      )}

      <PasswordChangeForm />
    </div>
  );
}
