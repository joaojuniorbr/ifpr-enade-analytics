# BUSINESS INTELLIGENCE — PROJETO INTEGRADOR

## TERMO DE ABERTURA DO PROJETO

### ENADE Analytics — Marco 0

| **Entrega**         | Até o final da Semana 2 (Marco 0)                       |
| ------------------- | ------------------------------------------------------- |
| **Nome do projeto** | ENADE Analytics                                         |
| **Integrantes**     | 1. João Junior <br> 2. Ava Moreira <br> 3. Leandro Zeni |
| **Data**            | 14/08/2026                                              |

_Este termo de abertura é o entregável do Marco 0 do Projeto Integrador. Ele
formaliza o entendimento da equipe sobre o briefing recebido da coordenação
(documento Briefing_Projeto_ENADE_Analytics.docx) e serve de referência para os
próximos marcos. Preencham cada seção com as próprias palavras da equipe._

## 1. Justificativa

Por que este projeto é importante? Qual problema da coordenação ele resolve?
(2-3 frases)

1. Atualmente a coordenação não possui visibilidade sistemática sobre os eixos
   temáticos do componente específico do ENADE em que os concluintes apresentam
   mais dificuldade, dependendo apenas da percepção individual de cada
   professor.
2. Essa falta de dados consolidados impede decisões precisas sobre onde
   direcionar aulas de reforço, quais turmas precisam de mais atenção e se o
   desempenho está evoluindo ao longo do semestre.
3. O projeto entrega uma solução de BI que transforma essas impressões informais
   em evidências acionáveis, apoiando a coordenação na preparação dos
   concluintes para o ENADE 2026.

## 2. Objetivos

**Objetivo geral:**

Desenvolver uma solução de Business Intelligence completa — do dado bruto ao
dashboard — que permita identificar, de forma agregada e anônima, as lacunas de
conhecimento dos concluintes por eixo temático do componente específico do ENADE
2026, apoiando a coordenação nas decisões sobre reforço acadêmico.

**Objetivos específicos (pelo menos 3):**

- Estruturar um banco de questões de simulado classificado por eixo temático e
  nível de dificuldade.
- Aplicar pelo menos um simulado-piloto com estudantes voluntários, coletando
  respostas de forma anonimizada e com consentimento (LGPD).
- Modelar um Data Warehouse para organizar as respostas coletadas.
- Realizar uma análise de mineração de dados para identificar padrões e lacunas
  de conhecimento por eixo.
- Construir um dashboard interativo e de fácil leitura, compreensível por
  pessoas sem conhecimento técnico em Power BI.
- Utilizar IA generativa como apoio, por exemplo na geração de questões
  adicionais e de resumos executivos.

## 3. Escopo

**Dentro do escopo (o que vamos entregar):**

- Banco de questões de simulado classificado por eixo temático do componente
  específico e por nível de dificuldade.
- Aplicação de pelo menos um simulado-piloto com estudantes voluntários.
- Termo de consentimento simplificado e processo de anonimização dos dados
  (LGPD).
- Modelo de dados (Data Warehouse) para as respostas coletadas.
- Análise de mineração de dados/identificação de lacunas de conhecimento.
- Dashboard interativo em Power BI Desktop (ou ferramenta gratuita equivalente).
- Uso pontual de IA generativa (geração de questões, resumos executivos).

**Fora do escopo (o que não vamos fazer):**

- Identificação individual de estudantes no dashboard (apenas visões agregadas
  por turma/eixo).
- Uso dos resultados para aprovação, reprovação ou avaliação formal dos
  estudantes.
- Substituição do ENADE oficial — o simulado é apenas ferramenta de apoio.
- Uso de ferramentas pagas.

## 4. Partes interessadas e papéis da equipe

| **Integrante** | **Papel principal no projeto**                                 | **Contato**   |
| -------------- | -------------------------------------------------------------- | ------------- |
| João Junior    | _[sugestão: Modelagem de dados / liderança técnica]_           | _[preencher]_ |
| Ava Moreira    | _[sugestão: Levantamento de requisitos / LGPD e documentação]_ | _[preencher]_ |
| Leandro Zeni   | _[sugestão: Dashboard / storytelling de dados]_                | _[preencher]_ |

> A equipe pode redistribuir os papéis acima — foram sugeridos apenas como ponto
> de partida com base no escopo do briefing.

## 5. Entregáveis por marco

Preencham a coluna "Responsável principal" — o marco e a semana já vêm do
briefing da coordenação.

