const TIME_ZONE = "America/Sao_Paulo";

export function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function dateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function utcDate(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

export function formatDate(date: Date): string {
  const [year, month, day] = dateKey(date).split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export type ExamStatus = "open" | "upcoming" | "closed";

export function examStatus(date: Date): ExamStatus {
  const key = dateKey(date);
  const today = todayKey();
  if (key === today) return "open";
  if (key > today) return "upcoming";
  return "closed";
}

export function statusLabel(status: ExamStatus): string {
  if (status === "open") return "Liberada hoje";
  if (status === "upcoming") return "Ainda não liberada";
  return "Encerrada";
}
