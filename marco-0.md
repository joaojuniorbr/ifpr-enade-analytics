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

**Objetivos específicos:**

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

**Dentro do escopo:**

- Banco de questões de simulado classificado por eixo temático do componente
  específico e por nível de dificuldade.
- Aplicação de pelo menos um simulado-piloto com estudantes voluntários.
- Termo de consentimento simplificado e processo de anonimização dos dados
  (LGPD).
- Modelo de dados (Data Warehouse) para as respostas coletadas.
- Análise de mineração de dados/identificação de lacunas de conhecimento.
- Dashboard interativo em Power BI Desktop (ou ferramenta gratuita equivalente).
- Uso pontual de IA generativa (geração de questões, resumos executivos).

**Fora do escopo:**

- Identificação individual de estudantes no dashboard (apenas visões agregadas
  por turma/eixo).
- Uso dos resultados para aprovação, reprovação ou avaliação formal dos
  estudantes.
- Substituição do ENADE oficial — o simulado é apenas ferramenta de apoio.
- Uso de ferramentas pagas.

## 4. Partes interessadas e papéis da equipe

| **Integrante** | **Papel principal no projeto**                                 | **Contato**   |
| -------------- | -------------------------------------------------------------- | ------------- |
| João Junior    | Modelagem de dados / liderança técnica          | negrelis@gmail.com |
| Ava Moreira    | Levantamento de requisitos / LGPD e documentação | avamoreira3@gmail.com |
| Leandro Zeni   | Dashboard / storytelling de dados                | leandro-zeni@hotmail.com |

## 5. Entregáveis por marco

Preencham a coluna "Responsável principal" — o marco e a semana já vêm do
briefing da coordenação.

| **Marco** | **Semana** | **Entregável**                     | **Responsável principal** |
| --------- | ---------- | ---------------------------------- | ------------------------- |
| M0        | 2          | Termo de abertura | João J.             |
| M1        | 4          | Matriz de requisitos + LGPD        | Ava L.              |
| M2        | 8          | Modelo de dados (DW)               | João J.             |
| M3        | 13         | Mineração de dados / lacunas       | Leandro Z.             |
| M4        | 16         | Dashboard                          | Leandro Z.             |
| M5        | 18         | Integração de dados cadastrais     | Ava L.             |
| Final     | 19-20      | Entrega completa + apresentação    | João J. / Ava L. / Leandro Z.             |

## 6. Premissas e restrições

**Premissas:**

- Um número suficiente de estudantes concluintes se voluntariará para participar
  do simulado-piloto.
- A coordenação disponibilizará, quando necessário, acesso aos dados cadastrais
  para o Marco 5.
- As ferramentas gratuitas previstas (Power BI Desktop, Forms, planilhas) serão
  suficientes para todo o escopo do projeto.

**Restrições:**

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

Semanal - Todas sextas-feiras ás 19h, com comunicações sincronas via grupo dedicado na ferramenta Whatsapp.

**Ferramenta de organização do projeto**

Notion.

**Como a equipe vai se comunicar com a professora/coordenação em caso de
dúvidas?**

Semanalmente, ás sextas-feiras ás 19h. Envio de mensagens pela ferramenta Whatsapp em caso de urgências.

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