| **Marco** | **Semana** | **Entregável**                     | **Responsável principal** |
| --------- | ---------- | ---------------------------------- | ------------------------- |
| M0        | 2          | Termo de abertura (este documento) | _[preencher]_             |
| M1        | 4          | Matriz de requisitos + LGPD        | _[preencher]_             |
| M2        | 8          | Modelo de dados (DW)               | _[preencher]_             |
| M3        | 13         | Mineração de dados / lacunas       | _[preencher]_             |
| M4        | 16         | Dashboard                          | _[preencher]_             |
| M5        | 18         | Integração de dados cadastrais     | _[preencher]_             |
| Final     | 19-20      | Entrega completa + apresentação    | _[preencher]_             |

## 6. Premissas e restrições

**Premissas (o que estamos assumindo como verdadeiro):**

- Um número suficiente de estudantes concluintes se voluntariará para participar
  do simulado-piloto.
- A coordenação disponibilizará, quando necessário, acesso aos dados cadastrais
  para o Marco 5.
- As ferramentas gratuitas previstas (Power BI Desktop, Forms, planilhas) serão
  suficientes para todo o escopo do projeto.

**Restrições (prazo, ferramentas, orçamento, acesso a dados):**

- Orçamento zero: apenas ferramentas gratuitas (Power BI Desktop, Forms,
  planilhas, IA generativa).
- Prazo final na Semana 20, com entregas parciais obrigatórias ao longo do
  semestre.
- Trabalho em paralelo às aulas regulares, exigindo planejamento para não
  concentrar tudo no final.
- Qualquer dado de estudante deve ser anonimizado antes da análise (LGPD), com
  termo de consentimento obrigatório.

## 7. Riscos preliminares

| **Risco identificado**                                                    | **Impacto (Alto/Médio/Baixo)** | **Como vamos mitigar**                                                             |
| ------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| Baixa adesão de estudantes voluntários ao simulado-piloto                 | Alto                           | Divulgação antecipada com apoio dos professores e prazos claros de participação    |
| Atraso nas entregas parciais por conflito com a carga das aulas regulares | Médio                          | Cronograma interno com folgas e reuniões semanais de acompanhamento                |
| Volume de respostas insuficiente para uma mineração de dados relevante    | Médio                          | Ampliar a divulgação do simulado e garantir cobertura mínima de respostas por eixo |

## 8. Plano de comunicação da equipe

**Como e com que frequência a equipe vai se reunir/se comunicar?**

_[preencher — ex.: reuniões semanais às segundas-feiras, via Google
Meet/Discord, com apoio de mensagens assíncronas no WhatsApp/Discord para o dia
a dia]_

**Ferramenta de organização do projeto (ex.: Trello, planilha, Github, Jira):**

_[preencher — ex.: Trello para acompanhamento de tarefas e GitHub para
versionamento de artefatos técnicos]_

**Como a equipe vai se comunicar com a professora/coordenação em caso de
dúvidas?**

_[preencher — ex.: e-mail institucional e nos horários de atendimento/aula]_

## 9. Compromisso com ética, privacidade e LGPD

Marquem com um X o compromisso da equipe:

- [x] Vamos elaborar um termo de consentimento (TCLE) simplificado para os
      participantes dos simulados.
- [x] Vamos anonimizar os dados individuais antes de qualquer análise.
- [x] O dashboard final apresentará apenas resultados agregados (por
      turma/eixo), nunca por indivíduo identificável.

## 10. Critérios de sucesso do projeto

Como a equipe vai saber que o projeto foi bem-sucedido? (usem o briefing da
coordenação como referência, mas podem adicionar critérios próprios)

- O dashboard cobre todos os eixos do componente específico do ENADE 2026.
- Pelo menos um simulado-piloto foi aplicado e efetivamente analisado.
- Os dados individuais dos estudantes estão devidamente anonimizados e
  protegidos, conforme LGPD.
- A coordenação consegue interpretar o dashboard sozinha, sem apoio técnico da
  equipe.
- A apresentação final demonstra clareza sobre o que foi construído e por quê.
- _[opcional — critério próprio da equipe, ex.: cumprimento de todos os marcos
  dentro do prazo definido]_

## 11. Aprovação

### Assinatura dos integrantes da equipe

- João Junior — _[assinatura/data]_
- Ava Moreira — _[assinatura/data]_
- Leandro Zeni — _[assinatura/data]_

### Aprovação da professora orientadora

Lauriana Paludo <br> Data: 01/08/2026
