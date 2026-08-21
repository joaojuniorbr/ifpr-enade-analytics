# BUSINESS INTELLIGENCE — PROJETO INTEGRADOR

## MATRIZ DE REQUISITOS

### ENADE Analytics — Marco 1

| **Entrega**            | Até o final da Semana 4 (Marco 1)                                              |
| ---------------------- | ------------------------------------------------------------------------------ |
| **Equipe**             | João Junior, Ava Moreira, Leandro Zeni                                         |
| **Base de referência** | Briefing_Projeto_ENADE_Analytics.docx e Termo de Abertura do Projeto (Marco 0) |

_Esta matriz aplica a fase de "Concepção" do Modelo de Simon ao Projeto
Integrador: transformar o problema identificado no briefing em requisitos
concretos e verificáveis. O Gemini pode ajudar a gerar uma primeira lista, mas
cabe à equipe validar cada linha._

## 1. Requisitos Funcionais

O que o SAD ENADE Analytics precisa FAZER. Baseado no briefing da coordenação
(Seção 5 — perguntas que o dashboard precisa responder).

| **ID** | **Descrição do requisito**                                                                                                                         | **Prioridade** | **Atende à pergunta nº** |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------ |
| RF01   | O sistema deve permitir classificar as questões do simulado por eixo temático do componente específico do ENADE.                                   | Alta           | 1                        |
| RF02   | O sistema deve calcular o desempenho médio dos concluintes por eixo temático.                                                                      | Alta           | 1                        |
| RF03   | O sistema deve permitir comparar o desempenho entre turmas ou grupos de estudantes.                                                                | Alta           | 2                        |
| RF04   | O sistema deve identificar se as lacunas de conhecimento estão concentradas em poucos estudantes ou distribuídas por toda a turma.                 | Média          | 3                        |
| RF05   | O sistema deve acompanhar a evolução do desempenho ao longo do semestre, à medida que novos simulados forem aplicados.                             | Alta           | 4                        |
| RF06   | O sistema deve registrar as respostas dos simulados aplicados a estudantes voluntários, associando cada resposta a um eixo temático e a uma turma. | Alta           | Base p/ 1–4              |
| RF07   | O sistema deve gerar, com apoio de IA generativa, resumos executivos sobre os resultados para a coordenação.                                       | Média          | —                        |
| RF08   | O dashboard deve apresentar os resultados exclusivamente de forma agregada por turma/eixo, sem identificação individual do estudante.              | Alta           | 2, 3                     |

## 2. Requisitos Não Funcionais

Restrições de qualidade, segurança e uso — baseado na Seção 7 do briefing
(Restrições e requisitos não funcionais).

| **ID** | **Descrição do requisito**                                                                                                | **Categoria** | **Como será verificado**                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------- |
| RNF01  | Dados individuais de estudantes devem ser anonimizados antes de qualquer análise.                                         | LGPD          | Revisão do dataset antes da análise                                   |
| RNF02  | A coleta de dados só pode ocorrer após a assinatura do termo de consentimento (TCLE) simplificado pelo participante.      | LGPD          | Verificação do registro de consentimento antes da inclusão no dataset |
| RNF03  | A solução deve usar exclusivamente ferramentas gratuitas (Power BI Desktop, Forms, planilhas, IA generativa).             | Orçamento     | Checklist de ferramentas revisado a cada marco                        |
| RNF04  | O dashboard deve ser interpretável por pessoas sem conhecimento técnico em Power BI.                                      | Usabilidade   | Teste de leitura com um membro da coordenação                         |
| RNF05  | As entregas parciais devem cumprir o cronograma de marcos definido pela coordenação (semanas 2, 4, 8, 13, 16, 18, 19–20). | Prazo         | Checkpoint semanal de acompanhamento da equipe                        |

## 3. Fora do Escopo

Reforço, com as palavras da equipe, do que o projeto explicitamente NÃO vai
fazer (ver Seção 4 do briefing):

- Identificação individual de estudantes no dashboard — apenas visões agregadas
  por turma/eixo.
- Uso dos resultados para aprovação, reprovação ou avaliação formal dos
  estudantes.
- Substituição do ENADE oficial — o simulado é uma ferramenta de apoio, não uma
  prova valendo nota do INEP.
- Uso de ferramentas pagas — a solução deve usar apenas ferramentas gratuitas.

## 4. Rastreabilidade com os Marcos do Projeto

| **Marco**      | **Entregável**                 | **Requisitos relacionados (IDs)**   |
| -------------- | ------------------------------ | ----------------------------------- |
| M2 (Semana 8)  | Modelo de dados (DW)           | RF01, RF06, RNF01                   |
| M3 (Semana 13) | Mineração de dados / lacunas   | RF04, RF05                          |
| M4 (Semana 16) | Dashboard                      | RF02, RF03, RF05, RF07, RF08, RNF04 |
| M5 (Semana 18) | Integração de dados cadastrais | RF03, RNF01                         |

## 5. Aprovação

| **Equipe do projeto**                  | **Professora orientadora** |
| -------------------------------------- | -------------------------- |
| João Junior, Ava Moreira, Leandro Zeni | Lauriana Paludo            |
