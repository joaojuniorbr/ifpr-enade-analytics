import Link from "next/link";
import { Aviso } from "@/components/aviso";
import { cartao } from "@/lib/estilos";
import { formatarData } from "@/lib/datas";
import { formatarNota, formatarTaxa, resumir } from "@/lib/formatar";
import { painelAdmin } from "@/lib/painel";

export const metadata = { title: "Acompanhamento" };

export default async function Painel() {
  const painel = await painelAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Acompanhamento</h1>
        <p className="mt-1 text-sm text-slate-600">Números calculados nas tentativas gravadas no MySQL.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className={cartao}>
          <p className="text-sm text-slate-500">Tentativas</p>
          <p className="mt-2 text-3xl font-semibold">{painel.totalTentativas}</p>
        </article>
        <article className={cartao}>
          <p className="text-sm text-slate-500">Conclusão</p>
          <p className="mt-2 text-3xl font-semibold">
            {formatarTaxa(painel.concluidas, painel.totalTentativas)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {painel.concluidas} de {painel.totalTentativas} concluídas
          </p>
        </article>
        <article className={cartao}>
          <p className="text-sm text-slate-500">Média das notas</p>
          <p className="mt-2 text-3xl font-semibold">{formatarNota(painel.media)}</p>
        </article>
      </div>

      <section className={cartao}>
        <h2 className="text-lg font-semibold text-slate-900">Por prova</h2>
        {painel.porProva.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Nenhuma prova cadastrada.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Prova</th>
                  <th className="py-2 pr-4 font-medium">Data</th>
                  <th className="py-2 pr-4 font-medium">Tentativas</th>
                  <th className="py-2 pr-4 font-medium">Conclusão</th>
                  <th className="py-2 font-medium">Média</th>
                </tr>
              </thead>
              <tbody>
                {painel.porProva.map((prova) => (
                  <tr key={prova.id} className="border-t border-slate-200">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/provas/${prova.id}`} className="font-medium text-blue-700 hover:underline">
                        {prova.titulo}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{formatarData(prova.data)}</td>
                    <td className="py-3 pr-4">{prova.tentativas}</td>
                    <td className="py-3 pr-4">{formatarTaxa(prova.concluidas, prova.tentativas)}</td>
                    <td className="py-3">{formatarNota(prova.media)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={cartao}>
        <h2 className="text-lg font-semibold text-slate-900">Por eixo</h2>
        {painel.porEixo.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Ainda não há resposta em prova concluída.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {painel.porEixo.map((eixo) => (
              <li key={eixo.eixo} className="flex items-center justify-between gap-4 border-t border-slate-200 py-2">
                <span>{eixo.eixo}</span>
                <span className="text-slate-600">
                  {eixo.acertos}/{eixo.total} · {formatarTaxa(eixo.acertos, eixo.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={cartao}>
        <h2 className="text-lg font-semibold text-slate-900">Por pergunta</h2>
        <p className="mt-1 text-sm text-slate-600">
          Acertos sobre as vezes em que a questão entrou numa tentativa concluída. Questão em branco conta como erro.
        </p>
        {painel.porPergunta.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Ainda não há resposta em prova concluída.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Pergunta</th>
                  <th className="py-2 pr-4 font-medium">Eixo</th>
                  <th className="py-2 font-medium">Acertos</th>
                </tr>
              </thead>
              <tbody>
                {painel.porPergunta.map((pergunta) => (
                  <tr key={pergunta.id} className="border-t border-slate-200">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/perguntas/${pergunta.id}`} className="text-blue-700 hover:underline">
                        {resumir(pergunta.enunciado)}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{pergunta.eixo ?? "—"}</td>
                    <td className="py-3">
                      {pergunta.acertos}/{pergunta.total} · {formatarTaxa(pergunta.acertos, pergunta.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {painel.totalTentativas === 0 ? (
        <Aviso texto="Quando alguém iniciar uma prova, os totais acima deixam de ser zero." />
      ) : null}
    </div>
  );
}
