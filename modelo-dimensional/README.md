# Modelo dimensional — ENADE Analytics

Esquema estrela alinhado ao **Guia do Projeto — Unidade 3 (Semana 7)**.

## Arquivos

| Arquivo | Uso |
| --- | --- |
| `esquema-estrela.sql` | DDL MySQL/MariaDB (rodar primeiro) |
| `carga.sql` | Seed sintético (rodar depois) |
| `gerar_seed.py` | Regenera `carga.sql` e CSVs (`--demo` = 6 turmas, 4 simulados) |
| `recriar_banco_demo.sh` | Carga demo no MySQL da app (após `db:deploy` ou reset) |
| `esquema-estrela.dbml` | Diagrama em [dbdiagram.io](https://dbdiagram.io) |
| `powerbi/*.csv` | Importação no Power BI Desktop |

## Power BI — ordem de importação

1. `Dim_Dificuldade.csv`
2. `Dim_Turma.csv`
3. `Dim_Tempo.csv`
4. `Dim_Questao_Eixo.csv`
5. `Dim_Aluno_Anonimo.csv`
6. `Fato_Respostas.csv`

Tutorial completo: [`../powerbi/tutorial-marco-3.md`](../powerbi/tutorial-marco-3.md).

## MySQL

```bash
mysql -u USUARIO -p NOME_DO_BANCO < esquema-estrela.sql
mysql -u USUARIO -p NOME_DO_BANCO < carga.sql
```

Documentação acadêmica: [`../marco-2.md`](../marco-2.md) (inclui Anexo D — OLAP).
