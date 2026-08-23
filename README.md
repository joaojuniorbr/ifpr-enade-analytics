# ENADE Analytics

Solução de **Business Intelligence** para apoiar a preparação dos concluintes do curso de **Tecnologia em Gestão da Informação** (IFPR — Campus Pinhais) ao **ENADE 2026**.

> Projeto Integrador — Disciplina de Business Intelligence  
> Orientação: Profa. Lauriana Paludo  
> Cliente: Coordenação do Curso de TGI

---

## Contexto

O ENADE 2026 avaliará os estudantes concluintes do curso em **29 de novembro de 2026**. Hoje, o acompanhamento da preparação é informal: cada professor percebe, à sua maneira, onde os alunos têm mais dificuldade, mas **não há um retrato consolidado do curso como um todo**.

Isso dificulta decisões como:

- Em quais eixos vale a pena reforçar aulas de revisão
- Quais turmas precisam de mais atenção
- Se o desempenho está melhorando ao longo do semestre

O **ENADE Analytics** transforma essas impressões em **evidências acionáveis**, permitindo identificar lacunas de conhecimento por eixo temático do componente específico, de forma **agregada e anônima**.

---

## Objetivo

Desenvolver uma solução de BI completa — **do dado bruto ao dashboard** — que permita:

- Identificar lacunas de conhecimento dos concluintes por eixo temático
- Acompanhar a evolução dessas lacunas ao longo do semestre
- Apoiar a coordenação nas decisões sobre onde direcionar esforços de reforço

---

## Equipe

| Integrante | Papel principal | Contato |
| --- | --- | --- |
| João Junior | Modelagem de dados / liderança técnica | negrelis@gmail.com |
| Ava Moreira | Levantamento de requisitos / LGPD e documentação | avamoreira3@gmail.com |
| Leandro Zeni | Dashboard / storytelling de dados | leandro-zeni@hotmail.com |

---

## Escopo

### Dentro do escopo

- Banco de questões de simulado, classificado por **eixo temático** e **nível de dificuldade**
- Aplicação de pelo menos **um simulado-piloto** com estudantes voluntários
- Termo de consentimento e processo de **anonimização** (LGPD)
- **Data Warehouse** para organizar as respostas coletadas
- **Mineração de dados** para identificar padrões e lacunas de conhecimento
- **Dashboard interativo** em Power BI Desktop (ou ferramenta gratuita equivalente)
- Uso pontual de **IA generativa** (geração de questões, resumos executivos)

### Fora do escopo

- Identificação individual de estudantes no dashboard
- Uso dos resultados para aprovação, reprovação ou avaliação formal
- Substituição do ENADE oficial — o simulado é apenas ferramenta de apoio
- Ferramentas pagas

---

## Perguntas que o dashboard deve responder

1. Quais eixos temáticos do componente específico têm o **pior desempenho médio** entre os concluintes?
2. Existe **diferença relevante de desempenho** entre turmas ou grupos de estudantes?
3. As lacunas de conhecimento estão **concentradas em poucos estudantes** ou distribuídas por toda a turma?
4. O desempenho está **melhorando ao longo do semestre**, à medida que aplicamos mais simulados?

---

## Marcos de entrega

Cronograma definido pela coordenação do curso. Cada marco possui um documento dedicado neste repositório.

| Marco | Semana | Entregável | Documento | Status |
| --- | --- | --- | --- | --- |
| **Marco 0** | 2 | Termo de abertura do projeto (escopo preliminar) | [marco-0.md](./marco-0.md) | Concluído |
| **Marco 1** | 4 | Matriz de requisitos + termo de consentimento (LGPD) | [marco-1.md](./marco-1.md) · [termo-lgpd.md](./termo-lgpd.md) | Concluído |
| **Marco 2** | 8 | Modelo de dados (Data Warehouse) do banco de questões/respostas | [marco-2.md](./marco-2.md) | Em andamento |
| **Marco 3** | 13 | Relatório de clusters / lacunas de conhecimento por eixo | [marco-3.md](./marco-3.md) | Pendente |
| **Marco 4** | 16 | Dashboard com storytelling de dados | [marco-4.md](./marco-4.md) | Pendente |
| **Marco 5** | 18 | Integração dos dados cadastrais (módulo tipo ERP acadêmico) | [marco-5.md](./marco-5.md) | Pendente |
| **Entrega final** | 19–20 | Aplicação completa + manual técnico + apresentação à coordenação | [entrega-final.md](./entrega-final.md) | Pendente |

