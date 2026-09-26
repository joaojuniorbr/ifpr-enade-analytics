import Link from "next/link";
import { iniciarTentativa } from "@/app/prova/actions";
import { Selo } from "@/components/selo";
import { exigirUsuario } from "@/lib/auth";
import { formatarData, rotuloSituacao, situacaoProva } from "@/lib/datas";
import { botaoPrimario, botaoSecundario, cartao } from "@/lib/estilos";
import { formatarNota } from "@/lib/formatar";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Provas" };

export default async function PaginaProvasAluno() {
  const usuario = await exigirUsuario();
  const provas = await prisma.prova.findMany({
    orderBy: { data: "asc" },
    include: {
      perguntas: { where: { pergunta: { ativa: true } }, select: { perguntaId: true } },
      tentativas: {
        where: { usuarioId: usuario.id },
        select: { concluidaEm: true, nota: true },
      },
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Provas</h1>
        <p className="mt-1 text-sm text-slate-600">
          A prova do dia fica liberada. As outras aparecem como ainda não liberadas ou encerradas.
        </p>
      </div>
      {provas.length === 0 ? (
        <p className="text-sm text-slate-600">Nenhuma prova cadastrada.</p>
      ) : (
        <ul className="space-y-3">
          {provas.map((prova) => {
            const situacao = situacaoProva(prova.data);
            const tentativa = prova.tentativas[0];
            const tom = situacao === "liberada" ? "verde" : situacao === "futura" ? "azul" : "cinza";
            const destaque = situacao === "liberada" ? "border-blue-600" : "border-slate-200";
            return (
              <li key={prova.id} className={`${cartao} border-2 ${destaque}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-slate-900">{prova.titulo}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Selo>{formatarData(prova.data)}</Selo>
                      <Selo tom={tom}>{rotuloSituacao(situacao)}</Selo>
                      <Selo>{prova.perguntas.length} perguntas</Selo>
                      {tentativa?.concluidaEm ? <Selo tom="verde">Nota {formatarNota(tentativa.nota)}</Selo> : null}
                      {tentativa && !tentativa.concluidaEm ? <Selo tom="ambar">Em andamento</Selo> : null}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {situacao === "liberada" && !tentativa ? (
                      <form action={iniciarTentativa}>
                        <input type="hidden" name="provaId" value={prova.id} />
                        <button type="submit" className={botaoPrimario}>
                          Iniciar
                        </button>
                      </form>
                    ) : null}
                    {situacao === "liberada" && tentativa && !tentativa.concluidaEm ? (
                      <Link href={`/prova/${prova.id}`} className={botaoPrimario}>
                        Retomar
                      </Link>
                    ) : null}
                    {tentativa?.concluidaEm ? (
                      <Link href={`/prova/${prova.id}`} className={botaoSecundario}>
                        Ver resultado
                      </Link>
                    ) : null}
                    {situacao !== "liberada" && !tentativa?.concluidaEm ? (
                      <Link href={`/prova/${prova.id}`} className={botaoSecundario}>
                        Ver situação
                      </Link>
                    ) : null}
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
