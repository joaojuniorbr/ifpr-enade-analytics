import { prisma } from "@/lib/prisma";
import { notaNumero } from "@/lib/formatar";

export type ResumoProva = {
  id: string;
  titulo: string;
  data: Date;
  tentativas: number;
  concluidas: number;
  media: number | null;
};

export type ResumoPergunta = {
  id: string;
  enunciado: string;
  eixo: string | null;
  acertos: number;
  total: number;
};

export type ResumoEixo = {
  eixo: string;
  acertos: number;
  total: number;
};

export async function painelAdmin() {
  const concluidasIds = (
    await prisma.tentativa.findMany({
      where: { concluidaEm: { not: null } },
      select: { id: true },
    })
  ).map((tentativa) => tentativa.id);

  const [totalTentativas, concluidas, mediaGeral, provas, ordens, acertos] = await Promise.all([
    prisma.tentativa.count(),
    prisma.tentativa.count({ where: { concluidaEm: { not: null } } }),
    prisma.tentativa.aggregate({
      where: { concluidaEm: { not: null } },
      _avg: { nota: true },
    }),
    prisma.prova.findMany({
      orderBy: { data: "desc" },
      include: {
        tentativas: { select: { concluidaEm: true, nota: true } },
      },
    }),
    concluidasIds.length === 0
      ? Promise.resolve([])
      : prisma.ordemPergunta.groupBy({
          by: ["perguntaId"],
          where: { tentativaId: { in: concluidasIds } },
          _count: { _all: true },
        }),
    concluidasIds.length === 0
      ? Promise.resolve([])
      : prisma.resposta.groupBy({
          by: ["perguntaId"],
          where: { acertou: true, tentativaId: { in: concluidasIds } },
          _count: { _all: true },
        }),
  ]);

  const porProva: ResumoProva[] = provas.map((prova) => {
    const feitas = prova.tentativas.filter((tentativa) => tentativa.concluidaEm);
    const notas = feitas
      .map((tentativa) => notaNumero(tentativa.nota))
      .filter((nota): nota is number => nota != null);
    const media =
      notas.length === 0 ? null : notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
    return {
      id: prova.id,
      titulo: prova.titulo,
      data: prova.data,
      tentativas: prova.tentativas.length,
      concluidas: feitas.length,
      media,
    };
  });

  const acertosPorId = new Map(acertos.map((item) => [item.perguntaId, item._count._all]));
  const ids = ordens.map((item) => item.perguntaId);
  const perguntas = ids.length
    ? await prisma.pergunta.findMany({
        where: { id: { in: ids } },
        select: { id: true, enunciado: true, eixo: true },
      })
    : [];
  const perguntaPorId = new Map(perguntas.map((pergunta) => [pergunta.id, pergunta]));

  const porPergunta: ResumoPergunta[] = ordens
    .map((item) => {
      const pergunta = perguntaPorId.get(item.perguntaId);
      return {
        id: item.perguntaId,
        enunciado: pergunta?.enunciado ?? "Pergunta removida",
        eixo: pergunta?.eixo ?? null,
        acertos: acertosPorId.get(item.perguntaId) ?? 0,
        total: item._count._all,
      };
    })
    .sort((a, b) => a.acertos / a.total - b.acertos / b.total);

  const eixos = new Map<string, ResumoEixo>();
  for (const pergunta of porPergunta) {
    const nome = pergunta.eixo ?? "Sem eixo";
    const atual = eixos.get(nome) ?? { eixo: nome, acertos: 0, total: 0 };
    atual.acertos += pergunta.acertos;
    atual.total += pergunta.total;
    eixos.set(nome, atual);
  }
  const porEixo = [...eixos.values()].sort((a, b) => a.acertos / a.total - b.acertos / b.total);

  return {
    totalTentativas,
    concluidas,
    media: notaNumero(mediaGeral._avg.nota),
    porProva,
    porPergunta,
    porEixo,
  };
}
