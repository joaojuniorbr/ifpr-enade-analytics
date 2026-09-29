import { formatRate } from "@/lib/format";

function widthOf(hits: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((hits / total) * 1000) / 10;
}

function barClass(width: number) {
  return width < 55 ? "bg-[#4d7380]" : "bg-[#5aa36a]";
}

export function RateBar({ label, hits, total }: { label: string; hits: number; total: number }) {
  const width = widthOf(hits, total);
  return (
    <div className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_2.75rem] items-center gap-3">
      <span className="truncate text-sm text-slate-700">{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#e6e8e2]">
        <div className={`h-full rounded-full ${barClass(width)}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-right text-sm tabular-nums text-slate-600">{formatRate(hits, total)}</span>
    </div>
  );
}

export function InlineRate({ hits, total }: { hits: number; total: number }) {
  const width = widthOf(hits, total);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-[#e6e8e2]">
        <div className={`h-full rounded-full ${barClass(width)}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-sm tabular-nums text-slate-600">{formatRate(hits, total)}</span>
    </div>
  );
}
