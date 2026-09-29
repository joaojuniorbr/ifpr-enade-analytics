type NumericValue = { toNumber: () => number };

export function numericScore(score: NumericValue | number | null | undefined): number | null {
  if (score == null) return null;
  return typeof score === "number" ? score : score.toNumber();
}

export function formatScore(score: NumericValue | number | null | undefined): string {
  const value = numericScore(score);
  if (value == null) return "—";
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("pt-BR");
}

export function formatRate(part: number, total: number): string {
  if (total <= 0) return "—";
  return `${((part / total) * 100).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}

export function summarize(text: string, limit = 140): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit).trimEnd()}…`;
}
