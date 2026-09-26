import Link from "next/link";
import { notFound } from "next/navigation";
import { iniciarTentativa } from "@/app/prova/actions";
import { Aviso } from "@/components/aviso";
import { ResponderProva } from "@/components/responder-prova";
import { Selo } from "@/components/selo";
import { exigirUsuario } from "@/lib/auth";
import { formatarData, rotuloSituacao, situacaoProva } from "@/lib/datas";
import { letraAlternativa } from "@/lib/embaralhar";
import { botaoPrimario, botaoSecundario, cartao } from "@/lib/estilos";
import { formatarNota } from "@/lib/formatar";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Prova" };

export default async function PaginaProva({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const usuario = await exigirUsuario();
  const { id } = await params;
  const consulta = await searchParams;
  const prova = await prisma.prova.findUnique({ where: { id } });
  if (!prova) notFound();

  const situacao = situacaoProva(prova.data);
  const tentativa = await prisma.tentativa.findUnique({
    where: { usuarioId_provaId: { usuarioId: usuario.id, provaId: id } },
    include: {
      ordem: {
        orderBy: { posicao: "asc" },
        include: {
          pergunta: { include: { alternativas: { orderBy: { ordem: "asc" } } } },
        },
      },
      respostas: true,
    },
  });

  const ativas = await prisma.provaPergunta.count({
    where: { provaId: id, pergunta: { ativa: true } },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">{prova.titulo}</h1>
        <Selo>{formatarData(prova.data)}</Selo>
        <Selo tom={situacao === "liberada" ? "verde" : situacao === "futura" ? "azul" : "cinza"}>
          {rotuloSituacao(situacao)}
        </Selo>
      </div>

      {consulta.erro === "sem-perguntas" ? (
        <Aviso tom="ambar" texto="Esta prova não tem perguntas ativas para iniciar." />
      ) : null}

      {tentativa?.concluidaEm ? (
        <Resultado
          nota={formatarNota(tentativa.nota)}
          acertos={tentativa.respostas.filter((resposta) => resposta.acertou).length}
          total={tentativa.ordem.length}
          ordem={tentativa.ordem}
          respostas={tentativa.respostas}
        />
      ) : null}

      {!tentativa && situacao === "futura" ? (
        <Aviso texto="Esta prova ainda não foi liberada. Ela abre na data marcada." />
      ) : null}
      {!tentativa && situacao === "encerrada" ? (
        <Aviso tom="cinza" texto="Esta prova está encerrada e você não chegou a iniciá-la." />
      ) : null}
      {tentativa && !tentativa.concluidaEm && situacao !== "liberada" ? (
        <Aviso
          tom="ambar"
          texto="Esta prova encerrou antes da conclusão. A tentativa incompleta não pode continuar nem ser refeita."
        />
      ) : null}

      {!tentativa && situacao === "liberada" && ativas > 0 ? (
        <form action={iniciarTentativa}>
          <input type="hidden" name="provaId" value={prova.id} />
          <button type="submit" className={botaoPrimario}>
            Iniciar prova
          </button>
        </form>
      ) : null}
      {!tentativa && situacao === "liberada" && ativas === 0 ? (
        <Aviso tom="ambar" texto="Esta prova não tem perguntas ativas." />
      ) : null}

      {tentativa && !tentativa.concluidaEm && situacao === "liberada" ? (
        <ResponderProva
          tentativaId={tentativa.id}
          respostasIniciais={Object.fromEntries(
            tentativa.respostas.map((resposta) => [resposta.perguntaId, resposta.alternativaId]),
          )}
          perguntas={tentativa.ordem.map((item) => ({
            id: item.pergunta.id,
            enunciado: item.pergunta.enunciado,
            eixo: item.pergunta.eixo,
            alternativas: item.pergunta.alternativas.map((alternativa, indice) => ({
              id: alternativa.id,
              letra: letraAlternativa(indice),
              texto: alternativa.texto,
            })),
          }))}
        />
      ) : null}

      <Link href="/prova" className={botaoSecundario}>
        Voltar às provas
      </Link>
    </div>
  );
}

function Resultado({
  nota,
  acertos,
  total,
  ordem,
  respostas,
}: {
  nota: string;
  acertos: number;
  total: number;
  ordem: {
    pergunta: {
      id: string;
      enunciado: string;
      alternativas: { id: string; texto: string; correta: boolean }[];
    };
  }[];
  respostas: { perguntaId: string; alternativaId: string; acertou: boolean }[];
}) {
  const porPergunta = new Map(respostas.map((resposta) => [resposta.perguntaId, resposta]));

  return (
    <div className="space-y-4">
      <section className={cartao}>
        <p className="text-sm text-slate-500">Resultado</p>
        <p className="mt-2 text-3xl font-semibold">{nota}</p>
        <p className="mt-1 text-sm text-slate-600">
          {acertos} de {total} acertos. Esta tentativa não pode ser refeita.
        </p>
      </section>
      {ordem.map((item, indice) => {
        const resposta = porPergunta.get(item.pergunta.id);
        return (
          <article key={item.pergunta.id} className={cartao}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">Questão {indice + 1}</h2>
              {resposta?.acertou ? <Selo tom="verde">Acertou</Selo> : null}
              {resposta && !resposta.acertou ? <Selo tom="vermelho">Errou</Selo> : null}
              {!resposta ? <Selo tom="ambar">Em branco</Selo> : null}
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{item.pergunta.enunciado}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {item.pergunta.alternativas.map((alternativa, indiceAlternativa) => {
                const escolhida = resposta?.alternativaId === alternativa.id;
                return (
                  <li key={alternativa.id} className="text-slate-700">
                    <span className="font-medium">{letraAlternativa(indiceAlternativa)}.</span> {alternativa.texto}
                    {alternativa.correta ? <span className="ml-2 text-emerald-700">Correta</span> : null}
                    {escolhida ? <span className="ml-2 text-blue-700">Sua resposta</span> : null}
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
