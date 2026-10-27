# Tutorial Power BI Desktop — mineração (Marco 3) e dashboard (Marco 4)

Passo a passo para montar no **Power BI Desktop** o esquema do **Guia Semana 7**
e as análises OLAP do briefing. Menus em **português do Brasil**.

Conferência do seed demo (`gerar_seed.py --demo`): taxa geral **67,4%**;
Segurança da informação **34,0%**; SIM-PILOTO-01 **58,9%** → SIM-04 **72,0%**
(4 aplicações; 36 alunos; 6 turmas).

---

## 1. Importar o esquema estrela

1. Abra o Power BI Desktop (arquivo em branco ou `powerbi/ENADE_Analytics.pbix`).
2. **Página inicial → Obter dados → Texto/CSV**.
3. Importe, um a um, os arquivos de `modelo-dimensional/powerbi/`:
   - `Dim_Dificuldade.csv`
   - `Dim_Turma.csv`
   - `Dim_Tempo.csv`
   - `Dim_Questao_Eixo.csv`
   - `Dim_Aluno_Anonimo.csv`
   - `Fato_Respostas.csv`
4. Em cada importação, clique **Transformar dados** (não Carregar ainda).

Tipos no Power Query:

| Tabela | Colunas inteiras |
| --- | --- |
| Todas as dimensões | `*Key` |
| Dim_Tempo | `NumeroSimulado`, `Ano`, `Mes`, `SemanaSemestre` |
| Dim_Tempo | `Data` → **Data** |
| Fato_Respostas | `*Key`, `Acertou`, `TempoRespostaSegundos` |
| Fato_Respostas | `RespostaDada` → **Texto** |

`Acertou` deve ser **Número inteiro** 0/1.

**Fechar e aplicar.**

## 2. Relacionamentos (visão Modelo)

Fato no centro. **Gerenciar relações**:

| Fato | Dimensão | Cardinalidade |
| --- | --- | --- |
| `TempoKey` | `Dim_Tempo` | Muitos → um |
| `QuestaoEixoKey` | `Dim_Questao_Eixo` | Muitos → um |
| `DificuldadeKey` | `Dim_Dificuldade` | Muitos → um |
| `TurmaKey` | `Dim_Turma` | Muitos → um |
| `AlunoKey` | `Dim_Aluno_Anonimo` | Muitos → um |

Filtro cruzado **Única** (dimensão → fato). Capture a tela para
`modelo-dimensional/diagrama-powerbi.png` (Marco 2).

Oculte colunas `*Key` da fato no relatório.

## 3. Medidas DAX

Crie na tabela `Fato_Respostas`:

```dax
Total Respostas = COUNTROWS(Fato_Respostas)
```

```dax
Total Acertos = SUM(Fato_Respostas[Acertou])
```

```dax
Taxa de Acerto = DIVIDE([Total Acertos], [Total Respostas], 0)
```

```dax
Alunos Participantes = DISTINCTCOUNT(Fato_Respostas[AlunoKey])
```

```dax
Taxa Geral =
CALCULATE(
    [Taxa de Acerto],
    ALL(Dim_Questao_Eixo),
    ALL(Dim_Dificuldade),
    ALL(Dim_Turma),
    ALL(Dim_Tempo),
    ALL(Dim_Aluno_Anonimo)
)
```

```dax
Alunos Abaixo de 50% =
VAR PorAluno =
    ADDCOLUMNS(
        VALUES(Dim_Aluno_Anonimo[AlunoKey]),
        "TaxaAluno", CALCULATE([Taxa de Acerto])
    )
RETURN
    COUNTROWS(FILTER(PorAluno, [TaxaAluno] < 0.5))
```

```dax
Pct Alunos Abaixo 50% =
DIVIDE([Alunos Abaixo de 50%], [Alunos Participantes], 0)
```

```dax
Faixa da Lacuna =
VAR T = [Taxa de Acerto]
RETURN
    SWITCH(
        TRUE(),
        ISBLANK(T), BLANK(),
        T < 0.50, "Crítica",
        T < [Taxa Geral], "Atenção",
        T >= 0.80, "Força",
        "Ok"
    )
```

Formate percentuais com 1 casa decimal.

## 4. OLAP × perguntas do briefing (Guia Semana 7)

| Pergunta | Operação OLAP | O que fazer no Desktop |
| --- | --- | --- |
| Pior desempenho por eixo | **Slice / roll-up** por `EixoTematico` | Barras horizontais com `[Taxa de Acerto]` |
| Diferença entre turmas | **Dice / slice** por `TurmaGrupo` | Colunas por turma |
| Lacunas concentradas? | **Drill-down** aluno anônimo (equipe) | Dispersão + clusters; coordenação vê só `% abaixo 50%` |
| Evolução no semestre | **Drill-down/roll-up** em `Dim_Tempo` | Colunas por `CodigoSimulado` ou `NumeroSimulado` |

## 5. Página `Lacunas por eixo` (pergunta 1)

1. Cartões: `[Taxa de Acerto]` (~67,4%), `[Alunos Participantes]` (36), simulados (4).
2. Barras: eixo Y `Dim_Questao_Eixo[EixoTematico]`, eixo X `[Taxa de Acerto]`, ordenar crescente.
3. Tabela: eixo, taxa, `[Faixa da Lacuna]`, `[Pct Alunos Abaixo 50%]`.

## 6. Página `Concentracao` (RF04 — só equipe)

1. Tabela com `CodigoAlunoAnonimo`, `Dim_Turma[TurmaGrupo]`, `[Taxa de Acerto]`.
2. Dispersão + **Análises → Localizar clusters (3)**.
3. Colunas por `TurmaGrupo` (ex.: EAD ~53% vs Matutino ~75% no demo).

**Ocultar** esta página na apresentação à coordenação.

## 7. Página `Evolucao` (RF05)

1. Colunas: `Dim_Tempo[CodigoSimulado]` × `[Taxa de Acerto]`.
2. Barras agrupadas: eixo × simulado.
3. Filtro opcional: `Dim_Dificuldade[Nivel]`.

## 8. Marco 4 — storytelling para a coordenação

Ordem sugerida das páginas públicas:

1. **Resumo** — cartões (taxa geral, simulados aplicados, eixos críticos).
2. **Lacunas por eixo** — barras ordenadas (Segurança no topo).
3. **Evolucao** — linha ou colunas por `CodigoSimulado` (4 aplicações).
4. **Turmas** — comparar `TurmaGrupo` (no demo, EAD bem abaixo das presenciais).

Segmentações: `EixoTematico`, `TurmaGrupo`, `Nivel`, `CodigoSimulado`.

Não exibir `CodigoAlunoAnonimo` nem `AlunoKey` (RF08).

## 9. Atualizar dados

Após novo simulado: exportar CSVs (ou `python3 gerar_seed.py --demo` / ETL) →
**Atualizar** no Desktop.

## 10. O que não fazer

- Não persistir taxa de acerto na fato.
- Não usar ferramentas pagas.
- Não expor PII no relatório da coordenação.
