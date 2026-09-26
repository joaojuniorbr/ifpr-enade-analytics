-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `nome` VARCHAR(120) NOT NULL,
    `role` ENUM('ADMIN', 'ALUNO') NOT NULL DEFAULT 'ALUNO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    INDEX `Usuario_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pergunta` (
    `id` VARCHAR(191) NOT NULL,
    `enunciado` TEXT NOT NULL,
    `eixo` VARCHAR(80) NULL,
    `tema` VARCHAR(120) NULL,
    `nivel` ENUM('FACIL', 'MEDIO', 'DIFICIL') NULL,
    `ativa` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Pergunta_ativa_idx`(`ativa`),
    INDEX `Pergunta_eixo_idx`(`eixo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alternativa` (
    `id` VARCHAR(191) NOT NULL,
    `perguntaId` VARCHAR(191) NOT NULL,
    `texto` TEXT NOT NULL,
    `correta` BOOLEAN NOT NULL DEFAULT false,
    `ordem` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Alternativa_perguntaId_idx`(`perguntaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prova` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(160) NOT NULL,
    `data` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Prova_data_idx`(`data`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProvaPergunta` (
    `provaId` VARCHAR(191) NOT NULL,
    `perguntaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProvaPergunta_perguntaId_idx`(`perguntaId`),
    PRIMARY KEY (`provaId`, `perguntaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tentativa` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(36) NOT NULL,
    `provaId` VARCHAR(191) NOT NULL,
    `iniciadaEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `concluidaEm` DATETIME(3) NULL,
    `nota` DECIMAL(5, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Tentativa_usuarioId_idx`(`usuarioId`),
    INDEX `Tentativa_provaId_idx`(`provaId`),
    INDEX `Tentativa_concluidaEm_idx`(`concluidaEm`),
    UNIQUE INDEX `Tentativa_usuarioId_provaId_key`(`usuarioId`, `provaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdemPergunta` (
    `tentativaId` VARCHAR(191) NOT NULL,
    `perguntaId` VARCHAR(191) NOT NULL,
    `posicao` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `OrdemPergunta_perguntaId_idx`(`perguntaId`),
    UNIQUE INDEX `OrdemPergunta_tentativaId_posicao_key`(`tentativaId`, `posicao`),
    PRIMARY KEY (`tentativaId`, `perguntaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resposta` (
    `id` VARCHAR(191) NOT NULL,
    `tentativaId` VARCHAR(191) NOT NULL,
    `perguntaId` VARCHAR(191) NOT NULL,
    `alternativaId` VARCHAR(191) NOT NULL,
    `acertou` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Resposta_perguntaId_idx`(`perguntaId`),
    INDEX `Resposta_alternativaId_idx`(`alternativaId`),
    INDEX `Resposta_acertou_idx`(`acertou`),
    UNIQUE INDEX `Resposta_tentativaId_perguntaId_key`(`tentativaId`, `perguntaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Alternativa` ADD CONSTRAINT `Alternativa_perguntaId_fkey` FOREIGN KEY (`perguntaId`) REFERENCES `Pergunta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProvaPergunta` ADD CONSTRAINT `ProvaPergunta_provaId_fkey` FOREIGN KEY (`provaId`) REFERENCES `Prova`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProvaPergunta` ADD CONSTRAINT `ProvaPergunta_perguntaId_fkey` FOREIGN KEY (`perguntaId`) REFERENCES `Pergunta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tentativa` ADD CONSTRAINT `Tentativa_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tentativa` ADD CONSTRAINT `Tentativa_provaId_fkey` FOREIGN KEY (`provaId`) REFERENCES `Prova`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdemPergunta` ADD CONSTRAINT `OrdemPergunta_tentativaId_fkey` FOREIGN KEY (`tentativaId`) REFERENCES `Tentativa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdemPergunta` ADD CONSTRAINT `OrdemPergunta_perguntaId_fkey` FOREIGN KEY (`perguntaId`) REFERENCES `Pergunta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resposta` ADD CONSTRAINT `Resposta_tentativaId_fkey` FOREIGN KEY (`tentativaId`) REFERENCES `Tentativa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resposta` ADD CONSTRAINT `Resposta_perguntaId_fkey` FOREIGN KEY (`perguntaId`) REFERENCES `Pergunta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resposta` ADD CONSTRAINT `Resposta_alternativaId_fkey` FOREIGN KEY (`alternativaId`) REFERENCES `Alternativa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

