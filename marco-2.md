# BUSINESS INTELLIGENCE — PROJETO INTEGRADOR

## MODELO DE DADOS (DW)

### ENADE Analytics — Marco 2

Este documento é o entregável do Marco 2 do Projeto Integrador. Ele formaliza o
modelo dimensional construído para o banco de questões/respostas do simulado
ENADE. As seções 1 a 8 seguem o template oficial da disciplina. Preenchido com o
modelo efetivamente definido e materializado em `modelo-dimensional/` (SQL, DBML
e CSVs). A captura da visão **Modelo** do Power BI ainda deve ser colada na
Seção 3 após a implementação no Desktop.

| **Entrega**            | Até o final da Semana 8 (Marco 2)                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Equipe**             | RevelaDados                                                                                                              |
| **Integrantes**        | • Alessandro Sondey Rodrigues Lima <br> • João Luiz Vicente Junior <br> • Leandro Zeni                                   |
| **Base de referência** | [Termo de Abertura (Marco 0)](./marco-0.md) e [Matriz de Requisitos (Marco 1)](./marco-1.md) · Portaria Inep nº 171/2026 |
| **Data**               | 10 / 09 / 2026                                                                                                           |

---

## 1. Grão da tabela fato

Cada registro da `Fato_Respostas` representa **1 resposta, de 1 aluno anônimo, a
1 questão, em 1 tentativa/aplicação de simulado**.

Esse nível de detalhe permite analisar desempenho por eixo, turma/grupo e
período sem armazenar identificadores pessoais diretos. A taxa de acerto **não é
um fato armazenado**: é calculada na consulta
(`SUM(Acertou) / COUNT(respostas)`).

## 2. Esquema estrela implementado

Tabelas e campos do modelo dimensional (Power BI / CSVs em
`modelo-dimensional/powerbi/`).

| **Tabela**              | **Campos**                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Fato (`Fato_Respostas`) | `RespostaKey`; `TempoKey`; `AlunoKey`; `QuestaoKey`; `SimuladoKey`; `RespostaDada`; `Acertou`; `TempoRespostaSegundos` |
| Dim_Tempo               | `TempoKey`; `Data`; `Ano`; `Mes`; `NomeMes`; `SemanaSemestre`                                                          |
| Dim_Aluno_Anonimo       | `AlunoKey`; `CodigoAlunoAnonimo`; `TurmaGrupo`                                                                         |
| Dim_Questao             | `QuestaoKey`; `CodigoQuestao`; `EixoTematico`; `NivelDificuldade`                                                      |
| Dim_Simulado            | `SimuladoKey`; `CodigoSimulado`; `NumeroAplicacao`; `DescricaoSimulado`                                                |

Relacionamentos: cada dimensão se liga à fato pela chave substituta (`TempoKey`,
`AlunoKey`, `QuestaoKey`, `SimuladoKey`). Cardinalidade **1:\***, filtro
**unidirecional** da dimensão para a fato.

`NivelDificuldade`: Fácil, Médio ou Difícil. `EixoTematico`: um dos 16 objetos
de conhecimento do Art. 6º da Portaria Inep nº 171/2026 (lista no Anexo B).

## 3. Diagrama do esquema estrela

**Entrega oficial:** colar aqui a captura de tela da visão **Modelo** do Power
BI (fato no centro, dimensões ao redor, linhas de relacionamento visíveis).

Arquivo previsto: `modelo-dimensional/diagrama-powerbi.png` (ainda não gerado —
depende da implementação no Power BI Desktop).

Diagrama conceitual equivalente, para conferência enquanto a captura não existe:

