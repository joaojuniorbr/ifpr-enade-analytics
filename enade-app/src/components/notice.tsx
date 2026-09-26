const tones = {
  blue: "border-[#e4dcff] bg-[#f6f3ff] text-[#5430e0]",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  red: "border-rose-200 bg-rose-50 text-rose-800",
  gray: "border-slate-200 bg-slate-100 text-slate-700",
} as const;

export function Notice({
  text,
  tone = "blue",
}: {
  text: string;
  tone?: keyof typeof tones;
}) {
  return <p className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>{text}</p>;
}