---

## Documentação do projeto

| Documento | Descrição |
| --- | --- |
| [marco-0.md](./marco-0.md) | Termo de abertura — justificativa, objetivos, escopo, riscos e plano de comunicação |
| [marco-1.md](./marco-1.md) | Matriz de requisitos funcionais e não funcionais |
| [termo-lgpd.md](./termo-lgpd.md) | Termo de Consentimento Livre e Esclarecido (TCLE) para participantes do simulado |
| [marco-2.md](./marco-2.md) | Modelo de dados (Data Warehouse) |
| [marco-3.md](./marco-3.md) | Análise de mineração de dados e lacunas por eixo |
| [marco-4.md](./marco-4.md) | Dashboard interativo com storytelling |
| [marco-5.md](./marco-5.md) | Integração de dados cadastrais acadêmicos |
| [entrega-final.md](./entrega-final.md) | Manual técnico, apresentação e entrega consolidada |

---

## Stack e ferramentas

Restrição de **orçamento zero** — apenas ferramentas gratuitas:

| Ferramenta | Uso no projeto |
| --- | --- |
| Microsoft Forms | Coleta de respostas do simulado |
| Planilhas (Excel/Google Sheets) | Banco de questões e dados intermediários |
| Power BI Desktop | Dashboard interativo |
| IA generativa | Geração de questões adicionais e resumos executivos |
| Notion | Organização e acompanhamento do projeto |

---

## LGPD e privacidade

O projeto segue os princípios da **Lei Geral de Proteção de Dados (Lei nº 13.709/2018)**:

- [x] Termo de consentimento (TCLE) simplificado para participantes do simulado → [termo-lgpd.md](./termo-lgpd.md)
- [x] Anonimização dos dados individuais antes de qualquer análise
- [x] Dashboard com resultados **exclusivamente agregados** (por turma/eixo), sem identificação individual

---

## Critérios de sucesso

- O dashboard cobre **todos os eixos** do componente específico do ENADE 2026
- Pelo menos **um simulado-piloto** foi aplicado e efetivamente analisado
- Os dados individuais dos estudantes estão **devidamente anonimizados** e protegidos
- A coordenação consegue interpretar o dashboard **sozinha**, sem apoio técnico da equipe
- A apresentação final demonstra clareza sobre **o que foi construído e por quê**

---

## Comunicação

| Canal | Frequência |
| --- | --- |
| Reunião da equipe | Semanal — sextas-feiras, 19h |
| Ferramenta de organização | Notion |
| Comunicação assíncrona | WhatsApp (grupo dedicado) |
| Contato com orientadora/coordenação | Semanal; urgências via WhatsApp |

---

## Estrutura do repositório

```
ifpr-enade-analytics/
├── README.md              ← este arquivo
├── marco-0.md             ← Termo de abertura (Semana 2)
├── marco-1.md             ← Matriz de requisitos (Semana 4)
├── termo-lgpd.md          ← TCLE / anonimização (Semana 4)
├── marco-2.md             ← Modelo de dados / DW (Semana 8)
├── marco-3.md             ← Mineração de dados (Semana 13)
├── marco-4.md             ← Dashboard (Semana 16)
├── marco-5.md             ← Integração cadastral (Semana 18)
└── entrega-final.md       ← Entrega consolidada (Semanas 19–20)
```

---

## Referências

- Briefing da coordenação: `Briefing_Projeto_ENADE_Analytics.docx`
- ENADE 2026 — prova oficial: **29 de novembro de 2026**
- IFPR — Campus Pinhais · Curso Superior de Tecnologia em Gestão da Informação

---

**IFPR — Campus Pinhais** · Projeto Integrador de Business Intelligence · 2026
