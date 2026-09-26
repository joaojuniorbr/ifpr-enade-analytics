import { z } from "zod";
import { AXES, LEVELS } from "@/lib/axes";

const axes = AXES as unknown as [string, ...string[]];
const levels = LEVELS as unknown as [string, ...string[]];

export function zodMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Revise os campos.";
}

export const questionSchema = z.object({
  code: z.string().trim().min(1, "Informe o código.").max(32, "O código pode ter no máximo 32 caracteres."),
  axis: z.enum(axes, "Escolha um eixo da Portaria 171/2026."),
  level: z.enum(levels, "A dificuldade é Fácil, Médio ou Difícil."),
});

export const examSchema = z.object({
  code: z.string().trim().min(1, "Informe o código.").max(64, "O código pode ter no máximo 64 caracteres."),
  applicationNumber: z.coerce.number().int("A aplicação é um número inteiro.").positive("A aplicação começa em 1."),
  description: z
    .string()
    .trim()
    .min(1, "Informe a descrição.")
    .max(255, "A descrição pode ter no máximo 255 caracteres."),
});

export const studentSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Informe o código anônimo.")
    .max(32, "O código pode ter no máximo 32 caracteres.")
    .refine((value) => !value.includes("@"), "Use só o código anônimo, sem e-mail."),
  classGroup: z.string().trim().min(1, "Informe a turma.").max(64, "A turma pode ter no máximo 64 caracteres."),
});

export const timeSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data."),
  year: z.coerce.number().int(),
  month: z.coerce.number().int().min(1, "O mês vai de 1 a 12.").max(12, "O mês vai de 1 a 12."),
  monthName: z.string().trim().min(1, "Informe o nome do mês.").max(20, "O nome do mês pode ter no máximo 20 caracteres."),
  semesterWeek: z.coerce.number().int().positive("A semana do semestre é um inteiro positivo."),
});

export const answerSchema = z.object({
  timeKey: z.coerce.number().int().positive(),
  studentKey: z.coerce.number().int().positive(),
  questionKey: z.coerce.number().int().positive(),
  examKey: z.coerce.number().int().positive(),
  answer: z.string().trim().min(1, "Informe a resposta.").max(8, "A resposta pode ter no máximo 8 caracteres."),
  wasCorrect: z.enum(["0", "1"], "Marque se acertou."),
  seconds: z
    .string()
    .trim()
    .refine((value) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0), "O tempo não pode ser negativo."),
});
