import { notFound } from "next/navigation";
import { ProvaForm } from "@/components/prova-form";
import { chaveData } from "@/lib/datas";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar prova" };

export default async function EditarProva({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prova = await prisma.prova.findUnique({
    where: { id },
    include: {
      perguntas: { select: { perguntaId: true } },
      _count: { select: { tentativas: true } },
    },
  });
  if (!prova) notFound();

  const selecionadasIds = prova.perguntas.map((item) => item.perguntaId);
  const bloqueada = prova._count.tentativas > 0;
  const perguntas = await prisma.pergunta.findMany({
    where: bloqueada
      ? { id: { in: selecionadasIds } }
      : { OR: [{ ativa: true }, { id: { in: selecionadasIds } }] },
    orderBy: { createdAt: "asc" },
    select: { id: true, enunciado: true, eixo: true, ativa: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Editar prova</h1>
      <ProvaForm
        bloqueada={bloqueada}
        selecionadasIds={selecionadasIds}
        perguntas={perguntas}
        inicial={{
          id: prova.id,
          titulo: prova.titulo,
          data: chaveData(prova.data),
        }}
      />
    </div>
  );
}
