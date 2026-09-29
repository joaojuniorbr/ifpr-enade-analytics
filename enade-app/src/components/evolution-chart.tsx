"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function EvolutionChart({ points }: { points: { name: string; rate: number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e6e8e2" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            unit="%"
            tick={{ fill: "#64748b", fontSize: 12 }}
            width={48}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value) => [`${value}%`, "Acerto"]} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#3f8f55"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#3f8f55", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
