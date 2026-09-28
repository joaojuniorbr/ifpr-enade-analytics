-- AlterTable
ALTER TABLE `Dim_Questao` ADD COLUMN `Enunciado` TEXT NULL;

-- CreateTable
CREATE TABLE `Alternativa` (
    `AlternativaKey` INTEGER NOT NULL AUTO_INCREMENT,
    `QuestaoKey` INTEGER NOT NULL,
    `Letra` VARCHAR(1) NOT NULL,
    `Texto` VARCHAR(1000) NOT NULL,
    `Correta` INTEGER NOT NULL,

    INDEX `IX_Alternativa_Questao`(`QuestaoKey`),
    UNIQUE INDEX `UQ_Alternativa_Questao_Letra`(`QuestaoKey`, `Letra`),
    PRIMARY KEY (`AlternativaKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Simulado_Questao` (
    `SimuladoKey` INTEGER NOT NULL,
    `QuestaoKey` INTEGER NOT NULL,

    INDEX `IX_Simulado_Questao_Questao`(`QuestaoKey`),
    PRIMARY KEY (`SimuladoKey`, `QuestaoKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tentativa` (
    `TentativaKey` INTEGER NOT NULL AUTO_INCREMENT,
    `AlunoKey` INTEGER NOT NULL,
    `SimuladoKey` INTEGER NOT NULL,
    `IniciadaEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `FinalizadaEm` DATETIME(3) NULL,
    `Acertos` INTEGER NOT NULL DEFAULT 0,
    `TotalQuestoes` INTEGER NOT NULL,
    `OrdemQuestoes` VARCHAR(4000) NOT NULL,

    INDEX `IX_Tentativa_Aluno_Simulado`(`AlunoKey`, `SimuladoKey`),
    INDEX `IX_Tentativa_Simulado`(`SimuladoKey`),
    PRIMARY KEY (`TentativaKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tentativa_Item` (
    `TentativaKey` INTEGER NOT NULL,
    `QuestaoKey` INTEGER NOT NULL,
    `LetraMarcada` VARCHAR(1) NOT NULL,
    `Acertou` INTEGER NOT NULL,

    INDEX `IX_Tentativa_Item_Questao`(`QuestaoKey`),
    PRIMARY KEY (`TentativaKey`, `QuestaoKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alternativa` ADD CONSTRAINT `Alternativa_ibfk_1` FOREIGN KEY (`QuestaoKey`) REFERENCES `Dim_Questao`(`QuestaoKey`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Simulado_Questao` ADD CONSTRAINT `Simulado_Questao_ibfk_1` FOREIGN KEY (`SimuladoKey`) REFERENCES `Dim_Simulado`(`SimuladoKey`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Simulado_Questao` ADD CONSTRAINT `Simulado_Questao_ibfk_2` FOREIGN KEY (`QuestaoKey`) REFERENCES `Dim_Questao`(`QuestaoKey`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tentativa` ADD CONSTRAINT `Tentativa_ibfk_1` FOREIGN KEY (`AlunoKey`) REFERENCES `Dim_Aluno_Anonimo`(`AlunoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tentativa` ADD CONSTRAINT `Tentativa_ibfk_2` FOREIGN KEY (`SimuladoKey`) REFERENCES `Dim_Simulado`(`SimuladoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tentativa_Item` ADD CONSTRAINT `Tentativa_Item_ibfk_1` FOREIGN KEY (`TentativaKey`) REFERENCES `Tentativa`(`TentativaKey`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tentativa_Item` ADD CONSTRAINT `Tentativa_Item_ibfk_2` FOREIGN KEY (`QuestaoKey`) REFERENCES `Dim_Questao`(`QuestaoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;
