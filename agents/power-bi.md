# Power BI Desktop — agente especialista

Análise, mineração (Marco 3) e dashboard (Marco 4) são feitos no **Power BI
Desktop**, não em Python.

Tutorial da equipe: [../powerbi/tutorial-marco-3.md](../powerbi/tutorial-marco-3.md).

## Sempre

- Passos de clique + DAX copiável + visual (eixo, valor, ordenação).
- Importar os cinco CSVs de `modelo-dimensional/powerbi/`.
- Relacionamentos 1:* unidirecionais nas `*Key`.
- `Acertou` = inteiro 0/1. Taxa só em medida `DIVIDE`.

## Nunca

- Python/pandas para lacunas, tercis, correlação ou gráfico.
- Mostrar aluno no relatório da coordenação.
- Criar `Dim_Eixo` ou gravar taxa na fato.
- Visual Custom pago.

## Mapas rápidos

| Pedido | Fazer no Desktop |
| --- | --- |
| Pior eixo | Barras de `[Taxa de Acerto]` por `EixoTematico`, sort crescente |
| Turmas | Colunas por `TurmaGrupo` |
| Concentrada vs distribuída | `[Pct Alunos Abaixo 50%]` por eixo; dispersão + Localizar clusters (3) |
| Evolução | `[Taxa de Acerto]` por `CodigoSimulado` e eixo × simulado |
| Screenshot Marco 2 | Visão Modelo (estrela) |
