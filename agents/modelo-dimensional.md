# Modelo dimensional (Kimball + Guia Semana 7)

Grão: **1 resposta de 1 aluno anônimo a 1 questão em 1 aplicação de simulado**.

Esquema alinhado ao **Guia do Projeto — Unidade 3** (Data Warehouse e OLAP):

| Guia (PDF) | Tabela / coluna no projeto |
| --- | --- |
| `Fato_Respostas` | `Acertou`, `TempoRespostaSegundos`, FKs abaixo |
| `Dim_Tempo` | `TempoKey`, `Data`, `NumeroSimulado`, `SemanaSemestre` |
| `Dim_Questao_Eixo` | `QuestaoEixoKey`, `EixoTematico`, `Enunciado` |
| `Dim_Dificuldade` | `DificuldadeKey`, `Nivel` (Fácil/Médio/Difícil) |
| `Dim_Turma` | `TurmaKey`, `TurmaGrupo` — sem PII |

`Dim_Aluno_Anonimo` existe para **drill-down interno** (RF04); o dashboard da
coordenação não exibe código de aluno (RF08).

`NumeroSimulado` / `CodigoSimulado` ficam em `Dim_Tempo` (não há `Dim_Simulado`
separada no guia).

Relacionamentos 1:\*, filtro unidirecional dimensão → fato.

Medidas no Power BI: `Total Respostas`, `Total Acertos`, `Taxa de Acerto`,
`Alunos Participantes`. Tutorial: `powerbi/tutorial-marco-3.md`.

Arquivos: `esquema-estrela.sql`, `.dbml`, `powerbi/*.csv`, `gerar_seed.py`,
`carga.sql`. Seed **sintético**.

16 eixos = Portaria Inep nº 171/2026 Art. 6º (Anexo B de `marco-2.md`).

Operacional (app web): `Alternativa`, `Simulado_Questao`, `Tentativa` referenciam
`QuestaoEixoKey` e `TempoKey`.