```mermaid
erDiagram
    Dim_Tempo ||--o{ Fato_Respostas : TempoKey
    Dim_Aluno_Anonimo ||--o{ Fato_Respostas : AlunoKey
    Dim_Questao ||--o{ Fato_Respostas : QuestaoKey
    Dim_Simulado ||--o{ Fato_Respostas : SimuladoKey

    Fato_Respostas {
        int RespostaKey PK
        int TempoKey FK
        int AlunoKey FK
        int QuestaoKey FK
        int SimuladoKey FK
        string RespostaDada
        int Acertou
        int TempoRespostaSegundos
    }

    Dim_Tempo {
        int TempoKey PK
        date Data
        int Ano
        int Mes
        string NomeMes
        int SemanaSemestre
    }

    Dim_Aluno_Anonimo {
        int AlunoKey PK
        string CodigoAlunoAnonimo
        string TurmaGrupo
    }

    Dim_Questao {
        int QuestaoKey PK
        string CodigoQuestao
        string EixoTematico
        string NivelDificuldade
    }

    Dim_Simulado {
        int SimuladoKey PK
        string CodigoSimulado
        int NumeroAplicacao
        string DescricaoSimulado
    }
```

## 4. Dicionário de dados completo

| **Tabela**        | **Campo/Medida**      | **Tipo**      | **Descrição**                                                                         |
| ----------------- | --------------------- | ------------- | ------------------------------------------------------------------------------------- |
| Fato_Respostas    | RespostaKey           | Inteiro (PK)  | Chave técnica única de cada resposta registrada.                                      |
| Fato_Respostas    | TempoKey              | Inteiro (FK)  | Relaciona a resposta à Dim_Tempo.                                                     |
| Fato_Respostas    | AlunoKey              | Inteiro (FK)  | Relaciona a resposta ao aluno anonimizado.                                            |
| Fato_Respostas    | QuestaoKey            | Inteiro (FK)  | Relaciona a resposta à questão respondida.                                            |
| Fato_Respostas    | SimuladoKey           | Inteiro (FK)  | Relaciona a resposta à aplicação do simulado.                                         |
| Fato_Respostas    | RespostaDada          | Texto         | Alternativa/resposta registrada pelo participante.                                    |
| Fato_Respostas    | Acertou               | Inteiro (0/1) | Contador aditivo: 1 para resposta correta e 0 para incorreta.                         |
| Fato_Respostas    | TempoRespostaSegundos | Inteiro       | Tempo gasto na resposta, em segundos inteiros (sem decimal).                           |
| Dim_Tempo         | TempoKey              | Inteiro (PK)  | Chave substituta da dimensão de tempo (1, 2, …).                                       |
| Dim_Tempo         | Data                  | Data          | Data da aplicação/resposta.                                                           |
| Dim_Tempo         | Ano                   | Inteiro       | Ano da aplicação.                                                                     |
| Dim_Tempo         | Mes                   | Inteiro       | Número do mês.                                                                        |
| Dim_Tempo         | NomeMes               | Texto         | Nome do mês para agrupamentos e ordenação.                                            |
| Dim_Tempo         | SemanaSemestre        | Inteiro       | Semana do semestre, usada para acompanhar evolução temporal.                          |
| Dim_Aluno_Anonimo | AlunoKey              | Inteiro (PK)  | Chave substituta do participante no DW.                                               |
| Dim_Aluno_Anonimo | CodigoAlunoAnonimo    | Texto         | Código sem identificação direta (ex.: `Aluno_014`).                                   |
| Dim_Aluno_Anonimo | TurmaGrupo            | Texto         | Turma ou grupo de análise, sem nome nominal.                                          |
| Dim_Questao       | QuestaoKey            | Inteiro (PK)  | Chave substituta da questão.                                                          |
| Dim_Questao       | CodigoQuestao         | Texto         | Identificador interno da questão do banco de simulados.                               |
| Dim_Questao       | EixoTematico          | Texto         | Objeto de conhecimento do componente específico (Portaria Inep nº 171/2026, Art. 6º). |
| Dim_Questao       | NivelDificuldade      | Texto         | Classificação da equipe: Fácil, Médio ou Difícil.                                     |
| Dim_Simulado      | SimuladoKey           | Inteiro (PK)  | Chave substituta da aplicação do simulado.                                            |
| Dim_Simulado      | CodigoSimulado        | Texto         | Código ou nome curto do simulado.                                                     |
| Dim_Simulado      | NumeroAplicacao       | Inteiro       | Ordem da aplicação ao longo do semestre.                                              |
| Dim_Simulado      | DescricaoSimulado     | Texto         | Descrição da aplicação do simulado.                                                   |
| Medida            | Total Respostas       | DAX           | `COUNTROWS(Fato_Respostas)`                                                           |
| Medida            | Total Acertos         | DAX           | `SUM(Fato_Respostas[Acertou])`                                                        |
| Medida            | Taxa de Acerto        | DAX           | `DIVIDE([Total Acertos], [Total Respostas], 0)`                                       |
| Medida            | Alunos Participantes  | DAX           | `DISTINCTCOUNT(Fato_Respostas[AlunoKey])`                                             |

