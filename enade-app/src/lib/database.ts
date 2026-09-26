import { Prisma } from "@prisma/client";

export function databaseMessage(error: unknown, action: "save" | "delete"): string | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;
  if (error.code === "P2002") {
    return action === "save"
      ? "Já existe um registro com esse código ou essa combinação."
      : "Não foi possível excluir o registro.";
  }
  if (error.code === "P2003") {
    return action === "delete"
      ? "Há respostas ligadas a este registro."
      : "Uma das chaves informadas não existe.";
  }
  if (error.code === "P2025") return "Registro não encontrado.";
  return null;
}
