# BUSINESS INTELLIGENCE — PROJETO INTEGRADOR

## INTEGRAÇÃO DE DADOS CADASTRAIS

### ENADE Analytics — Marco 5

| **Entrega** | Até o final da Semana 18 (Marco 5) |
| --- | --- |
| **Equipe** | RevelaDados |
| **Integrantes** | Alessandro Sondey Rodrigues Lima · João Luiz Vicente Junior · Leandro Zeni |
| **Responsável principal** | Alessandro Sondey Rodrigues Lima |
| **Base de referência** | [Marco 4](./marco-4.md) · [Marco 2](./marco-2.md) · Briefing (Marco 5 — ERP acadêmico) |
| **Data** | 27 / 10 / 2026 |

Requisitos: RF03, RNF01.

---

## 1. Objetivo da integração

Enriquecer o Data Warehouse com **turma/grupo oficial** vinda do cadastro acadêmico
(tipo ERP), sem trazer nome, CPF, e-mail ou RA para o modelo analítico. A
`Dim_Turma` passa a refletir a divisão real dos concluintes, permitindo **dice /
slice** confiável por turma no Power BI (pergunta 2 do briefing).

## 2. Fonte de dados cadastrais

| Fonte | Conteúdo usado | O que **não** entra no DW |
| --- | --- | --- |
| Planilha / exportação da coordenação (ERP acadêmico simulado) | Código interno de matrícula → mapeamento para `TurmaGrupo` | Nome, CPF, e-mail |
| Aplicação web [`enade-app/`](./enade-app/) | Cadastro de `TurmaGrupo` no primeiro acesso do aluno (campo agregável) | Credenciais Auth0 |

Fluxo pedagógico: a coordenação envia lista de concluintes com **turma**; a equipe
gera `CodigoAlunoAnonimo` (ex.: `Aluno_014`) e descarta a matrícula original antes
da carga (RNF01).

## 3. Campos integrados

| **Campo no DW** | **Origem cadastral** | **Uso no dashboard** |
| --- | --- | --- |
| `Dim_Turma.TurmaGrupo` | Turma no ERP (ex.: TGI Noturno A / B) | Slicer e colunas na página **Turmas** |
| `Dim_Aluno_Anonimo.TurmaKey` | FK derivada do cadastro | Drill-down interno; não expor na coordenação |
| `Fato_Respostas.TurmaKey` | Copiada na ETL a partir do aluno | Agregação direta por turma (guia Semana 7) |

No seed demo (`gerar_seed.py --demo`), `Dim_Turma.csv` traz **6 grupos** (6 alunos
cada), simulando divisão real para slice/dice no Power BI.

## 4. Processo de integração e anonimização

1. **Receber** exportação cadastral (somente turma + identificador interno temporário).
2. **Gerar** `CodigoAlunoAnonimo` sequencial; gravar mapa **fora** do Power BI (arquivo
   local criptografado ou planilha da equipe com acesso restrito).
3. **Inserir** `Dim_Turma` e atualizar `Dim_Aluno_Anonimo.TurmaKey`.
4. **Recarregar** `Fato_Respostas` com `TurmaKey` coerente (ETL ou app ao finalizar tentativa).
5. **Validar** TCLE assinado antes de incluir respostas (RNF02).

A aplicação Next.js (`enade-app`) persiste tentativas nas tabelas operacionais
(`Tentativa`, `Tentativa_Item`) ligadas ao mesmo esquema estrela em
`modelo-dimensional/esquema-estrela.sql`. Exportação periódica para CSV alimenta
o `.pbix`.

## 5. Impacto nas análises

Com cadastro integrado, a coordenação pode confiar que rótulos como **TGI EAD —
Região Metropolitana** ou **TGI Matutino — Pinhais** refletem o ERP, não chutes
da equipe. No seed demo, **TGI EAD** (~53%) fica **~22 pp** abaixo do **Matutino**
(~75%) — o dashboard da página **Turmas** já mostra **diferença material** (RF03)
e permite validar, na coleta real com TCLE, se o gap persiste.

Se uma turma oficial ficar 10+ pp abaixo das demais, manter alerta visual (faixa
Crítica na medida `[Taxa de Acerto]` filtrada).

## 6. Aprovação

| **Assinatura dos integrantes da equipe** | **Aprovação da professora orientadora** |
| --- | --- |
| Alessandro Sondey Rodrigues Lima — ____________________ | Lauriana Paludo |
| João Luiz Vicente Junior — ____________________ | Data: ____ / ____ / 2026 |
| Leandro Zeni — ____________________ | |
