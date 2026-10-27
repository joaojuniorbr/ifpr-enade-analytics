# BUSINESS INTELLIGENCE — PROJETO INTEGRADOR

## MINERAÇÃO DE DADOS — LACUNAS DE CONHECIMENTO

### ENADE Analytics — Marco 3

Este documento é o entregável do Marco 3. Ele identifica padrões e lacunas de
conhecimento por eixo temático do componente específico (Portaria Inep nº
171/2026, Art. 6º), a partir do Data Warehouse do [Marco 2](./marco-2.md).
Requisitos: RF04 e RF05 (também informa RF02 e RF03).

As seções 1 a 8 seguem o template do repositório. Números abaixo vêm do seed
sintético em `modelo-dimensional/powerbi/` — **não são coleta real** do
simulado-piloto. A mesma análise se reaplica quando houver respostas de
voluntários com TCLE.

| **Entrega**            | Até o final da Semana 13 (Marco 3) |
| ---------------------- | ---------------------------------- |
| **Equipe**             | RevelaDados |
| **Integrantes**        | • Alessandro Sondey Rodrigues Lima <br> • João Luiz Vicente Junior <br> • Leandro Zeni |
| **Responsável**        | Leandro Zeni |
| **Base de referência** | [Marco 2](./marco-2.md) · [Marco 1](./marco-1.md) · Briefing da coordenação |
| **Data**               | 27 / 10 / 2026 (atualizado ao seed demo) |

---

## 1. Objetivo da análise

Responder, com evidência agregada e anônima, às perguntas 1, 3 e 4 do briefing:

1. Quais eixos do componente específico têm o **pior desempenho médio**?
3. As lacunas estão **concentradas em poucos estudantes** ou **distribuídas** pela turma? (RF04)
4. O desempenho está **melhorando** entre aplicações do simulado? (RF05)

A mineração não identifica pessoa, não gera nota e não substitui o ENADE oficial.

## 2. Dataset utilizado

Fonte: esquema estrela do Marco 2 carregado no **Power BI Desktop** a partir
de `modelo-dimensional/powerbi/`. Como montar o arquivo: tutorial
[`powerbi/tutorial-marco-3.md`](./powerbi/tutorial-marco-3.md).

| **Item** | **Valor** |
| -------- | --------- |
| Respostas (grão) | 4.608 |
| Alunos anônimos | 36 (`Aluno_001` … `Aluno_036`) |
| Turmas/grupos | 6 (6 alunos cada): Noturno A/B/C — Pinhais; Matutino — Pinhais; Integrado — Colombo; EAD — Região Metropolitana |
| Questões | 32 (2 por eixo × 16 eixos) |
| Aplicações | SIM-PILOTO-01 (10/09), SIM-02 (22/10), SIM-03 (05/11), SIM-04 (19/11/2026) |
| Taxa geral | 67,4% (3.106 acertos / 4.608) |
| Identificadores | só `CodigoAlunoAnonimo` e `TurmaGrupo` (RNF01, RF08) |

Gerar de novo: `python3 modelo-dimensional/gerar_seed.py --demo` (CSVs + `carga.sql`).

Variáveis: `Acertou` (0/1), `EixoTematico`, `Dim_Dificuldade[Nivel]`,
`Dim_Turma[TurmaGrupo]`, `Dim_Tempo[CodigoSimulado]` / `NumeroSimulado`. A taxa nunca está persistida — é
`SUM(Acertou) / COUNT(respostas)` no contexto de filtro.

## 3. Técnicas aplicadas

Ferramenta (RNF03): **Power BI Desktop**. Medidas DAX e visuais — sem script.

| **Técnica no Desktop** | **Para que serve** |
| ---------------------- | ------------------ |
| Medida `Taxa de Acerto` em barras por `EixoTematico` (sort crescente) | Ranking de lacunas (pergunta 1; RF02) |
| Medida `Faixa da Lacuna` (Crítica / Atenção / Ok / Força) | Ler o eixo sem olhar o número cru |
| `Pct Alunos Abaixo 50%` por eixo | Concentrada vs distribuída (RF04) |
| Gráfico de dispersão + **Análises → Localizar clusters (3)** | Três perfis agregados, sem nome (RF04) |
| Colunas por `Dim_Tempo[CodigoSimulado]` e barras eixo × simulado | Evolução no semestre (RF05) |
| Colunas por `Dim_Turma[TurmaGrupo]` | Comparar grupos (RF03) |

