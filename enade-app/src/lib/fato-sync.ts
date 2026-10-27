import { prisma } from "@/lib/prisma";

type AttemptItem = {
  QuestaoEixoKey: number;
  LetraMarcada: string;
  Acertou: number;
};

export async function syncFatoFromAttempt(
  attemptKey: number,
  tempoKey: number,
  alunoKey: number,
  turmaKey: number,
  items: AttemptItem[],
): Promise<void> {
  if (items.length === 0) return;

  const questionKeys = items.map((item) => item.QuestaoEixoKey);
  const questions = await prisma.dim_Questao_Eixo.findMany({
    where: { QuestaoEixoKey: { in: questionKeys } },
    select: { QuestaoEixoKey: true, DificuldadeKey: true },
  });
  const dificuldadeByQuestion = new Map(
    questions.map((question) => [question.QuestaoEixoKey, question.DificuldadeKey]),
  );

  await prisma.fato_Respostas.deleteMany({
    where: { AlunoKey: alunoKey, TempoKey: tempoKey },
  });

  const latest = await prisma.fato_Respostas.aggregate({ _max: { RespostaKey: true } });
  let nextKey = (latest._max.RespostaKey ?? 0) + 1;

  await prisma.fato_Respostas.createMany({
    data: items.map((item) => ({
      RespostaKey: nextKey++,
      TempoKey: tempoKey,
      QuestaoEixoKey: item.QuestaoEixoKey,
      DificuldadeKey: dificuldadeByQuestion.get(item.QuestaoEixoKey) ?? 2,
      TurmaKey: turmaKey,
      AlunoKey: alunoKey,
      RespostaDada: item.LetraMarcada,
      Acertou: item.Acertou,
      TempoRespostaSegundos: null,
    })),
  });
}
