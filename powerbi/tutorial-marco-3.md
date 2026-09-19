# Tutorial Power BI Desktop — mineração do Marco 3

Passo a passo para montar no **Power BI Desktop** o que o Marco 3 pede: lacunas
por eixo, concentradas vs distribuídas e evolução entre simulados. Nomes de menu
em **português do Brasil**.

Valores de conferência do seed atual: taxa geral **64,1%**; Segurança da
informação **27,1%**; SIM-PILOTO-01 **56,0%** → SIM-02 **72,1%**.

---

## 1. Importar o esquema estrela

1. Abra o Power BI Desktop (arquivo em branco).
2. **Página inicial → Obter dados → Texto/CSV**.
3. Importe, um a um, os arquivos de `modelo-dimensional/powerbi/`:
   - `Dim_Tempo.csv`
   - `Dim_Aluno_Anonimo.csv`
   - `Dim_Questao.csv`
   - `Dim_Simulado.csv`
   - `Fato_Respostas.csv`
4. Em cada importação, clique **Transformar dados** (não Carregar ainda).

No Power Query, confira os tipos (coluna → **Tipo de dados**):

| Tabela            | Coluna                                          | Tipo           |
| ----------------- | ----------------------------------------------- | -------------- |
| Dim_Tempo         | TempoKey, Ano, Mes, SemanaSemestre              | Número inteiro |
| Dim_Tempo         | Data                                            | Data           |
| Dim_Aluno_Anonimo | AlunoKey                                        | Número inteiro |
| Dim_Questao       | QuestaoKey                                      | Número inteiro |
| Dim_Simulado      | SimuladoKey, NumeroAplicacao                    | Número inteiro |
| Fato_Respostas    | todas as `*Key`, Acertou, TempoRespostaSegundos | Número inteiro |
| Fato_Respostas    | RespostaDada                                    | Texto          |

`Acertou` tem de ser inteiro 0/1, **não** verdadeiro/falso.

**Página inicial → Fechar e aplicar.**

## 2. Ligar o modelo (visão Modelo)

1. Ícone **Modelo** (lado esquerdo).
2. Arraste as chaves da fato para as dimensões (ou **Gerenciar relações**):

| De (fato)                   | Para (dimensão)             | Cardinalidade  | Filtro cruzado          |
| --------------------------- | --------------------------- | -------------- | ----------------------- |
| Fato_Respostas[TempoKey]    | Dim_Tempo[TempoKey]         | Muitos para um | Única (dimensão → fato) |
| Fato_Respostas[AlunoKey]    | Dim_Aluno_Anonimo[AlunoKey] | Muitos para um | Única                   |
| Fato_Respostas[QuestaoKey]  | Dim_Questao[QuestaoKey]     | Muitos para um | Única                   |
| Fato_Respostas[SimuladoKey] | Dim_Simulado[SimuladoKey]   | Muitos para um | Única                   |

Fato no centro, quatro dimensões ao redor. **Arquivo → Captura de tela** desta
visão: é a imagem da Seção 3 do Marco 2
(`modelo-dimensional/diagrama-powerbi.png`).

Oculte as colunas `*Key` da fato no relatório (botão direito → **Ocultar no modo
Relatório**), para a coordenação não ver chaves técnicas.

## 3. Medidas DAX (Marco 2 + mineração)

**Modelagem → Nova medida.** Cole uma de cada vez na tabela `Fato_Respostas`.

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

Medidas extras do Marco 3:

