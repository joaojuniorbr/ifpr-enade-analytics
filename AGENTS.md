# ENADE Analytics — contexto para agentes

Projeto Integrador de Business Intelligence (IFPR Pinhais, TGI). Sempre responda
em **português**. Leia este arquivo e `agents/` antes de editar marcos, o DW ou
o termo LGPD.

## O que é

SAD para a coordenação do curso preparar concluintes ao **ENADE 2026**
(prova em **29/11/2026**). Cliente: coordenação. Orientação: Profa. Lauriana Paludo.

Perguntas do dashboard: (1) pior eixo, (2) diferença entre turmas, (3) lacunas
concentradas vs distribuídas, (4) evolução no semestre.

## Equipe RevelaDados

| Pessoa | Papel |
| --- | --- |
| João Luiz Vicente Junior (João Junior) | Modelagem / liderança técnica |
| Alessandro Sondey Rodrigues Lima | Requisitos / LGPD / documentação |
| Leandro Zeni | Dashboard / storytelling |

## Regras que não se negociam

- Orçamento zero: Power BI Desktop, Forms, planilhas, IA generativa. Sem ferramenta paga.
- **Análise, mineração e dashboard: Power BI Desktop.** Não use Python/pandas para taxa, cluster ou gráfico. Tutorial: `powerbi/tutorial-marco-3.md`. Agente: skill `power-bi-especialista`.
- LGPD: sem nome, CPF, e-mail. Só `CodigoAlunoAnonimo`. Dashboard **agregado**.
- Simulado não vale nota e não substitui o ENADE oficial.
- Entregáveis acadêmicos seguem o **template da disciplina**, não uma estrutura inventada.
- Preencher o que foi **implementado**, não o planejado.

## Onde está cada coisa

| Assunto | Arquivo |
| --- | --- |
| Contexto completo | [agents/contexto.md](./agents/contexto.md) |
| Como preencher marcos | [agents/entregaveis.md](./agents/entregaveis.md) |
| DW / Kimball / eixos | [agents/modelo-dimensional.md](./agents/modelo-dimensional.md) |
| Power BI (análise e dashboard) | [agents/power-bi.md](./agents/power-bi.md) · [powerbi/tutorial-marco-3.md](./powerbi/tutorial-marco-3.md) |
| LGPD / TCLE | [agents/lgpd.md](./agents/lgpd.md) |
| Marco 0–5 e final | `marco-0.md` … `marco-5.md`, `entrega-final.md` |
| DW implementado | `modelo-dimensional/` |

Detalhe operacional: [agents/contexto.md](./agents/contexto.md).
