-- ENADE Analytics — conteúdo das questões para o Navicat (MySQL)
-- Rode este arquivo no banco da aplicação, que já tem o modelo estrela.
-- Não apaga Dim_Tempo, Dim_Aluno_Anonimo, Dim_Simulado nem Fato_Respostas.
--
-- As 32 perguntas são originais de treino, uma para cada objeto de conhecimento
-- da Portaria Inep nº 171/2026, art. 6º, em dois níveis. Não são itens oficiais do ENADE.
-- Simulado 1 (SIM-PILOTO-01): questões ímpares, um eixo cada.
-- Simulado 2 (SIM-02): questões pares, o outro nível de cada eixo.
-- Pode rodar de novo: enunciados, alternativas e vínculos são regravados.

SET NAMES utf8mb4;

SET @tem_enunciado := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Dim_Questao'
    AND COLUMN_NAME = 'Enunciado'
);
SET @sql_enunciado := IF(
  @tem_enunciado = 0,
  'ALTER TABLE Dim_Questao ADD COLUMN Enunciado TEXT NULL',
  'SELECT 1'
);
PREPARE stmt_enunciado FROM @sql_enunciado;
EXECUTE stmt_enunciado;
DEALLOCATE PREPARE stmt_enunciado;

CREATE TABLE IF NOT EXISTS Alternativa (
  AlternativaKey INTEGER NOT NULL AUTO_INCREMENT,
  QuestaoKey INTEGER NOT NULL,
  Letra VARCHAR(1) NOT NULL,
  Texto VARCHAR(1000) NOT NULL,
  Correta INTEGER NOT NULL,
  PRIMARY KEY (AlternativaKey),
  UNIQUE KEY UQ_Alternativa_Questao_Letra (QuestaoKey, Letra),
  KEY IX_Alternativa_Questao (QuestaoKey),
  CONSTRAINT Alternativa_ibfk_1 FOREIGN KEY (QuestaoKey) REFERENCES Dim_Questao (QuestaoKey) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Simulado_Questao (
  SimuladoKey INTEGER NOT NULL,
  QuestaoKey INTEGER NOT NULL,
  PRIMARY KEY (SimuladoKey, QuestaoKey),
  KEY IX_Simulado_Questao_Questao (QuestaoKey),
  CONSTRAINT Simulado_Questao_ibfk_1 FOREIGN KEY (SimuladoKey) REFERENCES Dim_Simulado (SimuladoKey) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT Simulado_Questao_ibfk_2 FOREIGN KEY (QuestaoKey) REFERENCES Dim_Questao (QuestaoKey) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Tentativa (
  TentativaKey INTEGER NOT NULL AUTO_INCREMENT,
  AlunoKey INTEGER NOT NULL,
  SimuladoKey INTEGER NOT NULL,
  IniciadaEm DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FinalizadaEm DATETIME(3) NULL,
  Acertos INTEGER NOT NULL DEFAULT 0,
  TotalQuestoes INTEGER NOT NULL,
  OrdemQuestoes VARCHAR(4000) NOT NULL,
  PRIMARY KEY (TentativaKey),
  KEY IX_Tentativa_Aluno_Simulado (AlunoKey, SimuladoKey),
  KEY IX_Tentativa_Simulado (SimuladoKey),
  CONSTRAINT Tentativa_ibfk_1 FOREIGN KEY (AlunoKey) REFERENCES Dim_Aluno_Anonimo (AlunoKey) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT Tentativa_ibfk_2 FOREIGN KEY (SimuladoKey) REFERENCES Dim_Simulado (SimuladoKey) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Tentativa_Item (
  TentativaKey INTEGER NOT NULL,
  QuestaoKey INTEGER NOT NULL,
  LetraMarcada VARCHAR(1) NOT NULL,
  Acertou INTEGER NOT NULL,
  PRIMARY KEY (TentativaKey, QuestaoKey),
  KEY IX_Tentativa_Item_Questao (QuestaoKey),
  CONSTRAINT Tentativa_Item_ibfk_1 FOREIGN KEY (TentativaKey) REFERENCES Tentativa (TentativaKey) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT Tentativa_Item_ibfk_2 FOREIGN KEY (QuestaoKey) REFERENCES Dim_Questao (QuestaoKey) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

START TRANSACTION;

UPDATE Dim_Questao AS q
JOIN (
  SELECT 1 AS QuestaoKey, 'Uma busca linear percorre uma lista não ordenada de n elementos até achar o valor ou chegar ao fim. No pior caso, quantas comparações esse algoritmo realiza?' AS Enunciado
  UNION ALL
  SELECT 2 AS QuestaoKey, 'No quicksort, quando o pivô divide o vetor de forma equilibrada a cada passo, a complexidade de tempo média fica em qual classe?' AS Enunciado
  UNION ALL
  SELECT 3 AS QuestaoKey, 'A memória cache fica entre o processador e a memória principal. Qual é o papel dela na arquitetura?' AS Enunciado
  UNION ALL
  SELECT 4 AS QuestaoKey, 'No modelo de von Neumann, como instruções e dados se relacionam com a memória?' AS Enunciado
  UNION ALL
  SELECT 5 AS QuestaoKey, 'As condições de Coffman descrevem quando processos podem entrar em deadlock. Além da espera circular, quais condições completam esse conjunto?' AS Enunciado
  UNION ALL
  SELECT 6 AS QuestaoKey, 'O escalonador de processos do sistema operacional decide, entre os processos prontos, qual deles:' AS Enunciado
  UNION ALL
  SELECT 7 AS QuestaoKey, 'Em uma tabela relacional, a chave primária tem qual função?' AS Enunciado
  UNION ALL
  SELECT 8 AS QuestaoKey, 'A terceira forma normal procura eliminar que tipo de redundância em relação à chave da tabela?' AS Enunciado
  UNION ALL
  SELECT 9 AS QuestaoKey, 'No Scrum, qual artefato reúne o que o time se compromete a entregar na sprint atual?' AS Enunciado
  UNION ALL
  SELECT 10 AS QuestaoKey, 'Um módulo com acoplamento alto e coesão baixa tende a apresentar qual característica de manutenção?' AS Enunciado
  UNION ALL
  SELECT 11 AS QuestaoKey, 'Na rede de um cronograma, as atividades do caminho crítico têm folga total igual a:' AS Enunciado
  UNION ALL
  SELECT 12 AS QuestaoKey, 'O escopo de um projeto serve para registrar:' AS Enunciado
  UNION ALL
  SELECT 13 AS QuestaoKey, 'Um feedback útil para uma equipe de TI deve ser:' AS Enunciado
  UNION ALL
  SELECT 14 AS QuestaoKey, 'A matriz RACI é usada na organização do trabalho para deixar claro:' AS Enunciado
  UNION ALL
  SELECT 15 AS QuestaoKey, 'Na prática de gestão de incidentes descrita pela ITIL, o objetivo imediato é:' AS Enunciado
  UNION ALL
  SELECT 16 AS QuestaoKey, 'Na ITIL, um problema se diferencia de um incidente porque o problema:' AS Enunciado
  UNION ALL
  SELECT 17 AS QuestaoKey, 'Em um modelo estrela de data warehouse, a tabela fato ocupa qual papel?' AS Enunciado
  UNION ALL
  SELECT 18 AS QuestaoKey, 'Um painel de inteligência de negócio apoia a gestão quando apresenta:' AS Enunciado
  UNION ALL
  SELECT 19 AS QuestaoKey, 'No sentido do COBIT, a governança de TI existe para:' AS Enunciado
  UNION ALL
  SELECT 20 AS QuestaoKey, 'Separar governança e gestão, como faz o COBIT, significa que a governança:' AS Enunciado
  UNION ALL
  SELECT 21 AS QuestaoKey, 'A análise SWOT organiza o diagnóstico estratégico em quatro grupos. Quais são eles?' AS Enunciado
  UNION ALL
  SELECT 22 AS QuestaoKey, 'No modelo VRIO, um recurso sustenta vantagem competitiva quando é valioso, raro, difícil de imitar e:' AS Enunciado
  UNION ALL
  SELECT 23 AS QuestaoKey, 'Em um processo, o gargalo é a etapa que:' AS Enunciado
  UNION ALL
  SELECT 24 AS QuestaoKey, 'Um fluxograma de processo é desenhado para mostrar:' AS Enunciado
  UNION ALL
  SELECT 25 AS QuestaoKey, 'Na rede TCP/IP, o endereço IP serve para:' AS Enunciado
  UNION ALL
  SELECT 26 AS QuestaoKey, 'Uma aplicação escolhe TCP, e não UDP, quando precisa de:' AS Enunciado
  UNION ALL
  SELECT 27 AS QuestaoKey, 'O princípio do menor privilégio recomenda que cada conta receba:' AS Enunciado
  UNION ALL
  SELECT 28 AS QuestaoKey, 'Na tríade confidencialidade, integridade e disponibilidade, integridade significa que:' AS Enunciado
  UNION ALL
  SELECT 29 AS QuestaoKey, 'Um sistema de informações gerenciais apoia sobretudo o nível tático com:' AS Enunciado
  UNION ALL
  SELECT 30 AS QuestaoKey, 'Em relação a um sistema transacional, o sistema de informações gerenciais enfatiza:' AS Enunciado
  UNION ALL
  SELECT 31 AS QuestaoKey, 'Pela Lei Geral de Proteção de Dados, dado pessoal é informação ligada a pessoa natural identificada ou identificável. O tratamento desse dado exige:' AS Enunciado
  UNION ALL
  SELECT 32 AS QuestaoKey, 'Anonimizar um dado, no sentido da LGPD, significa usar meios razoáveis pelos quais:' AS Enunciado
) AS origem ON origem.QuestaoKey = q.QuestaoKey
SET q.Enunciado = origem.Enunciado;

DELETE FROM Alternativa WHERE QuestaoKey BETWEEN 1 AND 32;

INSERT INTO Alternativa (AlternativaKey, QuestaoKey, Letra, Texto, Correta) VALUES
(1, 1, 'A', '1 comparação, qualquer que seja n.', 0),
(2, 1, 'B', 'Cerca de log2 de n comparações.', 0),
(3, 1, 'C', 'n comparações, uma para cada elemento.', 1),
(4, 1, 'D', 'n vezes log2 de n comparações.', 0),
(5, 1, 'E', 'n ao quadrado comparações.', 0),
(6, 2, 'A', 'O(1), pois o pivô elimina a ordenação.', 0),
(7, 2, 'B', 'O(n log n).', 1),
(8, 2, 'C', 'O(n²) em todo caso, mesmo com divisões equilibradas.', 0),
(9, 2, 'D', 'O(log n), independente do tamanho do vetor.', 0),
(10, 2, 'E', 'O(n), com uma única passagem.', 0),
(11, 3, 'A', 'Substituir de forma permanente o disco de armazenamento.', 0),
(12, 3, 'B', 'Guardar os dados e instruções usados com mais frequência, encurtando o tempo de acesso.', 1),
(13, 3, 'C', 'Aumentar a capacidade da RAM em terabytes.', 0),
(14, 3, 'D', 'Executar o sistema operacional no lugar da CPU.', 0),
(15, 3, 'E', 'Armazenar apenas o firmware de forma volátil.', 0),
(16, 4, 'A', 'Cada um usa uma memória principal distinta, como na arquitetura Harvard.', 0),
(17, 4, 'B', 'Instruções e dados compartilham a mesma memória principal.', 1),
(18, 4, 'C', 'Os dois residem só em registradores e não vão à memória.', 0),
(19, 4, 'D', 'A CPU executa o programa lendo direto do disco, sem memória.', 0),
(20, 4, 'E', 'A unidade de controle fica fora do ciclo de busca e execução.', 0),
(21, 5, 'A', 'Exclusão mútua, posse e espera, e não preempção.', 1),
(22, 5, 'B', 'Apenas uso alto de CPU e memória livre.', 0),
(23, 5, 'C', 'Um único processo e ausência de entrada e saída.', 0),
(24, 5, 'D', 'Memória virtual desligada e disco cheio.', 0),
(25, 5, 'E', 'Somente a falta de interface gráfica.', 0),
(26, 6, 'A', 'Recebe a CPU naquele momento.', 1),
(27, 6, 'B', 'Define o preço da licença do software.', 0),
(28, 6, 'C', 'Escolhe o endereço MAC da placa de rede.', 0),
(29, 6, 'D', 'Grava a chave primária do banco.', 0),
(30, 6, 'E', 'Desenha o layout da tela do usuário.', 0),
(31, 7, 'A', 'Repetir o mesmo valor em várias linhas da tabela.', 0),
(32, 7, 'B', 'Identificar de forma única cada linha.', 1),
(33, 7, 'C', 'Guardar somente textos longos.', 0),
(34, 7, 'D', 'Substituir toda chave estrangeira do banco.', 0),
(35, 7, 'E', 'Impedir o uso de números.', 0),
(36, 8, 'A', 'Dependência transitiva de atributos não chave.', 1),
(37, 8, 'B', 'Toda chave estrangeira, mesmo as necessárias.', 0),
(38, 8, 'C', 'Qualquer índice de consulta.', 0),
(39, 8, 'D', 'O uso da linguagem SQL.', 0),
(40, 8, 'E', 'Tabelas que tenham mais de duas colunas.', 0),
(41, 9, 'A', 'O product backlog inteiro, sem seleção.', 0),
(42, 9, 'B', 'O sprint backlog.', 1),
(43, 9, 'C', 'O contrato de escopo fechado do ano.', 0),
(44, 9, 'D', 'O diagrama de Gantt obrigatório da sprint.', 0),
(45, 9, 'E', 'O organograma da empresa.', 0),
(46, 10, 'A', 'Fica isolado dos outros módulos e é simples de alterar.', 0),
(47, 10, 'B', 'Depende muito de outros módulos e mistura responsabilidades, o que dificulta a mudança.', 1),
(48, 10, 'C', 'Dispensa teste, porque a lógica está espalhada.', 0),
(49, 10, 'D', 'Exige microsserviço em todo projeto.', 0),
(50, 10, 'E', 'Elimina a necessidade de requisitos.', 0),
(51, 11, 'A', 'A duração somada de todo o projeto.', 0),
(52, 11, 'B', 'Zero.', 1),
(53, 11, 'C', 'O número de pessoas da equipe.', 0),
(54, 11, 'D', 'Um valor sempre negativo.', 0),
(55, 11, 'E', 'O prazo que o patrocinador escolher depois da entrega.', 0),
(56, 12, 'A', 'O que será entregue e o que fica de fora.', 1),
(57, 12, 'B', 'Somente o salário da equipe.', 0),
(58, 12, 'C', 'O endereço IP dos servidores.', 0),
(59, 12, 'D', 'A chave criptográfica do ambiente.', 0),
(60, 12, 'E', 'O organograma completo da instituição, sem ligação com a entrega.', 0),
(61, 13, 'A', 'Público, vago e comparado com o colega ao lado.', 0),
(62, 13, 'B', 'Específico, baseado em fatos observáveis e orientado à melhoria.', 1),
(63, 13, 'C', 'Guardado para o dia do desligamento.', 0),
(64, 13, 'D', 'Substituído pela contagem de linhas de código.', 0),
(65, 13, 'E', 'Limitado a elogios, sem apontar o que ajustar.', 0),
(66, 14, 'A', 'O retorno financeiro de um servidor.', 0),
(67, 14, 'B', 'Quem executa, quem aprova, quem é consultado e quem é informado.', 1),
(68, 14, 'C', 'A latência da rede local.', 0),
(69, 14, 'D', 'O plano de cargos e salários inteiro.', 0),
(70, 14, 'E', 'O algoritmo de ordenação do sistema.', 0),
(71, 15, 'A', 'Redesenhar o processo de negócio antes de qualquer ação.', 0),
(72, 15, 'B', 'Restaurar o serviço o quanto antes, reduzindo o impacto para quem usa.', 1),
(73, 15, 'C', 'Descobrir a causa raiz em todos os casos antes de aplicar um contorno.', 0),
(74, 15, 'D', 'Encerrar o acordo de nível de serviço.', 0),
(75, 15, 'E', 'Trocar o fornecedor no mesmo chamado.', 0),
(76, 16, 'A', 'É apenas um pedido de troca de senha.', 0),
(77, 16, 'B', 'Trata a causa, ou a causa potencial, de um ou mais incidentes.', 1),
(78, 16, 'C', 'É resolvido pelo usuário sem registro.', 0),
(79, 16, 'D', 'Não pode ser documentado.', 0),
(80, 16, 'E', 'É o mesmo que uma mudança padrão já autorizada.', 0),
(81, 17, 'A', 'Guarda só textos descritivos e não tem medida.', 0),
(82, 17, 'B', 'Fica no centro, no grão do processo, e se liga às dimensões.', 1),
(83, 17, 'C', 'Substitui todas as dimensões do modelo.', 0),
(84, 17, 'D', 'Não pode ser lida por uma ferramenta de painel.', 0),
(85, 17, 'E', 'Armazena a taxa de acerto já calculada como única coluna permitida.', 0),
(86, 18, 'A', 'Indicadores agregados e comparáveis, sem expor dado pessoal desnecessário.', 1),
(87, 18, 'B', 'CPF e e-mail de cada estudante.', 0),
(88, 18, 'C', 'A nota oficial do ENADE no lugar da prova.', 0),
(89, 18, 'D', 'Uma tela sem filtro e sem contexto.', 0),
(90, 18, 'E', 'A senha dos usuários do sistema.', 0),
(91, 19, 'A', 'Escrever as rotinas do sistema no lugar da equipe técnica.', 0),
(92, 19, 'B', 'Alinhar a TI aos objetivos da organização e prestar contas do valor gerado.', 1),
(93, 19, 'C', 'Extinguir a área de negócio.', 0),
(94, 19, 'D', 'Atender sozinha cada chamado de suporte.', 0),
(95, 19, 'E', 'Escolher a cor do logotipo.', 0),
(96, 20, 'A', 'Executa o backup diário.', 0),
(97, 20, 'B', 'Avalia, dirige e monitora, enquanto a gestão planeja, constrói, executa e acompanha a operação.', 1),
(98, 20, 'C', 'Substitui o serviço de atendimento.', 0),
(99, 20, 'D', 'Mantém o código-fonte.', 0),
(100, 20, 'E', 'Define o endereço IP de cada estação.', 0),
(101, 21, 'A', 'Forças, fraquezas, oportunidades e ameaças.', 1),
(102, 21, 'B', 'Somente receitas e despesas.', 0),
(103, 21, 'C', 'Protocolos de rede e seus endereços.', 0),
(104, 21, 'D', 'Permissões de arquivo do servidor.', 0),
(105, 21, 'E', 'O cronograma de férias da equipe.', 0),
(106, 22, 'A', 'Mais barato que qualquer alternativa do mercado.', 0),
(107, 22, 'B', 'A organização está preparada para explorá-lo.', 1),
(108, 22, 'C', 'Idêntico ao recurso do principal concorrente.', 0),
(109, 22, 'D', 'Exclusivamente um ativo físico.', 0),
(110, 22, 'E', 'Publicado sem nenhum meio de proteção.', 0),
(111, 23, 'A', 'Tem a maior capacidade ociosa.', 0),
(112, 23, 'B', 'Limita a vazão do processo inteiro.', 1),
(113, 23, 'C', 'Pode ser retirada sem mudar o resultado.', 0),
(114, 23, 'D', 'É sempre a primeira atividade do fluxo.', 0),
(115, 23, 'E', 'Não consome tempo nem recurso.', 0),
(116, 24, 'A', 'A sequência de atividades, decisões e entregas.', 1),
(117, 24, 'B', 'O hash de uma senha.', 0),
(118, 24, 'C', 'A estrutura física do banco de dados.', 0),
(119, 24, 'D', 'A frequência do clock da CPU.', 0),
(120, 24, 'E', 'A lista de clientes sem relação com o fluxo.', 0),
(121, 25, 'A', 'Identificar um host e permitir o encaminhamento dos pacotes.', 1),
(122, 25, 'B', 'Indicar o fabricante do monitor.', 0),
(123, 25, 'C', 'Substituir a chave primária de um aluno.', 0),
(124, 25, 'D', 'Registrar o cargo do gestor.', 0),
(125, 25, 'E', 'Escolher o algoritmo de ordenação.', 0),
(126, 26, 'A', 'Envio sem garantia de entrega e sem ordem.', 0),
(127, 26, 'B', 'Conexão, ordem dos dados e confirmação de recebimento.', 1),
(128, 26, 'C', 'Apenas tradução de nome em endereço.', 0),
(129, 26, 'D', 'Somente o endereço físico da placa.', 0),
(130, 26, 'E', 'Criptografia do disco local.', 0),
(131, 27, 'A', 'Perfil de administrador, para evitar novos chamados.', 0),
(132, 27, 'B', 'Somente as permissões necessárias para a tarefa.', 1),
(133, 27, 'C', 'Acesso sem autenticação, em nome da agilidade.', 0),
(134, 27, 'D', 'Uma senha compartilhada por toda a equipe.', 0),
(135, 27, 'E', 'O banco publicado na internet, sem controle.', 0),
(136, 28, 'A', 'Somente o dono consegue ler o dado.', 0),
(137, 28, 'B', 'O dado não foi alterado de modo não autorizado.', 1),
(138, 28, 'C', 'O serviço permanece no ar o tempo todo.', 0),
(139, 28, 'D', 'A senha pode ser curta se for fácil de lembrar.', 0),
(140, 28, 'E', 'A cópia de segurança foi apagada.', 0),
(141, 29, 'A', 'Relatórios periódicos e consolidados para acompanhar a operação.', 1),
(142, 29, 'B', 'Código de máquina do processador.', 0),
(143, 29, 'C', 'A troca física da placa-mãe.', 0),
(144, 29, 'D', 'A configuração do DHCP.', 0),
(145, 29, 'E', 'A marcação de ponto bruta, sem qualquer síntese.', 0),
(146, 30, 'A', 'Cada venda no caixa, linha a linha, sem consolidar.', 0),
(147, 30, 'B', 'A síntese da operação para apoiar a decisão da gestão.', 1),
(148, 30, 'C', 'O desenho do circuito da placa.', 0),
(149, 30, 'D', 'A compilação do núcleo do sistema operacional.', 0),
(150, 30, 'E', 'O tipo de cabo da rede.', 0),
(151, 31, 'A', 'Uma base legal.', 1),
(152, 31, 'B', 'Apenas o número de patrimônio do computador.', 0),
(153, 31, 'C', 'Publicação livre, sem informar o titular.', 0),
(154, 31, 'D', 'Que o dado já esteja anonimizado, senão a lei não se aplica.', 0),
(155, 31, 'E', 'Venda do cadastro sem qualquer comunicação.', 0),
(156, 32, 'A', 'O nome vira um apelido e a tabela de volta fica pública.', 0),
(157, 32, 'B', 'A pessoa não possa ser identificada.', 1),
(158, 32, 'C', 'O CPF muda de coluna e continua consultável.', 0),
(159, 32, 'D', 'O e-mail é enviado só para a coordenação.', 0),
(160, 32, 'E', 'Basta guardar o primeiro nome.', 0);

DELETE FROM Simulado_Questao WHERE SimuladoKey IN (1, 2);

INSERT INTO Simulado_Questao (SimuladoKey, QuestaoKey) VALUES
(1, 1),
(2, 2),
(1, 3),
(2, 4),
(1, 5),
(2, 6),
(1, 7),
(2, 8),
(1, 9),
(2, 10),
(1, 11),
(2, 12),
(1, 13),
(2, 14),
(1, 15),
(2, 16),
(1, 17),
(2, 18),
(1, 19),
(2, 20),
(1, 21),
(2, 22),
(1, 23),
(2, 24),
(1, 25),
(2, 26),
(1, 27),
(2, 28),
(1, 29),
(2, 30),
(1, 31),
(2, 32);

COMMIT;
