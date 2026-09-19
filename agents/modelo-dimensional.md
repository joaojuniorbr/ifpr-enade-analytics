# Modelo dimensional (Kimball)

Grão: **1 resposta de 1 aluno anônimo a 1 questão em 1 aplicação de simulado**.

Estrela (não floco de neve): fato no centro, eixo e dificuldade **atributos** de
`Dim_Questao` (não criar `Dim_Eixo`).

| Tabela | Função |
| --- | --- |
| `Fato_Respostas` | `Acertou` 0/1 aditivo, `RespostaDada`, `TempoRespostaSegundos` |
| `Dim_Tempo` | `TempoKey` sequencial, Data (YYYY-MM-DD), Ano, Mes, NomeMes, SemanaSemestre |
| `Dim_Aluno_Anonimo` | `CodigoAlunoAnonimo`, `TurmaGrupo` — sem PII |
| `Dim_Questao` | `EixoTematico` (16 oficiais), `NivelDificuldade` (Fácil/Médio/Difícil) |
| `Dim_Simulado` | `CodigoSimulado`, `NumeroAplicacao`, `DescricaoSimulado` |

Relacionamentos 1:\*, filtro unidirecional dimensão → fato.

**Não armazenar taxa de acerto.** Medidas no Power BI Desktop: `Total Respostas`,
`Total Acertos`, `Taxa de Acerto` (`DIVIDE`), `Alunos Participantes`
(`DISTINCTCOUNT`). Tutorial de mineração: `powerbi/tutorial-marco-3.md`.

Arquivos: `modelo-dimensional/esquema-estrela.sql`, `.dbml`,
`powerbi/*.csv`, `gerar_seed.py`. Seed é **sintético**, não coleta real.

O `.sql` usa `VARCHAR` (não `TEXT`) em colunas `UNIQUE`/`INDEX` para o MySQL
não disparar o erro 1170. `TempoKey` é inteiro sequencial (não YYYYMMDD, que o
MySQL trata como data). `TempoRespostaSegundos` é inteiro (ponto decimal quebra
o import no locale pt-BR).

Caminho mais seguro no MySQL: rodar `esquema-estrela.sql` e depois `carga.sql`
(INSERTs). Os `DROP TABLE IF EXISTS` no topo recriam as tabelas se uma execução
anterior tiver falhado no meio.

Os 16 eixos (Portaria Inep nº 171/2026, Art. 6º) estão listados em
`marco-2.md` Anexo B. Não inventar eixos.
