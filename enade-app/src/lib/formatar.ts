type ComNumero = { toNumber: () => number };

export function notaNumero(nota: ComNumero | number | null | undefined): number | null {
  if (nota == null) return null;
  return typeof nota === "number" ? nota : nota.toNumber();
}

export function formatarNota(nota: ComNumero | number | null | undefined): string {
  const valor = notaNumero(nota);
  if (valor == null) return "—";
  return `${valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatarTaxa(parte: number, total: number): string {
  if (total <= 0) return "—";
  return `${((parte / total) * 100).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

export function resumir(texto: string, limite = 140): string {
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (limpo.length <= limite) return limpo;
  return `${limpo.slice(0, limite).trimEnd()}…`;
}
