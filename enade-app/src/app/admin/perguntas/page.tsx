import Link from "next/link";
import { excluirPergunta } from "@/app/admin/perguntas/actions";
import { Aviso } from "@/components/aviso";
import { BotaoExcluir } from "@/components/botao-excluir";
import { Selo } from "@/components/selo";
import { rotuloNivel } from "@/lib/eixos";
import { botaoPrimario } from "@/lib/estilos";
import { resumir } from "@/lib/formatar";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Perguntas" };

const avisos: Record<string, { texto: string; tom: "verde" | "ambar" }> = {
  salva: { texto: "Pergunta salva.", tom: "verde" },
  excluida: { texto: "Pergunta excluída.", tom: "verde" },
  desativada: {
    texto: "A pergunta já foi usada em uma tentativa, então foi desativada.",
    tom: "ambar",
  },
};

export default async function PaginaPerguntas({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const params = await searchParams;
  const aviso = params.aviso ? avisos[params.aviso] : undefined;
  const perguntas = await prisma.pergunta.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { alternativas: true, ordens: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Perguntas</h1>
          <p className="mt-1 text-sm text-slate-600">Cada pergunta tem uma única alternativa correta.</p>
        </div>
        <Link href="/admin/perguntas/nova" className={botaoPrimario}>
          Nova pergunta
        </Link>
      </div>
      {aviso ? <Aviso tom={aviso.tom} texto={aviso.texto} /> : null}
      {perguntas.length === 0 ? (
        <p className="text-sm text-slate-600">Nenhuma pergunta cadastrada.</p>
      ) : (
        <ul className="space-y-3">
          {perguntas.map((pergunta) => (
            <li key={pergunta.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 space-y-2">
                  <p className="text-sm text-slate-900">{resumir(pergunta.enunciado, 220)}</p>
                  <div className="flex flex-wrap gap-2">
                    <Selo tom={pergunta.ativa ? "verde" : "cinza"}>{pergunta.ativa ? "Ativa" : "Inativa"}</Selo>
                    {pergunta.eixo ? <Selo>{pergunta.eixo}</Selo> : null}
                    {rotuloNivel(pergunta.nivel) ? <Selo>{rotuloNivel(pergunta.nivel)}</Selo> : null}
                    <Selo>{pergunta._count.alternativas} alternativas</Selo>
                    {pergunta._count.ordens > 0 ? <Selo tom="ambar">Usada em tentativa</Selo> : null}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/perguntas/${pergunta.id}`} className="text-sm font-medium text-blue-700 hover:underline">
                    Editar
                  </Link>
                  <BotaoExcluir
                    id={pergunta.id}
                    action={excluirPergunta}
                    rotulo="Excluir"
                    mensagem="Se esta pergunta já entrou em alguma tentativa, ela será desativada em vez de excluída."
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