Fórmulas e cliques: [`powerbi/tutorial-marco-3.md`](./powerbi/tutorial-marco-3.md).
A página com `CodigoAlunoAnonimo` é só da equipe; o dashboard da coordenação
não lista aluno (RF08).

## 4. Resultados por eixo temático

Média geral do dataset: **67,4%**. 288 respostas por eixo (36 alunos × 2 questões
× 4 aplicações).

| **Eixo (Art. 6º)** | **Desempenho médio** | **Lacuna identificada** | **Observações** |
| ------------------ | -------------------- | ----------------------- | --------------- |
| Segurança da informação | 34,0% | Crítica e **de turma** | 69% dos alunos abaixo de 50%. Evoluiu +13,9 pp (piloto → SIM-04), mas segue muito abaixo da meta. |
| Redes de computadores | 52,8% | Atenção | 25% dos alunos &lt; 50%; +6,9 pp no semestre. |
| Arquitetura de computadores | 56,2% | Atenção | 22% dos alunos &lt; 50%; +15,3 pp — responde a reforço. |
| Sistemas operacionais | 61,8% | Atenção | +19,4 pp; ainda heterogêneo (17% &lt; 50%). |
| Algoritmos | 62,2% | Atenção | Estável após o piloto (+5,6 pp no total). |
| Gestão dos serviços de TI | 63,5% | Atenção | +27,8 pp — forte resposta ao reforço. |
| Governança de tecnologia da informação | 64,6% | Atenção | +13,9 pp; 17% dos alunos &lt; 50%. |
| Gestão estratégica organizacional | 65,3% | Ok | +27,8 pp entre piloto e SIM-04. |
| Engenharia de software | 67,7% | Ok | Sem ganho líquido no semestre (0 pp). |
| Sistemas de informações gerenciais | 70,5% | Ok | +13,9 pp. |
| Gerência de projetos | 74,0% | Ok | Poucos alunos críticos (3% &lt; 50%). |
| Banco de dados | 77,1% | Ok | +15,3 pp. |
| Tecnologias para inteligência de negócio | 77,1% | Ok | Eixo alinhado à disciplina. |
| Processos organizacionais | 78,1% | Ok | Nenhum aluno abaixo de 50%. |
| Gestão de pessoas | 85,1% | Força | +12,5 pp; desempenho alto. |
| Ética, tecnologia e sociedade | 88,5% | Força | Melhor eixo; 0% dos alunos &lt; 50%. |

Por dificuldade: Fácil **80,7%** · Médio **64,8%** · Difícil **55,6%**. A queda
de Fácil para Médio é maior do que de Médio para Difícil — o banco diferencia
bem o primeiro degrau.

## 5. Distribuição das lacunas (concentradas vs. distribuídas)

Pergunta 3 do briefing / RF04.

**No curso como um todo, as lacunas não estão concentradas em poucos
estudantes.** A taxa por aluno anônimo vai de **39,8%** a **82,0%** (média
67,4%; desvio-padrão **9,0 pp**). Os três participantes com mais erros
concentram **13,7%** das falhas — perto da fatia esperada se os erros fossem
iguais (3/36 ≈ 8,3%). Não há um “bolsão” de dois ou três alunos puxando sozinhos
o resultado.

Tercis pelo desempenho geral (obter no Desktop com **Localizar clusters = 3**
no gráfico de dispersão; o dashboard da coordenação não lista códigos):

| **Perfil** | **Participantes** | **Taxa média** |
| ---------- | ----------------- | -------------- |
| Tercil baixo | 12 de 36 | 57,6% |
| Tercil médio | 12 de 36 | 68,4% |
| Tercil alto | 12 de 36 | 76,2% |

**Por eixo, o quadro muda:**

- **Segurança da informação** é lacuna **de turma**: **25 de 36** alunos ficam
  abaixo de 50%. Reforço coletivo, não tutoria pontual.
- **Arquitetura** e **Redes** são mistas (cerca de 1/4 dos alunos abaixo de 50%).
- Eixos de gestão (pessoas, ética, processos) permanecem **fortes e homogêneos**.

**Entre turmas há diferença relevante (RF03):** TGI EAD — Região Metropolitana
**52,7%** vs TGI Matutino — Pinhais **74,5%** (~**22 pp**). Noturnos A/B/C e
Integrado ficam entre **66%** e **73%**. Vale cruzar página **Turmas** com eixo
(Segurança/Redes) antes de decidir se o reforço é só temático ou também por
modalidade.

