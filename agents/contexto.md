# Contexto do projeto

- **Nome:** ENADE Analytics
- **Curso:** Tecnologia em Gestão da Informação — IFPR Campus Pinhais
- **Disciplina:** Business Intelligence (Projeto Integrador)
- **Prova oficial:** 29/11/2026
- **Norma dos eixos:** Portaria Inep nº 171/2026, Art. 6º (16 objetos de conhecimento)
- **Modelo de decisão:** Simon (concepção → requisitos no Marco 1)

## Stack

Microsoft Forms → planilha/CSV → Power BI Desktop. Sem banco pago. Seed local em
`modelo-dimensional/powerbi/`.

## Marcos

| Marco | Semana | Entregável | Arquivo | Status típico |
| --- | --- | --- | --- | --- |
| 0 | 2 | Termo de abertura | `marco-0.md` | Concluído |
| 1 | 4 | Matriz de requisitos + TCLE | `marco-1.md`, `termo-lgpd.md` | Concluído |
| 2 | 8 | Modelo de dados (DW) | `marco-2.md`, `modelo-dimensional/` | Modelo definido; falta captura Power BI |
| 3 | 13 | Mineração / lacunas | `marco-3.md` | Pendente |
| 4 | 16 | Dashboard | `marco-4.md` | Pendente |
| 5 | 18 | Dados cadastrais (ERP acadêmico, anonimizados) | `marco-5.md` | Pendente |
| Final | 19–20 | Manual + apresentação | `entrega-final.md` | Pendente |

## Requisitos (IDs oficiais do Marco 1)

Não renumerar. Se um template externo usar IDs diferentes, mapear para estes.

- RF01 classificar questão por eixo
- RF02 desempenho médio por eixo
- RF03 comparar turmas/grupos
- RF04 lacunas concentradas vs distribuídas
- RF05 evolução no semestre
- RF06 registrar respostas ligadas a eixo e turma
- RF07 resumo executivo com IA (Marco 4)
- RF08 dashboard só agregado
- RNF01 anonimizar antes da análise
- RNF02 TCLE antes da coleta
- RNF03 só ferramentas gratuitas
- RNF04 dashboard legível pela coordenação
- RNF05 cronograma dos marcos

## Fora de escopo

Identificar aluno no dashboard; usar resultado para nota; substituir o ENADE;
ferramenta paga.
