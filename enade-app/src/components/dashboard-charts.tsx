"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cardClass } from "@/lib/styles";

type Point = { name: string; rate: number };

export function DashboardCharts({
  axes,
  classes,
  exams,
}: {
  axes: Point[];
  classes: Point[];
  exams: Point[];
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard title="Taxa por eixo" points={axes} height={520} />
      <div className="grid gap-4">
        <ChartCard title="Taxa por turma" points={classes} height={280} />
        <ChartCard title="Taxa por simulado" points={exams} height={220} />
      </div>
    </div>
  );
}

function ChartCard({ title, points, height }: { title: string; points: Point[]; height: number }) {
  return (
    <article className={cardClass}>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {points.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">Nenhuma resposta gravada.</p>
      ) : (
        <div className="mt-4" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke="#efeaff" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={148}
                tick={{ fill: "#334155", fontSize: 11 }}
              />
              <Tooltip formatter={(value) => [`${value}%`, "Taxa"]} />
              <Bar dataKey="rate" fill="#6d4aff" radius={[0, 8, 8, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}
