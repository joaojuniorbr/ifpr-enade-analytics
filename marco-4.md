# BUSINESS INTELLIGENCE — PROJETO INTEGRADOR

## DASHBOARD INTERATIVO — STORYTELLING DE DADOS

### ENADE Analytics — Marco 4

| **Entrega** | Até o final da Semana 16 (Marco 4) |
| --- | --- |
| **Equipe** | RevelaDados |
| **Integrantes** | Alessandro Sondey Rodrigues Lima · João Luiz Vicente Junior · Leandro Zeni |
| **Responsável principal** | Leandro Zeni |
| **Base de referência** | [Marco 3](./marco-3.md) · [Marco 2](./marco-2.md) · Guia Semana 7 (OLAP) · Briefing |
| **Data** | 27 / 10 / 2026 |

Requisitos: RF02, RF03, RF05, RF07, RF08, RNF04.

---

## 1. Objetivo do dashboard

Contar à coordenação, em linguagem simples, **onde reforçar** a preparação ao
ENADE 2026: quais eixos estão críticos, se o curso evoluiu entre simulados e se
vale focar por turma. A narrativa segue a ordem das perguntas do briefing, usando
as operações OLAP do [Anexo D do Marco 2](./marco-2.md#anexo-d--olap-e-perguntas-da-coordenação-guia-semana-7).

**História em três atos:**

1. *Diagnóstico* — eixos com pior taxa de acerto (lacunas).
2. *Tendência* — evolução entre as quatro aplicações (`CodigoSimulado`).
3. *Decisão* — turmas (incl. EAD vs presencial) e faixas, **sem identificar aluno**.

## 2. Público-alvo

Coordenação do curso de TGI (IFPR Pinhais). Leitores **sem** Power BI no dia a
dia. Rótulos em português, percentuais com uma casa decimal, cores semânticas
(vermelho &lt; 50%, amarelo abaixo da média, verde acima).

## 3. Páginas / visões do dashboard

Arquivo: [`powerbi/ENADE_Analytics.pbix`](./powerbi/ENADE_Analytics.pbix). Montagem
detalhada: [`powerbi/tutorial-marco-3.md`](./powerbi/tutorial-marco-3.md) (seções 5–8).

| **Página** | **Pergunta do briefing** | **Visualizações** |
| --- | --- | --- |
| **Resumo** | Contexto geral | 3 cartões: taxa geral (~67,4% no seed demo), nº de simulados (4), eixos em faixa Crítica (1 — Segurança) |
| **Lacunas por eixo** | 1 — pior desempenho por eixo | Barras horizontais `EixoTematico` × `[Taxa de Acerto]` (crescente); tabela com `[Faixa da Lacuna]` e `[Pct Alunos Abaixo 50%]` |
| **Evolucao** | 4 — melhora no semestre? | Colunas `CodigoSimulado` × taxa; barras agrupadas eixo × simulado |
| **Turmas** | 2 — diferença entre grupos | Colunas `TurmaGrupo` × taxa; callout EAD (~53%) vs Matutino (~75%) no demo |
| **Concentracao** *(oculta na apresentação)* | 3 — RF04 equipe | Tabela/dispersão com `CodigoAlunoAnonimo` — **não** mostrar à coordenação |

## 4. Filtros e interatividade

Segmentações (slicers) na margem direita, visíveis em todas as páginas públicas:

- `Dim_Questao_Eixo[EixoTematico]`
- `Dim_Turma[TurmaGrupo]`
- `Dim_Dificuldade[Nivel]`
- `Dim_Tempo[CodigoSimulado]`

Interação entre visuais: **filtrar** (não destacar) para manter leitura previsível.
Tooltips: eixo, taxa, faixa da lacuna, número de respostas no contexto.

Chaves técnicas (`*Key`) e `CodigoAlunoAnonimo` **ocultas** no modo Relatório (RF08).

## 5. Resumos executivos (IA generativa) — RF07

Modelo de prompt (copiar resultados para slide ou e-mail à coordenação):

> Com base na taxa de acerto por eixo do simulado ENADE Analytics, redija em até
> 120 palavras um parágrafo para a coordenação do curso de TGI, destacando os
> três eixos mais críticos, a evolução entre simulados e uma recomendação de
> reforço. Não cite nomes de estudantes.

**Exemplo (seed demo, out/2026):**

> O curso subiu de 59% (piloto) para 72% (SIM-04), com melhora em quatro aplicações.
> Segurança da informação (~34%) continua crítica; Redes e Arquitetura pedem atenção.
> A turma EAD (~53%) fica ~20 pp abaixo do Matutino (~75%) — vale combinar reforço
> temático em Segurança com acompanhamento da modalidade EAD. Demais turmas presenciais
> estão próximas (66–73%).

## 6. Arquivo do dashboard

| Item | Caminho |
| --- | --- |
| Projeto Power BI | `powerbi/ENADE_Analytics.pbix` |
| Dados (CSV) | `modelo-dimensional/powerbi/` |
| Atualizar | Abrir `.pbix` → **Página inicial → Atualizar** |

Requisitos: Power BI Desktop gratuito (RNF03). Primeira abertura: importar CSVs
conforme tutorial se o `.pbix` ainda não tiver modelo salvo.

## 7. Teste de usabilidade — RNF04

Checklist aplicado com membro da equipe simulando a coordenação:

| Pergunta ao leitor | Esperado | Resultado |
| --- | --- | --- |
| Qual eixo está pior? | Segurança da informação no topo das barras | OK |
| O curso melhorou? | SIM-02 &gt; SIM-PILOTO-01 na página Evolucao | OK |
| Precisa separar turmas? | EAD claramente abaixo; callout na página Turmas | OK |
| Vê nome de aluno? | Não, nas páginas públicas | OK |

Pendência: repetir com representante real da coordenação na Semana 19–20 e registrar
data no [entrega-final](./entrega-final.md).

## 8. Aprovação

| **Assinatura dos integrantes da equipe** | **Aprovação da professora orientadora** |
| --- | --- |
| Alessandro Sondey Rodrigues Lima — ____________________ | Lauriana Paludo |
| João Luiz Vicente Junior — ____________________ | Data: ____ / ____ / 2026 |
| Leandro Zeni — ____________________ | |
