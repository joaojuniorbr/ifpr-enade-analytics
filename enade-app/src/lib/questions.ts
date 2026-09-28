export type QuestionWithAnswers = {
  Enunciado: string | null;
  Alternativas: { Correta: number }[];
};

export function isReadyQuestion(question: QuestionWithAnswers): boolean {
  const statement = question.Enunciado?.trim() ?? "";
  const correct = question.Alternativas.filter((item) => item.Correta === 1).length;
  return statement.length > 0 && question.Alternativas.length >= 2 && correct === 1;
}

export function correctLetter(alternatives: { Letra: string; Correta: number }[]): string | null {
  return alternatives.find((item) => item.Correta === 1)?.Letra ?? null;
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swap];
    copy[swap] = current;
  }
  return copy;
}
