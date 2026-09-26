const tones = {
  blue: "bg-blue-100 text-blue-800",
  amber: "bg-amber-100 text-amber-900",
  green: "bg-emerald-100 text-emerald-800",
  red: "bg-rose-100 text-rose-800",
  gray: "bg-slate-100 text-slate-700",
} as const;

export function Badge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
