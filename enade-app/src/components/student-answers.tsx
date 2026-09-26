"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeleteButton } from "@/components/delete-button";
import { formatRate } from "@/lib/format";

export type StudentAnswerView = {
  id: string;
  code: string;
  classGroup: string;
  hits: number;
  total: number;
  exams: {
    id: string;
    name: string;
    hits: number;
    total: number;
    rows: {
      id: string;
      href: string;
      question: string;
      axis: string;
      answer: string;
      correct: boolean;
      seconds: string;
    }[];
  }[];
};

export function StudentAnswers({
  students,
  deleteAction,
}: {
  students: StudentAnswerView[];
  deleteAction: (formData: FormData) => void | Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = students.find((student) => student.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  if (students.length === 0) {
    return <p className="text-sm text-slate-600">Nenhuma resposta gravada.</p>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {students.map((student) => (
          <button
            key={student.id}
            type="button"
            onClick={() => setSelectedId(student.id)}
            className="rounded-[24px] bg-white p-5 text-left shadow-[0_10px_30px_rgba(90,70,180,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(90,70,180,0.12)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#6d4aff]">Aluno anônimo</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{student.code}</h2>
                <p className="text-sm text-slate-500">{student.classGroup}</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{formatRate(student.hits, student.total)}</p>
            </div>
            <RateBar hits={student.hits} total={student.total} />
            <p className="mt-3 text-sm text-slate-600">
              {student.hits}/{student.total} acertos · {student.exams.length}{" "}
              {student.exams.length === 1 ? "simulado" : "simulados"}
            </p>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Fechar detalhe"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setSelectedId(null)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-drawer-title"
            className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-[#f7f4ff] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#e4dcff] bg-white px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#6d4aff]">Detalhe do aluno</p>
                <h2 id="student-drawer-title" className="mt-1 text-xl font-semibold text-slate-900">
                  {selected.code}
                </h2>
                <p className="text-sm text-slate-500">{selected.classGroup}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#f6f3ff]"
              >
                Fechar
              </button>
            </header>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <section className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(90,70,180,0.06)]">
                <div className="flex items-end justify-between gap-3">
                  <p className="text-sm text-slate-500">Visão geral</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formatRate(selected.hits, selected.total)}
                  </p>
                </div>
                <RateBar hits={selected.hits} total={selected.total} />
                <p className="mt-3 text-sm text-slate-600">
                  {selected.hits}/{selected.total} acertos neste aluno
                </p>
              </section>
              {selected.exams.map((exam) => (
                <section key={exam.id} className="rounded-[24px] bg-white p-5 shadow-[0_10px_30px_rgba(90,70,180,0.06)]">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">{exam.name}</h3>
                    <p className="text-sm text-slate-600">
                      {exam.hits}/{exam.total} · {formatRate(exam.hits, exam.total)}
                    </p>
                  </div>
                  <RateBar hits={exam.hits} total={exam.total} />
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs text-slate-500">
                        <tr>
                          <th className="py-2 pr-3 font-medium">Questão</th>
                          <th className="py-2 pr-3 font-medium">Eixo</th>
                          <th className="py-2 pr-3 font-medium">Resposta</th>
                          <th className="py-2 pr-3 font-medium">Acertou</th>
                          <th className="py-2 pr-3 font-medium">Segundos</th>
                          <th className="py-2 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exam.rows.map((row) => (
                          <tr key={row.id} className="border-t border-slate-200">
                            <td className="py-3 pr-3 font-medium">{row.question}</td>
                            <td className="py-3 pr-3">{row.axis}</td>
                            <td className="py-3 pr-3">{row.answer}</td>
                            <td className="py-3 pr-3">{row.correct ? "Sim" : "Não"}</td>
                            <td className="py-3 pr-3">{row.seconds}</td>
                            <td className="py-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <Link href={row.href} className="font-medium text-[#6d4aff] hover:underline">
                                  Editar
                                </Link>
                                <DeleteButton
                                  id={row.id}
                                  action={deleteAction}
                                  label="Excluir"
                                  message="Excluir esta resposta?"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function RateBar({ hits, total }: { hits: number; total: number }) {
  const width = total <= 0 ? 0 : Math.round((hits / total) * 1000) / 10;
  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#efeaff]">
      <div className="h-full rounded-full bg-[#6d4aff]" style={{ width: `${width}%` }} />
    </div>
  );
}
