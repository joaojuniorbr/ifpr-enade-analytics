import Link from "next/link";
import { deleteAnswer, saveAnswer } from "@/app/admin/respostas/actions";
import { Messages } from "@/components/admin-table";
import { StudentAnswers, type StudentAnswerView } from "@/components/student-answers";
import { primaryButton, secondaryButton, fieldClass, cardClass } from "@/lib/styles";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Respostas" };

export default async function AnswersPage({
  searchParams,
}: {
  searchParams: Promise<{
    notice?: string;
    error?: string;
    studentKey?: string;
    examKey?: string;
    questionKey?: string;
    timeKey?: string;
  }>;
}) {
  const params = await searchParams;
  const studentKey = optionalKey(params.studentKey);
  const examKey = optionalKey(params.examKey);
  const questionKey = optionalKey(params.questionKey);
  const timeKey = optionalKey(params.timeKey);
  const [answers, timeRecords, students, questions, exams] = await Promise.all([
    prisma.fato_Respostas.findMany({
      orderBy: { RespostaKey: "asc" },
      include: {
        Dim_Aluno_Anonimo: { select: { CodigoAlunoAnonimo: true, TurmaGrupo: true } },
        Dim_Questao: { select: { CodigoQuestao: true, EixoTematico: true } },
        Dim_Simulado: { select: { CodigoSimulado: true, NumeroAplicacao: true } },
      },
    }),
    prisma.dim_Tempo.findMany({ orderBy: { TempoKey: "asc" } }),
    prisma.dim_Aluno_Anonimo.findMany({ orderBy: { AlunoKey: "asc" } }),
    prisma.dim_Questao.findMany({ orderBy: { QuestaoKey: "asc" } }),
    prisma.dim_Simulado.findMany({ orderBy: { NumeroAplicacao: "asc" } }),
  ]);
  const filtered = answers.filter(
    (answer) =>
      (studentKey == null || answer.AlunoKey === studentKey) &&
      (examKey == null || answer.SimuladoKey === examKey) &&
      (questionKey == null || answer.QuestaoKey === questionKey) &&
      (timeKey == null || answer.TempoKey === timeKey),
  );
  const overviews = groupByStudent(filtered);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Respostas</h1>
        <p className="mt-1 text-sm text-slate-600">
          Um card por aluno anônimo. Clique para ver cada simulado e cada questão. {filtered.length} respostas em{" "}
          {overviews.length} alunos.
        </p>
      </div>
      <Messages notice={params.notice} error={params.error} />
      <form method="get" className={`${cardClass} grid gap-3 md:grid-cols-4`}>
        <p className="text-sm text-slate-600 md:col-span-4">Filtros opcionais. Em branco, a lista mostra todas as respostas.</p>
        <select name="timeKey" className={fieldClass} defaultValue={params.timeKey ?? ""}>
          <option value="">Todas as datas</option>
          {timeRecords.map((timeRecord) => (
            <option key={timeRecord.TempoKey} value={timeRecord.TempoKey}>
              {timeRecord.TempoKey} · {timeRecord.NomeMes}/{timeRecord.Ano}
            </option>
          ))}
        </select>
        <select name="studentKey" className={fieldClass} defaultValue={params.studentKey ?? ""}>
          <option value="">Todos os alunos</option>
          {students.map((student) => (
            <option key={student.AlunoKey} value={student.AlunoKey}>
              {student.CodigoAlunoAnonimo}
            </option>
          ))}
        </select>
        <select name="questionKey" className={fieldClass} defaultValue={params.questionKey ?? ""}>
          <option value="">Todas as questões</option>
          {questions.map((question) => (
            <option key={question.QuestaoKey} value={question.QuestaoKey}>
              {question.CodigoQuestao}
            </option>
          ))}
        </select>
        <select name="examKey" className={fieldClass} defaultValue={params.examKey ?? ""}>
          <option value="">Todos os simulados</option>
          {exams.map((exam) => (
            <option key={exam.SimuladoKey} value={exam.SimuladoKey}>
              {exam.CodigoSimulado}
            </option>
          ))}
        </select>
        <button type="submit" className={secondaryButton}>
          Filtrar
        </button>
        <Link href="/admin/respostas" className={secondaryButton}>
          Limpar
        </Link>
      </form>
      <form action={saveAnswer} className={`${cardClass} grid gap-3 md:grid-cols-4`}>
        <select name="timeKey" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Data
          </option>
          {timeRecords.map((timeRecord) => (
            <option key={timeRecord.TempoKey} value={timeRecord.TempoKey}>
              {timeRecord.TempoKey} · {timeRecord.NomeMes}/{timeRecord.Ano}
            </option>
          ))}
        </select>
        <select name="studentKey" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Aluno
          </option>
          {students.map((student) => (
            <option key={student.AlunoKey} value={student.AlunoKey}>
              {student.CodigoAlunoAnonimo}
            </option>
          ))}
        </select>
        <select name="questionKey" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Questão
          </option>
          {questions.map((question) => (
            <option key={question.QuestaoKey} value={question.QuestaoKey}>
              {question.CodigoQuestao}
            </option>
          ))}
        </select>
        <select name="examKey" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Simulado
          </option>
          {exams.map((exam) => (
            <option key={exam.SimuladoKey} value={exam.SimuladoKey}>
              {exam.CodigoSimulado}
            </option>
          ))}
        </select>
        <input name="answer" required maxLength={8} placeholder="Resposta" className={fieldClass} />
        <select name="wasCorrect" required className={fieldClass} defaultValue="0">
          <option value="1">Acertou</option>
          <option value="0">Errou</option>
        </select>
        <input name="seconds" type="number" min={0} step="0.01" placeholder="Segundos" className={fieldClass} />
        <button type="submit" className={primaryButton}>
          Incluir
        </button>
      </form>
      <StudentAnswers students={overviews} deleteAction={deleteAnswer} />
    </div>
  );
}

