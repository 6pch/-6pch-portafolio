"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface border border-white/8 rounded-sig p-7 flex flex-col gap-4">
        <h1 className="font-display text-xl font-semibold">Panel de administración</h1>
        <p className="text-muted text-sm">Acceso privado. Solo tú puedes entrar aquí.</p>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface2 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface2 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent"
          />
        </label>

        {error && <p className="text-rose text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-accent text-bg font-medium rounded-lg py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
