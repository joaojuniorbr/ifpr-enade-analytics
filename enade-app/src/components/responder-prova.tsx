"use client";

import { useState, useTransition } from "react";
import { concluirTentativa, salvarResposta } from "@/app/prova/actions";
import { Aviso } from "@/components/aviso";
import { botaoPrimario } from "@/lib/estilos";

type Questao = {
  id: string;
  enunciado: string;
  eixo: string | null;
  alternativas: { id: string; letra: string; texto: string }[];
};

export function ResponderProva({
  tentativaId,
  perguntas,
  respostasIniciais,
}: {
  tentativaId: string;
  perguntas: Questao[];
  respostasIniciais: Record<string, string>;
}) {
  const [respostas, setRespostas] = useState(respostasIniciais);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const respondidas = perguntas.filter((pergunta) => respostas[pergunta.id]).length;

  async function aoEscolher(perguntaId: string, alternativaId: string) {
    const anterior = respostas;
    setRespostas((atual) => ({ ...atual, [perguntaId]: alternativaId }));
    setSalvando(perguntaId);
    setErro(null);
    const resultado = await salvarResposta({ tentativaId, perguntaId, alternativaId });
    setSalvando(null);
    if (!resultado.ok) {
      setRespostas(anterior);
      setErro(resultado.erro);
    }
  }

  function concluir() {
    const emBranco = perguntas.length - respondidas;
    const mensagem =
      emBranco > 0
        ? `Há ${emBranco} questão(ões) em branco. Elas contam como erro. Deseja concluir?`
        : "Concluir a prova? Não será possível refazer.";
    if (!window.confirm(mensagem)) return;
    iniciar(async () => {
      const resultado = await concluirTentativa(tentativaId);
      if (resultado && !resultado.ok) setErro(resultado.erro);
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {respondidas} de {perguntas.length} respondidas. A ordem não muda se você atualizar a página.
      </p>
      {erro ? <Aviso tom="vermelho" texto={erro} /> : null}
      {perguntas.map((pergunta, indice) => (
        <fieldset key={pergunta.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="px-2 text-sm font-semibold text-slate-900">
            Questão {indice + 1}
            {pergunta.eixo ? ` · ${pergunta.eixo}` : ""}
          </legend>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{pergunta.enunciado}</p>
          <div className="mt-4 space-y-2">
            {pergunta.alternativas.map((alternativa) => (
              <label key={alternativa.id} className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={pergunta.id}
                  value={alternativa.id}
                  checked={respostas[pergunta.id] === alternativa.id}
                  onChange={() => aoEscolher(pergunta.id, alternativa.id)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  <span className="font-medium">{alternativa.letra}.</span> {alternativa.texto}
                </span>
              </label>
            ))}
          </div>
          {salvando === pergunta.id ? (
            <p className="mt-2 text-xs text-slate-500">Salvando…</p>
          ) : null}
        </fieldset>
      ))}
      <button type="button" className={botaoPrimario} disabled={pendente} onClick={concluir}>
        {pendente ? "Concluindo…" : "Concluir prova"}
      </button>
    </div>
  );
}
