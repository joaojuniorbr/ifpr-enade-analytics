# BUSINESS INTELLIGENCE — PROJETO INTEGRADOR

## ENTREGA FINAL

### ENADE Analytics — Semanas 19–20

| **Entrega** | Semanas 19–20 — apresentação à coordenação |
| --- | --- |
| **Equipe** | RevelaDados |
| **Integrantes** | Alessandro Sondey Rodrigues Lima · João Luiz Vicente Junior · Leandro Zeni |
| **Orientação** | Profa. Lauriana Paludo |
| **Cliente** | Coordenação do curso de TGI — IFPR Campus Pinhais |
| **Data deste documento** | 27 / 10 / 2026 |

---

## 1. Resumo executivo

O **ENADE Analytics** é uma solução de BI gratuita (Power BI Desktop + aplicação
web de simulados) que transforma respostas **anonimizadas** de concluintes
voluntários em visões agregadas por **eixo temático** (16 objetos da Portaria
Inep nº 171/2026), **turma** e **aplicação de simulado**.

Principais achados do **seed demo** (36 alunos, 6 turmas, 4 simulados, 4.608
respostas — metodologia validada; números mudam na coleta real com TCLE):

- Taxa geral subiu de **58,9%** (SIM-PILOTO-01) para **72,0%** (SIM-04).
- Eixo crítico: **Segurança da informação** (~34%); **Redes** e **Arquitetura** em atenção (~53–56%).
- Lacunas **não** se concentram em poucos alunos no agregado; **Segurança** é lacuna de **turma** (~69% dos alunos abaixo de 50% nesse eixo).
- **Turma EAD** (~53%) ~22 pp abaixo do **Matutino** (~75%) — cruzar RF03 com eixos críticos.

Documentação completa: marcos [0](./marco-0.md) a [5](./marco-5.md), DW
[Marco 2](./marco-2.md), mineração [Marco 3](./marco-3.md), dashboard
[Marco 4](./marco-4.md).

---

## 2. Aplicação completa

| Componente | Status | Evidência |
| --- | --- | --- |
| Banco de questões por eixo e dificuldade | Concluído | `Dim_Questao_Eixo`, `Dim_Dificuldade`; enunciados em `carga.sql` / app |
| Simulado-piloto (metodologia + seed) | Concluído (sintético) | 4 aplicações em `Dim_Tempo` (demo); coleta real pendente TCLE |
| Data Warehouse estrela (Guia Semana 7) | Concluído | [`modelo-dimensional/esquema-estrela.sql`](./modelo-dimensional/esquema-estrela.sql) |
| Mineração / lacunas | Concluído | [Marco 3](./marco-3.md) |
| Dashboard interativo | Concluído | [Marco 4](./marco-4.md) · `powerbi/ENADE_Analytics.pbix` |
| Integração cadastral (turma) | Concluído (desenho + seed) | [Marco 5](./marco-5.md) |
| TCLE / LGPD | Documento pronto | [termo-lgpd.md](./termo-lgpd.md) |
| Aplicação web de simulados | Concluído | [`enade-app/`](./enade-app/) |

---

## 3. Manual técnico

### 3.1. Atualizar o banco de questões

1. Edite questões no admin da app (`enade-app`) ou inclua linhas em
   `Dim_Questao_Eixo` + `Alternativa` via SQL.
2. Mantenha `EixoTematico` dentro dos 16 eixos (Anexo B do Marco 2) e
   `DificuldadeKey` ∈ {1 Fácil, 2 Médio, 3 Difícil}.
3. Associe questões ao simulado em `Simulado_Questao` (`TempoKey`, `QuestaoEixoKey`).

### 3.2. Aplicar um novo simulado

1. Coletar TCLE assinado ([termo-lgpd.md](./termo-lgpd.md)).
2. Criar linha em `Dim_Tempo` (`NumeroSimulado`, `CodigoSimulado`, `Data`,
   `SemanaSemestre`).
3. Divulgar simulado na app; alunos respondem com código anônimo.
4. Ao finalizar tentativas, popular `Fato_Respostas` (ETL da app ou export CSV).

