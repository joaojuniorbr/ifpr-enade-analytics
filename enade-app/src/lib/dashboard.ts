import { prisma } from '@/lib/prisma';

export type GroupSummary = {
	name: string;
	hits: number;
	total: number;
};

export type QuestionSummary = {
	code: string;
	axis: string;
	hits: number;
	total: number;
};

function rate(hits: number, total: number): number {
	if (total <= 0) return 1;
	return hits / total;
}

function accumulate(
	groups: Map<string, GroupSummary>,
	name: string,
	wasCorrect: number
) {
	const current = groups.get(name) ?? { name, hits: 0, total: 0 };
	current.total += 1;
	current.hits += wasCorrect;
	groups.set(name, current);
}

export async function loadAdminDashboard() {
	const facts = await prisma.fato_Respostas.findMany({
		select: {
			Acertou: true,
			Dim_Questao: { select: { CodigoQuestao: true, EixoTematico: true } },
			Dim_Aluno_Anonimo: { select: { TurmaGrupo: true } },
			Dim_Simulado: {
				select: { NumeroAplicacao: true, DescricaoSimulado: true },
			},
		},
	});

	const axes = new Map<string, GroupSummary>();
	const classes = new Map<string, GroupSummary>();
	const exams = new Map<string, GroupSummary>();
	const questions = new Map<string, QuestionSummary>();
	let hits = 0;

	for (const fact of facts) {
		const value = fact.Acertou === 1 ? 1 : 0;
		hits += value;
		accumulate(axes, fact.Dim_Questao.EixoTematico, value);
		accumulate(classes, fact.Dim_Aluno_Anonimo.TurmaGrupo, value);
		accumulate(
			exams,
			`${fact.Dim_Simulado.NumeroAplicacao}. ${fact.Dim_Simulado.DescricaoSimulado}`,
			value
		);
		const code = fact.Dim_Questao.CodigoQuestao;
		const question = questions.get(code) ?? {
			code,
			axis: fact.Dim_Questao.EixoTematico,
			hits: 0,
			total: 0,
		};
		question.total += 1;
		question.hits += value;
		questions.set(code, question);
	}

	const sortByRate = (items: GroupSummary[]) =>
		items.sort(
			(a, b) =>
				rate(a.hits, a.total) - rate(b.hits, b.total) ||
				a.name.localeCompare(b.name, "pt-BR")
		);

	return {
		total: facts.length,
		hits,
		byAxis: sortByRate([...axes.values()]),
		byClass: sortByRate([...classes.values()]),
		byExam: [...exams.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
		byQuestion: [...questions.values()].sort(
			(a, b) => rate(a.hits, a.total) - rate(b.hits, b.total) || a.code.localeCompare(b.code, "pt-BR")
		),
	};
}
