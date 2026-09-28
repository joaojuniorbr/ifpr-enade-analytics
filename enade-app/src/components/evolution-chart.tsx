"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cardClass } from "@/lib/styles";

export function EvolutionChart({
  title,
  points,
}: {
  title: string;
  points: { name: string; rate: number }[];
}) {
  return (
    <article className={cardClass}>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#efeaff" />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#64748b", fontSize: 12 }} width={48} />
            <Tooltip formatter={(value) => [`${value}%`, "Acerto"]} />
            <Line type="monotone" dataKey="rate" stroke="#6d4aff" strokeWidth={2.5} dot={{ r: 4, fill: "#6d4aff" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