function optionalKey(value: string | undefined) {
  const key = Number(value);
  return Number.isInteger(key) && key > 0 ? key : null;
}

function groupByStudent(
  answers: {
    RespostaKey: number;
    AlunoKey: number;
    SimuladoKey: number;
    RespostaDada: string;
    Acertou: number;
    TempoRespostaSegundos: number | null;
    Dim_Aluno_Anonimo: { CodigoAlunoAnonimo: string; TurmaGrupo: string };
    Dim_Questao: { CodigoQuestao: string; EixoTematico: string };
    Dim_Simulado: { CodigoSimulado: string; NumeroAplicacao: number };
  }[],
): StudentAnswerView[] {
  const students = new Map<string, StudentAnswerView & { examsById: Map<string, StudentAnswerView["exams"][number] & { application: number }> }>();

  for (const answer of answers) {
    const studentId = String(answer.AlunoKey);
    const student = students.get(studentId) ?? {
      id: studentId,
      code: answer.Dim_Aluno_Anonimo.CodigoAlunoAnonimo,
      classGroup: answer.Dim_Aluno_Anonimo.TurmaGrupo,
      hits: 0,
      total: 0,
      exams: [],
      examsById: new Map(),
    };
    student.total += 1;
    student.hits += answer.Acertou === 1 ? 1 : 0;

    const examId = String(answer.SimuladoKey);
    const exam = student.examsById.get(examId) ?? {
      id: examId,
      name: answer.Dim_Simulado.CodigoSimulado,
      application: answer.Dim_Simulado.NumeroAplicacao,
      hits: 0,
      total: 0,
      rows: [],
    };
    exam.total += 1;
    exam.hits += answer.Acertou === 1 ? 1 : 0;
    exam.rows.push({
      id: String(answer.RespostaKey),
      href: `/admin/respostas/${answer.RespostaKey}`,
      question: answer.Dim_Questao.CodigoQuestao,
      axis: answer.Dim_Questao.EixoTematico,
      answer: answer.RespostaDada,
      correct: answer.Acertou === 1,
      seconds: answer.TempoRespostaSegundos == null ? "—" : String(answer.TempoRespostaSegundos),
    });
    student.examsById.set(examId, exam);
    students.set(studentId, student);
  }

  return [...students.values()]
    .map(({ examsById, ...student }) => ({
      ...student,
      exams: [...examsById.values()]
        .sort((a, b) => a.application - b.application)
        .map((exam) => ({
          id: exam.id,
          name: exam.name,
          hits: exam.hits,
          total: exam.total,
          rows: exam.rows.sort((a, b) => a.question.localeCompare(b.question, "pt-BR")),
        })),
    }))
    .sort((a, b) => a.code.localeCompare(b.code, "pt-BR"));
}
