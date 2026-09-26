import Link from "next/link";
import { exigirUsuario } from "@/lib/auth";
import { formatarData } from "@/lib/datas";
import { cartao } from "@/lib/estilos";
import { formatarNota, notaNumero } from "@/lib/formatar";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Desempenho" };

export default async function Desempenho() {
  const usuario = await exigirUsuario();
  const tentativas = await prisma.tentativa.findMany({
    where: { usuarioId: usuario.id },
    orderBy: { iniciadaEm: "desc" },
    include: {
      prova: true,
      respostas: { select: { acertou: true } },
      ordem: { select: { perguntaId: true } },
    },
  });

  const concluidas = tentativas.filter((tentativa) => tentativa.concluidaEm);
  const notas = concluidas
    .map((tentativa) => notaNumero(tentativa.nota))
    .filter((nota): nota is number => nota != null);
  const media = notas.length === 0 ? null : notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
  const acertos = concluidas.reduce(
    (soma, tentativa) => soma + tentativa.respostas.filter((resposta) => resposta.acertou).length,
    0,
  );
  const questoes = concluidas.reduce((soma, tentativa) => soma + tentativa.ordem.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Desempenho</h1>
        <p className="mt-1 text-sm text-slate-600">Histórico das suas provas. A nota em branco conta como erro.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className={cartao}>
          <p className="text-sm text-slate-500">Provas concluídas</p>
          <p className="mt-2 text-3xl font-semibold">{concluidas.length}</p>
        </article>
        <article className={cartao}>
          <p className="text-sm text-slate-500">Média</p>
          <p className="mt-2 text-3xl font-semibold">{formatarNota(media)}</p>
        </article>
        <article className={cartao}>
          <p className="text-sm text-slate-500">Acertos</p>
          <p className="mt-2 text-3xl font-semibold">
            {acertos}
            <span className="text-lg font-medium text-slate-500">/{questoes}</span>
          </p>
        </article>
      </div>
      {tentativas.length === 0 ? (
        <p className="text-sm text-slate-600">Você ainda não iniciou uma prova.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Prova</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Situação</th>
                <th className="px-4 py-3 font-medium">Acertos</th>
                <th className="px-4 py-3 font-medium">Nota</th>
              </tr>
            </thead>
            <tbody>
              {tentativas.map((tentativa) => {
                const certos = tentativa.respostas.filter((resposta) => resposta.acertou).length;
                return (
                  <tr key={tentativa.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <Link href={`/prova/${tentativa.provaId}`} className="font-medium text-blue-700 hover:underline">
                        {tentativa.prova.titulo}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{formatarData(tentativa.prova.data)}</td>
                    <td className="px-4 py-3">{tentativa.concluidaEm ? "Concluída" : "Em andamento"}</td>
                    <td className="px-4 py-3">
                      {tentativa.concluidaEm ? `${certos}/${tentativa.ordem.length}` : "—"}
                    </td>
                    <td className="px-4 py-3">{formatarNota(tentativa.nota)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