## 6. Evolução ao longo do semestre

Pergunta 4 do briefing / RF05. Quatro aplicações, mesmos 36 alunos e mesmas 32
questões.

| **Aplicação** | **Data** | **Taxa de acerto** | **Respostas** |
| ------------- | -------- | ------------------ | ------------- |
| SIM-PILOTO-01 | 10/09/2026 | 58,9% | 1.152 |
| SIM-02 | 22/10/2026 | 66,2% | 1.152 |
| SIM-03 | 05/11/2026 | 72,6% | 1.152 |
| SIM-04 | 19/11/2026 | 72,0% | 1.152 |
| Variação (piloto → SIM-04) | | **+13,1 pp** | |

O desempenho geral **melhorou** ao longo do semestre. Nem todos os eixos
acompanharam na mesma velocidade:

| **Eixo** | **SIM-PILOTO-01** | **SIM-04** | **Δ** |
| -------- | ----------------- | ---------- | ----- |
| Gestão dos serviços de TI | 47,2% | 75,0% | +27,8 pp |
| Gestão estratégica | 47,2% | 75,0% | +27,8 pp |
| Sistemas operacionais | 44,4% | 63,9% | +19,4 pp |
| Arquitetura de computadores | 48,6% | 63,9% | +15,3 pp |
| Segurança da informação | 26,4% | 40,3% | +13,9 pp |
| Engenharia de software | 65,3% | 65,3% | **0 pp** |

Segurança **melhorou**, mas partiu de patamar crítico e **continua abaixo de
50%** no agregado. Engenharia de software **estagnou** — a coordenação não deve
ler só a curva geral do curso.

## 7. Conclusões e recomendações para a coordenação

1. **Priorizar Segurança da informação** até o ENADE (29/11/2026) e reforçar
   **Redes** e **Arquitetura** (atenção, abaixo da média do curso).
2. **Tratar Segurança como problema de turma**, não de “alguns alunos”: oficina
   ou revisão para todos os concluintes; mesmo com +13,9 pp no semestre, o eixo
   segue em ~34% no agregado.
3. **Olhar a turma EAD** (~53%) frente às presenciais (~66–75%): investigar se
   lacunas são de modalidade, cronograma ou conteúdo antes do ENADE.
4. **Não pulverizar esforço** em Ética, Gestão de pessoas e Processos — já estão
   fortes.
5. **Acompanhar Engenharia de software** (0 pp no semestre) — possível ponto
   cego apesar da média “Ok”.
6. **Dashboard (Marco 4):** abrir pela taxa por eixo (pior → melhor), evolução
   por `CodigoSimulado` (4 pontos) e página **Turmas** (RF03). Sem lista nominal.

Limitações: n = 36 é **seed sintético** para demo do dashboard; intervalos mudam
na coleta real (TCLE). Atualize CSVs (`gerar_seed.py --demo` ou export da app),
clique **Atualizar** no Desktop e refaça as capturas do tutorial.

## 8. Aprovação

| **Assinatura dos integrantes da equipe** | **Aprovação da professora orientadora** |
| ---------------------------------------- | --------------------------------------- |
| Alessandro Sondey Rodrigues Lima — ____________________ | Lauriana Paludo |
| João Luiz Vicente Junior — ____________________ | Data: ____ / ____ / 2026 |
| Leandro Zeni — ____________________ | |

---

## Anexo A — Rastreabilidade

| **ID** | **Como esta análise atende** |
| ------ | ---------------------------- |
| RF02 | Taxa média por eixo na Seção 4 (barras no Power BI). |
| RF03 | Comparação entre as 6 turmas na Seção 5 (destaque EAD vs Matutino). |
| RF04 | `Pct Alunos Abaixo 50%` por eixo e clusters (3) na Seção 5. |
| RF05 | Quatro aplicações na Seção 6 (`CodigoSimulado`). |
| RF08 / RNF01 | Só código anônimo na página da equipe; dashboard agregado. |

## Anexo B — Como reproduzir no Power BI

Siga [`powerbi/tutorial-marco-3.md`](./powerbi/tutorial-marco-3.md). Os números
deste documento são a conferência do seed; a apresentação usa as telas do
`.pbix`.
