"use client";

import { useActionState } from "react";
import { salvarProva } from "@/app/admin/provas/actions";
import { Aviso } from "@/components/aviso";
import { EIXOS } from "@/lib/eixos";
import { botaoPrimario, campo, cartao } from "@/lib/estilos";
import { estadoInicial } from "@/lib/formularios";
import { resumir } from "@/lib/formatar";

type PerguntaOpcao = {
  id: string;
  enunciado: string;
  eixo: string | null;
  ativa: boolean;
};

export function ProvaForm({
  inicial,
  perguntas,
  selecionadasIds,
  bloqueada,
}: {
  inicial?: { id: string; titulo: string; data: string };
  perguntas: PerguntaOpcao[];
  selecionadasIds: string[];
  bloqueada: boolean;
}) {
  const [estado, acao, pendente] = useActionState(salvarProva, estadoInicial);
  const selecionadas = new Set(selecionadasIds);
  const grupos = new Map<string, PerguntaOpcao[]>();
  for (const pergunta of perguntas) {
    const chave = pergunta.eixo ?? "Sem eixo";
    const lista = grupos.get(chave) ?? [];
    lista.push(pergunta);
    grupos.set(chave, lista);
  }
  const ordem = [...EIXOS, "Sem eixo"].filter((eixo) => grupos.has(eixo));

  return (
    <form action={acao} className="space-y-4">
      <input type="hidden" name="id" value={inicial?.id ?? ""} />
      {estado.erro ? <Aviso tom="vermelho" texto={estado.erro} /> : null}
      {bloqueada ? (
        <Aviso
          tom="ambar"
          texto="Já existe tentativa nesta prova. Dá para alterar o título. A data e as perguntas ficam como estão."
        />
      ) : null}

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        Título
        <input
          name="titulo"
          required
          defaultValue={inicial?.titulo ?? ""}
          maxLength={160}
          className={campo}
        />
      </label>

      {bloqueada ? (
        <input type="hidden" name="data" value={inicial?.data ?? ""} />
      ) : (
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Data em que a prova vale
          <input
            type="date"
            name="data"
            required
            defaultValue={inicial?.data ?? ""}
            className={campo}
          />
        </label>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-slate-700">Perguntas</legend>
        {bloqueada
          ? selecionadasIds.map((id) => (
              <input key={id} type="hidden" name="perguntaId" value={id} />
            ))
          : null}
        {perguntas.length === 0 ? (
          <p className="text-sm text-slate-600">Cadastre uma pergunta ativa antes de montar a prova.</p>
        ) : null}
        {ordem.map((eixo) => (
          <div key={eixo} className={cartao}>
            <h2 className="text-sm font-semibold text-slate-900">{eixo}</h2>
            <div className="mt-3 space-y-3">
              {(grupos.get(eixo) ?? []).map((pergunta) => (
                <label key={pergunta.id} className="flex items-start gap-2 text-sm text-slate-700">
                  {bloqueada ? null : (
                    <input
                      type="checkbox"
                      name="perguntaId"
                      value={pergunta.id}
                      defaultChecked={selecionadas.has(pergunta.id)}
                      className="mt-1 h-4 w-4"
                    />
                  )}
                  <span>
                    {resumir(pergunta.enunciado, 180)}
                    {pergunta.ativa ? "" : " (inativa)"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </fieldset>

      <button type="submit" className={botaoPrimario} disabled={pendente}>
        {pendente ? "Salvando…" : "Salvar prova"}
      </button>
    </form>
  );
}
