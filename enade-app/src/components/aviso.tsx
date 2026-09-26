const tons = {
  azul: "border-blue-200 bg-blue-50 text-blue-800",
  ambar: "border-amber-200 bg-amber-50 text-amber-900",
  verde: "border-emerald-200 bg-emerald-50 text-emerald-800",
  vermelho: "border-rose-200 bg-rose-50 text-rose-800",
  cinza: "border-slate-200 bg-slate-100 text-slate-700",
} as const;

export function Aviso({
  texto,
  tom = "azul",
}: {
  texto: string;
  tom?: keyof typeof tons;
}) {
  return <p className={`rounded-lg border px-4 py-3 text-sm ${tons[tom]}`}>{texto}</p>;
}
