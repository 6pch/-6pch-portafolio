import { prisma } from "@/lib/prisma";
import { VisitsChart } from "@/components/VisitsChart";

export default async function AnalyticsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  const visits = await prisma.visit.findMany({ where: { createdAt: { gte: since } } });

  const dayCounts = new Map<string, number>();
  for (const v of visits) {
    const key = v.createdAt.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
  }

  const data: { date: string; visitas: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = day.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
    data.push({ date: key, visitas: dayCounts.get(key) ?? 0 });
  }

  const topPaths = await prisma.visit.groupBy({
    by: ["path"],
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: 5,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Analíticas</h1>
      <div className="bg-surface border border-white/8 rounded-sig p-5 mb-8">
        <p className="font-mono text-xs text-muted mb-3">visitas — últimos 30 días</p>
        <VisitsChart data={data} />
      </div>

      <div className="bg-surface border border-white/8 rounded-sig p-5">
        <p className="font-mono text-xs text-muted mb-3">páginas más visitadas</p>
        <div className="flex flex-col gap-2">
          {topPaths.map((t) => (
            <div key={t.path} className="flex items-center justify-between font-mono text-sm">
              <span>{t.path}</span>
              <span className="text-accent">{t._count.path}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
