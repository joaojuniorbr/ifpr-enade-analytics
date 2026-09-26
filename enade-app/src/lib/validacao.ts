import { z } from "zod";
import { EIXOS } from "@/lib/eixos";

const eixos = ["", ...EIXOS] as [string, ...string[]];

export const perguntaSchema = z
  .object({
    id: z.string().trim(),
    enunciado: z
      .string()
      .trim()
      .min(10, "O enunciado precisa ter pelo menos 10 caracteres.")
      .max(5000, "O enunciado pode ter no máximo 5000 caracteres."),
    eixo: z.enum(eixos, "Escolha um eixo da lista oficial ou deixe em branco."),
    tema: z.string().trim().max(120, "O tema pode ter no máximo 120 caracteres."),
    nivel: z.enum(["", "FACIL", "MEDIO", "DIFICIL"], "Nível inválido."),
    alternativas: z
      .array(
        z.object({
          id: z.string().optional(),
          texto: z
            .string()
            .trim()
            .min(1, "Preencha o texto de cada alternativa ou remova as vazias.")
            .max(2000, "Cada alternativa pode ter no máximo 2000 caracteres."),
        }),
      )
      .min(2, "Inclua pelo menos duas alternativas.")
      .max(8, "Use no máximo 8 alternativas."),
    correta: z.number().int("Marque exatamente uma alternativa correta."),
    ativa: z.boolean(),
  })
  .refine(
    (dados) => dados.correta >= 0 && dados.correta < dados.alternativas.length,
    "Marque exatamente uma alternativa correta.",
  );

export const provaSchema = z.object({
  id: z.string().trim(),
  titulo: z
    .string()
    .trim()
    .min(3, "O título precisa ter pelo menos 3 caracteres.")
    .max(160, "O título pode ter no máximo 160 caracteres."),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data da prova.")
    .refine((valor) => !Number.isNaN(Date.parse(`${valor}T00:00:00.000Z`)), "Data inválida."),
  perguntaIds: z
    .array(z.string().min(1))
    .min(1, "Selecione pelo menos uma pergunta."),
});

export function mensagemZod(erro: z.ZodError): string {
  return erro.issues[0]?.message ?? "Revise os campos do formulário.";
}
