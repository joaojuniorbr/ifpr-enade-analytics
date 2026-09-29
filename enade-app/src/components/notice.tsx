const tones = {
  blue: "border-[#d7e3d4] bg-[#f3f7f1] text-[#245c38]",
  amber: "border-[#f0ddd4] bg-[#f8ece8] text-slate-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  red: "border-[#f0d4d4] bg-[#f8ecec] text-slate-700",
  gray: "border-slate-200 bg-slate-100 text-slate-700",
} as const;

export function Notice({
  text,
  tone = "blue",
}: {
  text: string;
  tone?: keyof typeof tones;
}) {
  return <p className={`rounded-xl border px-4 py-3 text-sm leading-5 ${tones[tone]}`}>{text}</p>;
}
