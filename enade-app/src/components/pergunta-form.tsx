"use client";

import { useActionState, useState } from "react";
import { salvarPergunta } from "@/app/admin/perguntas/actions";
import { Aviso } from "@/components/aviso";
import { EIXOS, NIVEIS } from "@/lib/eixos";
import { botaoPrimario, botaoSecundario, campo } from "@/lib/estilos";
import { estadoInicial } from "@/lib/formularios";

type AlternativaForm = { id?: string; texto: string; correta: boolean };

const vazias: AlternativaForm[] = [
  { texto: "", correta: true },
  { texto: "", correta: false },
  { texto: "", correta: false },
  { texto: "", correta: false },
];

export function PerguntaForm({
  inicial,
}: {
  inicial?: {
    id: string;
    enunciado: string;
    eixo: string;
    tema: string;
    nivel: string;
    ativa: boolean;
    usada: boolean;
    alternativas: AlternativaForm[];
  };
}) {
  const [estado, acao, pendente] = useActionState(salvarPergunta, estadoInicial);
  const [alternativas, setAlternativas] = useState<AlternativaForm[]>(
    inicial?.alternativas.length ? inicial.alternativas : vazias,
  );
  const usada = inicial?.usada ?? false;

  function atualizarTexto(indice: number, texto: string) {
    setAlternativas((atual) => atual.map((item, i) => (i === indice ? { ...item, texto } : item)));
  }

  function marcarCorreta(indice: number) {
    setAlternativas((atual) => atual.map((item, i) => ({ ...item, correta: i === indice })));
  }

  function adicionar() {
    setAlternativas((atual) =>
      atual.length >= 8 ? atual : [...atual, { texto: "", correta: false }],
    );
  }

  function remover(indice: number) {
    setAlternativas((atual) => {
      if (atual.length <= 2) return atual;
      const proxima = atual.filter((_, i) => i !== indice);
      if (!proxima.some((item) => item.correta) && proxima[0]) {
        proxima[0] = { ...proxima[0], correta: true };
      }
      return proxima;
    });
  }

  return (
    <form action={acao} className="space-y-4">
      <input type="hidden" name="id" value={inicial?.id ?? ""} />
      {estado.erro ? <Aviso tom="vermelho" texto={estado.erro} /> : null}
      {usada ? (
        <Aviso
          tom="ambar"
          texto="Esta pergunta já entrou em uma tentativa. A nota já registrada não muda. Dá para editar os textos, mas não incluir ou remover alternativas."
        />
      ) : null}

      <label className="block space-y-2 text-sm font-medium text-slate-700">
        Enunciado
        <textarea
          name="enunciado"
          required
          rows={5}
          defaultValue={inicial?.enunciado ?? ""}
          className={campo}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Eixo
          <select name="eixo" defaultValue={inicial?.eixo ?? ""} className={campo}>
            <option value="">Sem eixo</option>
            {EIXOS.map((eixo) => (
              <option key={eixo} value={eixo}>
                {eixo}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Tema
          <input
            name="tema"
            defaultValue={inicial?.tema ?? ""}
            maxLength={120}
            className={campo}
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Dificuldade
          <select name="nivel" defaultValue={inicial?.nivel ?? ""} className={campo}>
            <option value="">Sem nível</option>
            {NIVEIS.map((nivel) => (
              <option key={nivel.valor} value={nivel.valor}>
                {nivel.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">
          Alternativas (marque a correta)
        </legend>
        {alternativas.map((alternativa, indice) => (
          <div key={alternativa.id ?? indice} className="flex items-start gap-2">
            <input type="hidden" name="alternativaId" value={alternativa.id ?? ""} />
            <input
              type="radio"
              name="correta"
              value={indice}
              checked={alternativa.correta}
              onChange={() => marcarCorreta(indice)}
              className="mt-3 h-4 w-4"
              aria-label={`Alternativa ${indice + 1} correta`}
            />
            <input
              name="texto"
              value={alternativa.texto}
              onChange={(evento) => atualizarTexto(indice, evento.target.value)}
              className={campo}
              aria-label={`Texto da alternativa ${indice + 1}`}
            />
            {usada ? null : (
              <button
                type="button"
                className={botaoSecundario}
                onClick={() => remover(indice)}
                disabled={alternativas.length <= 2}
              >
                Remover
              </button>
            )}
          </div>
        ))}
        {usada ? null : (
          <button type="button" className={botaoSecundario} onClick={adicionar}>
            Adicionar alternativa
          </button>
        )}
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="hidden" name="ativa" value="false" />
        <input
          type="checkbox"
          name="ativa"
          value="true"
          defaultChecked={inicial?.ativa ?? true}
          className="h-4 w-4"
        />
        Pergunta ativa
      </label>

      <button type="submit" className={botaoPrimario} disabled={pendente}>
        {pendente ? "Salvando…" : "Salvar pergunta"}
      </button>
    </form>
  );
}
