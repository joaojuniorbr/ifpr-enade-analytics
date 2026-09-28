"use client";

import { useState } from "react";
import { primaryButton } from "@/lib/styles";

export type ExamOption = { letter: string; text: string };

export type ExamQuestionView = {
  id: number;
  axis: string;
  statement: string;
  options: ExamOption[];
};

export function ExamForm({
  questions,
  attemptKey,
  action,
}: {
  questions: ExamQuestionView[];
  attemptKey: number;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const answered = questions.filter((question) => answers[question.id]).length;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="attemptKey" value={attemptKey} />
      <div className="rounded-md bg-white p-5 shadow-[0_10px_30px_rgba(90,70,180,0.06)]">
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="font-medium text-slate-800">
            {answered} de {questions.length} respondidas
          </p>
          <p className="text-slate-500">A ordem foi sorteada nesta tentativa</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#efeaff]">
          <div
            className="h-full rounded-full bg-[#6d4aff] transition-all"
            style={{ width: `${questions.length === 0 ? 0 : (answered / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {questions.map((question, index) => (
        <fieldset
          key={question.id}
          className="rounded-md bg-white p-5 shadow-[0_10px_30px_rgba(90,70,180,0.06)]"
        >
          <legend className="text-sm font-medium text-[#6d4aff]">
            Pergunta {index + 1} · {question.axis}
          </legend>
          <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-slate-900">{question.statement}</p>
          <div className="mt-4 space-y-2">
            {question.options.map((option) => {
              const selected = answers[question.id] === option.letter;
              return (
                <label
                  key={option.letter}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 text-sm ${
                    selected ? "border-[#6d4aff] bg-[#f6f3ff]" : "border-[#e4dcff] bg-white hover:bg-[#fbfaff]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={option.letter}
                    required
                    checked={selected}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.letter }))}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-semibold text-slate-900">{option.letter}.</span> {option.text}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <button type="submit" className={primaryButton} disabled={answered !== questions.length}>
        Enviar simulado
      </button>
    </form>
  );
}