## 5. Medidas DAX documentadas (mínimo de 3)

| **Nome da medida**   | **Fórmula DAX**                                 | **O que calcula**                                                           |
| -------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Total Respostas      | `COUNTROWS(Fato_Respostas)`                     | Conta o total de respostas registradas no contexto de filtro.               |
| Total Acertos        | `SUM(Fato_Respostas[Acertou])`                  | Soma os acertos (1) das respostas selecionadas.                             |
| Taxa de Acerto       | `DIVIDE([Total Acertos], [Total Respostas], 0)` | Calcula a proporção de acertos por eixo, turma, simulado ou período.        |
| Alunos Participantes | `DISTINCTCOUNT(Fato_Respostas[AlunoKey])`       | Conta quantos alunos anônimos distintos participaram no contexto analisado. |

A mesma `Taxa de Acerto` responde às perguntas 1, 2 e 4 do briefing (eixo,
turma/grupo, evolução). `Alunos Participantes` apoia a pergunta 3 (lacunas
concentradas versus distribuídas), detalhada no [Marco 3](./marco-3.md).

## 6. Conformidade com a LGPD

Marcado com X o compromisso da equipe, referente ao que foi assumido no Marco 1:

- [x] Nenhuma dimensão do modelo contém nome, CPF, e-mail ou outro identificador
      direto do estudante.
- [x] Os dados foram anonimizados (código do aluno, não o dado original) antes
      da modelagem dimensional.
- [ ] O termo de consentimento (TCLE simplificado, Marco 1) foi aplicado a todos
      os participantes do simulado-piloto antes da coleta.

O terceiro item permanece aberto até a coleta real do simulado-piloto. O texto
do termo está em [termo-lgpd.md](./termo-lgpd.md). O seed em
`modelo-dimensional/powerbi/` já usa apenas `CodigoAlunoAnonimo` (ex.:
`Aluno_014`).

## 7. Rastreabilidade com a Matriz de Requisitos (Marco 1)

| **ID do requisito** | **Como este modelo atende ao requisito**                                                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF01                | `Dim_Questao` armazena `EixoTematico` e `NivelDificuldade`, permitindo classificar e filtrar as questões do simulado.                                          |
| RF02                | O fato `Acertou` (0/1), associado a `Dim_Questao`, alimenta a medida `Taxa de Acerto` (desempenho médio por eixo).                                             |
| RF03                | `Dim_Aluno_Anonimo.TurmaGrupo` permite comparar desempenho entre turmas ou grupos, sem identificar estudantes.                                                 |
| RF04                | `CodigoAlunoAnonimo` + `DISTINCTCOUNT` de `AlunoKey` permitem ver se as lacunas estão concentradas ou distribuídas, sem nome nominal. Detalhamento no Marco 3. |
| RF05                | `Dim_Tempo` e `Dim_Simulado` (`NumeroAplicacao`) permitem comparar aplicações e acompanhar a evolução no semestre.                                             |
| RF06                | `Fato_Respostas` registra cada resposta ligada a eixo (`Dim_Questao`) e turma (`Dim_Aluno_Anonimo`), no grão da Seção 1.                                       |
| RF08                | O esquema não expõe indivíduo identificável; o dashboard consome apenas agregações por turma/eixo.                                                             |
| RNF01               | Apenas `CodigoAlunoAnonimo`; não há nome, CPF, e-mail ou identificador direto nas dimensões analíticas.                                                        |
| RNF02               | A inclusão no dataset exige TCLE assinado; o checklist da Seção 6 registra a validação na coleta.                                                              |

