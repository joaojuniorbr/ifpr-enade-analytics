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
| **Data**               | 18 / 09 / 2026 |

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
| Respostas (grão) | 768 |
| Alunos anônimos | 12 (`Aluno_001` … `Aluno_012`) |
| Turmas/grupos | TGI Noturno A (6) e TGI Noturno B (6) |
| Questões | 32 (2 por eixo × 16 eixos) |
| Aplicações | SIM-PILOTO-01 (10/09/2026) e SIM-02 (22/10/2026) |
| Taxa geral | 64,1% (492 acertos / 768) |
| Identificadores | só `CodigoAlunoAnonimo` e `TurmaGrupo` (RNF01, RF08) |

Variáveis: `Acertou` (0/1), `EixoTematico`, `NivelDificuldade`, `TurmaGrupo`,
`SimuladoKey` / `NumeroAplicacao`. A taxa nunca está persistida — é
`SUM(Acertou) / COUNT(respostas)` no contexto de filtro.

## 3. Técnicas aplicadas

Ferramenta (RNF03): **Power BI Desktop**. Medidas DAX e visuais — sem script.

| **Técnica no Desktop** | **Para que serve** |
| ---------------------- | ------------------ |
| Medida `Taxa de Acerto` em barras por `EixoTematico` (sort crescente) | Ranking de lacunas (pergunta 1; RF02) |
| Medida `Faixa da Lacuna` (Crítica / Atenção / Ok / Força) | Ler o eixo sem olhar o número cru |
| `Pct Alunos Abaixo 50%` por eixo | Concentrada vs distribuída (RF04) |
| Gráfico de dispersão + **Análises → Localizar clusters (3)** | Três perfis agregados, sem nome (RF04) |
| Colunas por `CodigoSimulado` e barras eixo × simulado | Evolução no semestre (RF05) |
| Colunas por `TurmaGrupo` | Comparar grupos (RF03) |

Fórmulas e cliques: [`powerbi/tutorial-marco-3.md`](./powerbi/tutorial-marco-3.md).
A página com `CodigoAlunoAnonimo` é só da equipe; o dashboard da coordenação
não lista aluno (RF08).

## 4. Resultados por eixo temático

Média geral do dataset: **64,1%**. 48 respostas por eixo (12 alunos × 2 questões
× 2 aplicações).

| **Eixo (Art. 6º)** | **Desempenho médio** | **Lacuna identificada** | **Observações** |
| ------------------ | -------------------- | ----------------------- | --------------- |
| Segurança da informação | 27,1% | Crítica e **distribuída** | 75% dos alunos abaixo de 50%. Quase não evoluiu (+4,2 pp). Prioridade máxima. |
| Arquitetura de computadores | 47,9% | Crítica | 33% dos alunos &lt; 50%. Evolução +12,5 pp, ainda abaixo da média. |
| Redes de computadores | 47,9% | Crítica | Mesmo patamar da arquitetura; +12,5 pp entre aplicações. |
| Governança de tecnologia da informação | 54,2% | Atenção | Partiu de 37,5% no piloto e subiu +33,3 pp — responde a reforço. |
| Sistemas operacionais | 56,2% | Atenção | Poucos alunos &lt; 50% (8%); lacuna mais homogênea. |
| Algoritmos | 58,3% | Atenção | Salto forte no 2º simulado (+33,3 pp). |
| Sistemas de informações gerenciais | 58,3% | Atenção | Evolução modesta (+8,3 pp). |
| Banco de dados | 64,6% | Ok (limítrofe) | Colado na média geral. |
| Gestão dos serviços de TI | 64,6% | Ok (limítrofe) | Quase não evoluiu (+4,2 pp). |
| Gestão estratégica organizacional | 68,8% | Ok | +29,2 pp entre aplicações. |
| Engenharia de software | 75,0% | Ok | Acima da média; manter. |
| Gerência de projetos | 75,0% | Ok | Nenhum aluno abaixo de 50%. |
| Tecnologias para inteligência de negócio | 75,0% | Ok | Eixo alinhado à disciplina; nenhum aluno &lt; 50%. |
| Processos organizacionais | 77,1% | Ok | Desempenho consistente. |
| Gestão de pessoas | 85,4% | Força | 70,8% → 100% no 2º simulado. |
| Ética, tecnologia e sociedade | 89,6% | Força | Melhor eixo; menor dispersão entre alunos. |

Por dificuldade: Fácil 79,5% · Médio 56,4% · Difícil 55,4%. A queda de Fácil
para Médio é maior do que de Médio para Difícil — o banco diferencia bem o
primeiro degrau.

## 5. Distribuição das lacunas (concentradas vs. distribuídas)