### 3.3. Recarregar dados no Power BI

1. Exportar/atualizar CSVs em `modelo-dimensional/powerbi/` **ou** rodar
   `python3 modelo-dimensional/gerar_seed.py --demo` (banco rico para dashboard).
2. Abrir `powerbi/ENADE_Analytics.pbix`.
3. **Página inicial → Atualizar**.
4. Conferir taxa geral e página **Lacunas por eixo** ([tutorial](./powerbi/tutorial-marco-3.md)).

Ordem de importação CSV: `Dim_Dificuldade`, `Dim_Turma`, `Dim_Tempo`,
`Dim_Questao_Eixo`, `Dim_Aluno_Anonimo`, `Fato_Respostas`.

### 3.4. Banco MySQL (app + DW unificado)

```bash
cd enade-app
npm run db:deploy   # aplica migrations, inclusive guia_semana_7
```

Para banco de teste da app (MySQL Aiven):

```bash
cd enade-app && pnpm prisma migrate reset --force   # apaga dados de teste
./modelo-dimensional/recriar_banco_demo.sh
```

Só analítico em MySQL local: `esquema-estrela.sql` + `carga.sql` (após `gerar_seed.py --demo`).

Enunciados e alternativas da app: `enade-app/sql/navicat-enade.sql` (após `db:deploy`).

### 3.5. Resumos executivos com IA (RF07)

Use o prompt do [Marco 4, seção 5](./marco-4.md#5-resumos-executivos-ia-generativa--rf07)
com export PNG das páginas **Resumo** e **Lacunas por eixo**. Revise sempre antes
de enviar à coordenação (IA pode alucinar percentuais).

---

## 4. Roteiro de apresentação (15–20 min)

| **Bloco** | **Conteúdo** | **Tempo** |
| --- | --- | --- |
| 1. Problema | Falta de visibilidade por eixo antes do ENADE 29/11/2026 | 2 min |
| 2. Solução | DW estrela + simulado + dashboard; LGPD e agregação | 3 min |
| 3. Demo dashboard | Resumo → Lacunas (Segurança) → Evolucao → Turmas | 8 min |
| 4. Achados | Segurança crítica; +13 pp no semestre; gap EAD vs presencial | 3 min |
| 5. Próximos passos | Reforço Segurança; acompanhar EAD; validar com TCLE real | 2 min |
| 6. Perguntas | — | 2 min |

Slides sugeridos: capturas do `.pbix` + diagrama Modelo (`diagrama-powerbi.png`).

---

## 5. Critérios de sucesso — verificação final

| **Critério (briefing)** | **Atendido?** | **Evidência** |
| --- | --- | --- |
| Dashboard cobre todos os eixos do ENADE 2026 | Sim | 16 eixos no seed; barras na página Lacunas |
| Pelo menos um simulado-piloto analisado | Sim (sintético) | Quatro aplicações no Marco 3 (seed demo) |
| Dados anonimizados (LGPD) | Sim | `CodigoAlunoAnonimo`; RF08 no dashboard |
| Coordenação interpreta sem apoio técnico | Parcial | Teste interno Marco 4; validar na apresentação |
| Apresentação clara do que e por quê | Sim | Este documento + marcos 0–5 |

---

## 6. Documentos do projeto

| Marco | Documento |
| --- | --- |
| M0 | [marco-0.md](./marco-0.md) |
| M1 | [marco-1.md](./marco-1.md) · [termo-lgpd.md](./termo-lgpd.md) |
| M2 | [marco-2.md](./marco-2.md) · Guia Semana 7 (OLAP — Anexo D) |
| M3 | [marco-3.md](./marco-3.md) · [tutorial Power BI](./powerbi/tutorial-marco-3.md) |
| M4 | [marco-4.md](./marco-4.md) |
| M5 | [marco-5.md](./marco-5.md) |

---

## 7. Aprovação

| **Equipe RevelaDados** | **Coordenação / Professora orientadora** |
| --- | --- |
| Alessandro Sondey Rodrigues Lima | Lauriana Paludo |
| João Luiz Vicente Junior | Data: ____ / ____ / 2026 |
| Leandro Zeni | |
