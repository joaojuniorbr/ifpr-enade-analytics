import { notFound } from "next/navigation";
import { PerguntaForm } from "@/components/pergunta-form";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar pergunta" };

export default async function EditarPergunta({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pergunta = await prisma.pergunta.findUnique({
    where: { id },
    include: {
      alternativas: { orderBy: { ordem: "asc" } },
      _count: { select: { ordens: true } },
    },
  });
  if (!pergunta) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Editar pergunta</h1>
      <PerguntaForm
        inicial={{
          id: pergunta.id,
          enunciado: pergunta.enunciado,
          eixo: pergunta.eixo ?? "",
          tema: pergunta.tema ?? "",
          nivel: pergunta.nivel ?? "",
          ativa: pergunta.ativa,
          usada: pergunta._count.ordens > 0,
          alternativas: pergunta.alternativas.map((alternativa) => ({
            id: alternativa.id,
            texto: alternativa.texto,
            correta: alternativa.correta,
          })),
        }}
      />
    </div>
  );
}
