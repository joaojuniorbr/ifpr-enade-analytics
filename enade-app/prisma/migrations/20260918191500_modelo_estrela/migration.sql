-- CreateTable
CREATE TABLE `Dim_Aluno_Anonimo` (
    `AlunoKey` INTEGER NOT NULL,
    `CodigoAlunoAnonimo` VARCHAR(32) NOT NULL,
    `TurmaGrupo` VARCHAR(64) NOT NULL,

    UNIQUE INDEX `CodigoAlunoAnonimo`(`CodigoAlunoAnonimo`),
    PRIMARY KEY (`AlunoKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dim_Questao` (
    `QuestaoKey` INTEGER NOT NULL,
    `CodigoQuestao` VARCHAR(32) NOT NULL,
    `EixoTematico` VARCHAR(128) NOT NULL,
    `NivelDificuldade` VARCHAR(16) NOT NULL,

    UNIQUE INDEX `CodigoQuestao`(`CodigoQuestao`),
    INDEX `IX_Questao_Eixo`(`EixoTematico`),
    PRIMARY KEY (`QuestaoKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dim_Simulado` (
    `SimuladoKey` INTEGER NOT NULL,
    `CodigoSimulado` VARCHAR(64) NOT NULL,
    `NumeroAplicacao` INTEGER NOT NULL,
    `DescricaoSimulado` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `CodigoSimulado`(`CodigoSimulado`),
    PRIMARY KEY (`SimuladoKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dim_Tempo` (
    `TempoKey` INTEGER NOT NULL,
    `Data` DATE NOT NULL,
    `Ano` INTEGER NOT NULL,
    `Mes` INTEGER NOT NULL,
    `NomeMes` VARCHAR(20) NOT NULL,
    `SemanaSemestre` INTEGER NOT NULL,

    UNIQUE INDEX `Data`(`Data`),
    PRIMARY KEY (`TempoKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fato_Respostas` (
    `RespostaKey` INTEGER NOT NULL,
    `TempoKey` INTEGER NOT NULL,
    `AlunoKey` INTEGER NOT NULL,
    `QuestaoKey` INTEGER NOT NULL,
    `SimuladoKey` INTEGER NOT NULL,
    `RespostaDada` VARCHAR(8) NOT NULL,
    `Acertou` INTEGER NOT NULL,
    `TempoRespostaSegundos` DOUBLE NULL,

    INDEX `IX_Fato_Aluno`(`AlunoKey`),
    INDEX `IX_Fato_Questao`(`QuestaoKey`),
    INDEX `IX_Fato_Simulado`(`SimuladoKey`),
    INDEX `IX_Fato_Tempo`(`TempoKey`),
    UNIQUE INDEX `AlunoKey`(`AlunoKey`, `QuestaoKey`, `SimuladoKey`),
    PRIMARY KEY (`RespostaKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fato_Respostas` ADD CONSTRAINT `Fato_Respostas_ibfk_1` FOREIGN KEY (`TempoKey`) REFERENCES `Dim_Tempo`(`TempoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Fato_Respostas` ADD CONSTRAINT `Fato_Respostas_ibfk_2` FOREIGN KEY (`AlunoKey`) REFERENCES `Dim_Aluno_Anonimo`(`AlunoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Fato_Respostas` ADD CONSTRAINT `Fato_Respostas_ibfk_3` FOREIGN KEY (`QuestaoKey`) REFERENCES `Dim_Questao`(`QuestaoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Fato_Respostas` ADD CONSTRAINT `Fato_Respostas_ibfk_4` FOREIGN KEY (`SimuladoKey`) REFERENCES `Dim_Simulado`(`SimuladoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