RF07 (resumos executivos com IA) e RNF04 (usabilidade do dashboard) são
atendidos nos marcos seguintes; este DW fornece as métricas agregadas de
entrada.

---

## Anexo A — Quatro passos de Kimball (Semana 5)

| **Passo**               | **Decisão do projeto**                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Processo de negócio  | Avaliação do desempenho dos concluintes nos simulados preparatórios para o ENADE 2026 (prova em 29/11/2026), por eixo temático, turma/grupo, simulado e período. |
| 2. Granularidade (grão) | 1 resposta de 1 aluno anônimo a 1 questão em 1 tentativa/aplicação de simulado.                                                                                  |
| 3. Dimensões            | `Dim_Tempo`; `Dim_Aluno_Anonimo`; `Dim_Questao`; `Dim_Simulado`.                                                                                                 |
| 4. Fatos                | `Acertou` (0/1), `RespostaDada` e `TempoRespostaSegundos`. Taxa de acerto só na consulta.                                                                        |

## Anexo B — Eixos do componente específico (Portaria Inep nº 171/2026, Art. 6º)

Três níveis de dificuldade: Fácil, Médio e Difícil.

| **#** | **Eixo temático (Art. 6º)**              |
| ----- | ---------------------------------------- |
| I     | Algoritmos                               |
| II    | Arquitetura de computadores              |
| III   | Sistemas operacionais                    |
| IV    | Banco de dados                           |
| V     | Engenharia de software                   |
| VI    | Gerência de projetos                     |
| VII   | Gestão de pessoas                        |
| VIII  | Gestão dos serviços de TI                |
| IX    | Tecnologias para inteligência de negócio |
| X     | Governança de tecnologia da informação   |
| XI    | Gestão estratégica organizacional        |
| XII   | Processos organizacionais                |
| XIII  | Redes de computadores                    |
| XIV   | Segurança da informação                  |
| XV    | Sistemas de informações gerenciais       |
| XVI   | Ética, tecnologia e sociedade            |

O componente específico oficial tem 30 questões objetivas e 1 discursiva (Art.
3º). O seed do piloto usa 2 questões por eixo (32 objetivas) para cobrir os 16
objetos sem remodelar o grão.

## Anexo C — ETL / carga no Power BI

Ferramentas gratuitas apenas (RNF03): Microsoft Forms, planilhas e Power BI
Desktop.

1. **Extração** — banco de questões (eixo e dificuldade) em planilha; respostas
   via Forms. Seed de desenvolvimento: CSVs em `modelo-dimensional/powerbi/` (12
   alunos anônimos, 32 questões, 2 aplicações, 768 respostas).
2. **Transformação** — TCLE como condição de inclusão (RNF02); substituir
   identificador original por `CodigoAlunoAnonimo`; gerar chaves `*Key`;
   calcular `Acertou` (0/1) pelo gabarito; montar `Dim_Tempo` pela data.
3. **Carga** — Power BI Desktop: Obter dados → pasta
   `modelo-dimensional/powerbi/`; relacionamentos 1:\*; medidas da Seção 5.

Arquivos: [`esquema-estrela.sql`](./modelo-dimensional/esquema-estrela.sql) ·
[`esquema-estrela.dbml`](./modelo-dimensional/esquema-estrela.dbml) ·
[`gerar_seed.py`](./modelo-dimensional/gerar_seed.py)