```dax
Taxa Geral =
CALCULATE(
    [Taxa de Acerto],
    ALL(Dim_Questao),
    ALL(Dim_Aluno_Anonimo),
    ALL(Dim_Simulado),
    ALL(Dim_Tempo)
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

Formate **Taxa de Acerto**, **Taxa Geral** e **Pct Alunos Abaixo 50%** como
**Porcentagem** (1 casa decimal).

## 4. Página 1 — lacunas por eixo (pergunta 1)

Renomeie a página para `Lacunas por eixo`.

1. **Cartão**: campo `[Taxa de Acerto]` — conferir **64,1%**.
2. **Cartão**: `[Alunos Participantes]` — conferir **12**.
3. **Gráfico de barras** (horizontal):
   - Eixo Y: `Dim_Questao[EixoTematico]`
   - Eixo X: `[Taxa de Acerto]`
   - **… do visual → Classificar eixo → Taxa de Acerto → Crescente** (pior em
     cima)
4. **Tabela**:
   - `EixoTematico`, `[Taxa de Acerto]`, `[Faixa da Lacuna]`,
     `[Pct Alunos Abaixo 50%]`
5. Formatação condicional na taxa: vermelho &lt; 50%, amarelo &lt; taxa geral,
   verde no restante (**Ferramentas da tabela → Formatação condicional**).

Segurança da informação deve aparecer por último na barra (ou primeiro, se
ordenado crescente no topo): **27,1%**, faixa Crítica, ~**75%** dos alunos
abaixo de 50%.

## 5. Página 2 — concentradas vs distribuídas (RF04)

Renomeie para `Concentracao`.

**Não use essa página na apresentação para a coordenação com código de aluno
visível.** Sirva só para a equipe concluir o RF04; no Marco 4 a visão pública
fica só no % abaixo de 50% por eixo.

1. **Tabela da equipe** (depois oculte a página ou tire o código):
   - `Dim_Aluno_Anonimo[CodigoAlunoAnonimo]`
   - `Dim_Aluno_Anonimo[TurmaGrupo]`
   - `[Taxa de Acerto]`
   - Classificar pela taxa crescente. Amplitude esperada: ~53% a ~75%.
2. **Gráfico de dispersão** (mineração visual):
   - Eixo X: `[Taxa de Acerto]`
   - Eixo Y: `[Total Respostas]`
   - Legenda / detalhes: `CodigoAlunoAnonimo`
   - Painel **Análises** (ícone de lupa) → **Localizar clusters** → **3**
     clusters → **OK**.
   - Os três grupos equivalem aos tercis baixo / médio / alto (~4 alunos cada).
3. **Gráfico de colunas**:
   - Eixo: `Dim_Aluno_Anonimo[TurmaGrupo]`
   - Valor: `[Taxa de Acerto]`
   - Esperado: TGI Noturno A ~**63,3%**, B ~**64,8%** (sem diferença material).

Leitura para o relatório: se **Pct Alunos Abaixo 50%** no eixo Segurança está
alto (~75%), a lacuna é **de turma**. Se a dispersão de alunos no geral é
pequena (53–75%), **não** há um bolsão de poucos alunos puxando o curso.

## 6. Página 3 — evolução (RF05)

Renomeie para `Evolucao`.

1. **Gráfico de colunas agrupadas**:
   - Eixo: `Dim_Simulado[CodigoSimulado]` (ou `NumeroAplicacao`)
   - Valor: `[Taxa de Acerto]`
   - Esperado: SIM-PILOTO-01 **56,0%**, SIM-02 **72,1%**.
2. **Gráfico de barras agrupadas**:
   - Eixo Y: `Dim_Questao[EixoTematico]`
   - Legenda: `Dim_Simulado[CodigoSimulado]`
   - Valor: `[Taxa de Acerto]`
   - Conferir Segurança quase parada (~25% → ~29%) e Algoritmos/Governança com
     salto grande.

Filtro da página (opcional): segmentação de `NivelDificuldade`.

## 7. Capturas para a apresentação e para o Marco 3

Tire print (ou **Inserir → Imagem** no Word/Google Doc):

1. Visão **Modelo** (estrela) — também serve ao Marco 2.
2. Página Lacunas por eixo (barras ordenadas).
3. Tabela eixo + faixa + % alunos &lt; 50%.
4. Clusters no gráfico de dispersão (página da equipe).
5. Colunas SIM-PILOTO-01 vs SIM-02.

Cole as conclusões em `marco-3.md` só depois de conferir os números na tela. Com
dados reais do piloto, os percentuais mudam; o método é o mesmo.

## 8. O que não fazer

- Não criar `Dim_Eixo` (eixo já está em `Dim_Questao`).
- Não colocar taxa de acerto como coluna calculada na fato.
- Não deixar nome, e-mail ou RA no modelo.
- Não mostrar `CodigoAlunoAnonimo` no dashboard da coordenação (RF08).
- Não usar Python, R nem visual customizado pago.
