const tons = {
  azul: "bg-blue-100 text-blue-800",
  ambar: "bg-amber-100 text-amber-900",
  verde: "bg-emerald-100 text-emerald-800",
  vermelho: "bg-rose-100 text-rose-800",
  cinza: "bg-slate-100 text-slate-700",
} as const;

export function Selo({
  children,
  tom = "cinza",
}: {
  children: React.ReactNode;
  tom?: keyof typeof tons;
}) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${tons[tom]}`}>
      {children}
    </span>
  );
}
