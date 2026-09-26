const FUSO = "America/Sao_Paulo";

export function chaveHoje(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function chaveData(data: Date): string {
  const ano = data.getUTCFullYear();
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  const dia = String(data.getUTCDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function dataUtc(chave: string): Date {
  return new Date(`${chave}T00:00:00.000Z`);
}

export function formatarData(data: Date): string {
  const [ano, mes, dia] = chaveData(data).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(data: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO,
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

export type SituacaoProva = "liberada" | "futura" | "encerrada";

export function situacaoProva(data: Date): SituacaoProva {
  const chave = chaveData(data);
  const hoje = chaveHoje();
  if (chave === hoje) return "liberada";
  if (chave > hoje) return "futura";
  return "encerrada";
}

export function rotuloSituacao(situacao: SituacaoProva): string {
  if (situacao === "liberada") return "Liberada hoje";
  if (situacao === "futura") return "Ainda não liberada";
  return "Encerrada";
}