Pergunta 3 do briefing / RF04.

**No curso como um todo, as lacunas não estão concentradas em poucos
estudantes.** A taxa por aluno anônimo vai de 53,1% a 75,0% (média 64,1%;
desvio-padrão 7,2 pp). Os três participantes com mais erros respondem a 31,9%
das falhas — perto da fatia esperada se os erros fossem iguais (3/12 = 25%).
Não há um “bolsão” de dois ou três alunos puxando o resultado para baixo.

Tercis pelo desempenho geral (obter no Desktop com **Localizar clusters = 3**
no gráfico de dispersão; o dashboard da coordenação não lista códigos):

| **Perfil** | **Participantes** | **Taxa média** |
| ---------- | ----------------- | -------------- |
| Tercil baixo | 4 de 12 | 55,1% |
| Tercil médio | 4 de 12 | 64,8% |
| Tercil alto | 4 de 12 | 72,3% |

**Por eixo, o quadro muda:**

- **Segurança da informação** é lacuna **de turma**: 9 em 12 alunos ficam abaixo
  de 50%. Reforço coletivo, não tutoria pontual.
- **Arquitetura** e **Redes** são mistas (cerca de 1/3 da turma abaixo de 50%).
- Eixos de gestão (pessoas, ética, processos, BI) são **fortes e homogêneos**
  (0% dos alunos abaixo de 50%).

Entre turmas a diferença é irrelevante para decisão: TGI Noturno A 63,3% vs
TGI Noturno B 64,8% (1,5 pp).

## 6. Evolução ao longo do semestre

Pergunta 4 do briefing / RF05. Duas aplicações, mesmos 12 alunos e mesmas 32
questões.

| **Aplicação** | **Data** | **Taxa de acerto** | **Respostas** |
| ------------- | -------- | ------------------ | ------------- |
| SIM-PILOTO-01 | 10/09/2026 | 56,0% | 384 |
| SIM-02 | 22/10/2026 | 72,1% | 384 |
| Variação | | **+16,1 pp** | |

O desempenho geral **melhorou**. Nem todos os eixos acompanharam:

| **Eixo** | **SIM-PILOTO-01** | **SIM-02** | **Δ** |
| -------- | ----------------- | ---------- | ----- |
| Algoritmos | 41,7% | 75,0% | +33,3 pp |
| Governança de TI | 37,5% | 70,8% | +33,3 pp |
| Gestão de pessoas | 70,8% | 100,0% | +29,2 pp |
| Gestão estratégica | 54,2% | 83,3% | +29,2 pp |
| Segurança da informação | 25,0% | 29,2% | **+4,2 pp** |
| Gestão dos serviços de TI | 62,5% | 66,7% | **+4,2 pp** |

Segurança e serviços de TI **não saíram do lugar**. A coordenação não deve ler
a alta geral de 16 pp como sucesso nesses dois objetos.

## 7. Conclusões e recomendações para a coordenação

1. **Priorizar três eixos críticos** até o ENADE (29/11/2026): Segurança da
   informação, Arquitetura de computadores e Redes de computadores.
2. **Tratar Segurança como problema de turma**, não de “alguns alunos”: oficina
   ou revisão para todos os concluintes; a 2ª aplicação quase não moveu o
   indicador.
3. **Não pulverizar esforço** em Ética, Gestão de pessoas e Processos — já estão
   fortes.
4. **Governança e Algoritmos** responderam a reforço (+33 pp): repetir o padrão
   de revisão nesses temas se ainda houver tempo.
5. **Manter pelo menos mais um simulado** antes da prova oficial, com as mesmas
   dimensões, para ver se Segurança sai de ~27%.
6. **Dashboard (Marco 4):** abrir pela taxa por eixo (ordenado do pior para o
   melhor), depois evolução por aplicação e, só então, comparação de turmas
   (hoje sem diferença material). Sem lista nominal.

Limitações: n = 12 é piloto sintético; intervalos são instáveis. Com coleta real
(TCLE), atualize o CSV, clique **Atualizar** no Desktop e refaça as capturas
do tutorial.

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
| RF03 | Comparação TGI Noturno A vs B na Seção 5. |
| RF04 | `Pct Alunos Abaixo 50%` por eixo e clusters (3) na Seção 5. |
| RF05 | SIM-PILOTO-01 vs SIM-02 na Seção 6. |
| RF08 / RNF01 | Só código anônimo na página da equipe; dashboard agregado. |

## Anexo B — Como reproduzir no Power BI

Siga [`powerbi/tutorial-marco-3.md`](./powerbi/tutorial-marco-3.md). Os números
deste documento são a conferência do seed; a apresentação usa as telas do
`.pbix`.
