import Link from "next/link";
import { excluirProva } from "@/app/admin/provas/actions";
import { Aviso } from "@/components/aviso";
import { BotaoExcluir } from "@/components/botao-excluir";
import { Selo } from "@/components/selo";
import { formatarData, rotuloSituacao, situacaoProva } from "@/lib/datas";
import { botaoPrimario } from "@/lib/estilos";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Provas" };

const avisos: Record<string, { texto: string; tom: "verde" | "vermelho" }> = {
  salva: { texto: "Prova salva.", tom: "verde" },
  excluida: { texto: "Prova excluída.", tom: "verde" },
};

export default async function PaginaProvas({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string; erro?: string }>;
}) {
  const params = await searchParams;
  const aviso = params.aviso ? avisos[params.aviso] : undefined;
  const provas = await prisma.prova.findMany({
    orderBy: { data: "desc" },
    include: { _count: { select: { perguntas: true, tentativas: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Provas</h1>
          <p className="mt-1 text-sm text-slate-600">
            Cada prova vale em uma data. No dia, as perguntas saem em ordem aleatória por tentativa.
          </p>
        </div>
        <Link href="/admin/provas/nova" className={botaoPrimario}>
          Nova prova
        </Link>
      </div>
      {aviso ? <Aviso tom={aviso.tom} texto={aviso.texto} /> : null}
      {params.erro === "em-uso" ? (
        <Aviso tom="vermelho" texto="Não é possível excluir: já existe tentativa nesta prova." />
      ) : null}
      {provas.length === 0 ? (
        <p className="text-sm text-slate-600">Nenhuma prova cadastrada.</p>
      ) : (
        <ul className="space-y-3">
          {provas.map((prova) => {
            const situacao = situacaoProva(prova.data);
            const tom = situacao === "liberada" ? "verde" : situacao === "futura" ? "azul" : "cinza";
            return (
              <li key={prova.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-900">{prova.titulo}</p>
                    <div className="flex flex-wrap gap-2">
                      <Selo>{formatarData(prova.data)}</Selo>
                      <Selo tom={tom}>{rotuloSituacao(situacao)}</Selo>
                      <Selo>{prova._count.perguntas} perguntas</Selo>
                      <Selo>{prova._count.tentativas} tentativas</Selo>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/provas/${prova.id}`} className="text-sm font-medium text-blue-700 hover:underline">
                      Editar
                    </Link>
                    <BotaoExcluir
                      id={prova.id}
                      action={excluirProva}
                      rotulo="Excluir"
                      mensagem="Excluir esta prova? Só é possível se ninguém tiver iniciado."
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
