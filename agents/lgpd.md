# LGPD neste projeto

Lei nº 13.709/2018. Termo: `termo-lgpd.md`. Compromissos no Marco 0 e Marco 1
(RNF01, RNF02, RF08).

## Nunca entra no DW nem no dashboard

Nome, CPF, e-mail, RA nominal, foto, ou qualquer identificador direto.

Chave analítica: `CodigoAlunoAnonimo` (ex.: `Aluno_014`), gerado **antes** da
modelagem. `TurmaGrupo` é agregado, não nome de pessoa.

Dashboard: só turma/eixo/simulado/período. Sem ficha individual.

## Coleta

Só depois do TCLE assinado. O checkbox “TCLE aplicado a todos os participantes”
no Marco 2 só recebe `[x]` após o simulado-piloto real — o seed sintético não
conta.

Simulado não gera nota, não reprova, não substitui o ENADE.

Contato da orientadora no termo: lauriana.paludo@ifpr.edu.br.
