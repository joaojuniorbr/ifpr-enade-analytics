-- Guia Semana 7: Dim_Dificuldade, Dim_Turma, Dim_Questao_Eixo, simulado em Dim_Tempo

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `Dim_Dificuldade` (
    `DificuldadeKey` INTEGER NOT NULL,
    `Nivel` VARCHAR(16) NOT NULL,
    UNIQUE INDEX `Nivel`(`Nivel`),
    PRIMARY KEY (`DificuldadeKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `Dim_Dificuldade` (`DificuldadeKey`, `Nivel`) VALUES
(1, 'Fácil'),
(2, 'Médio'),
(3, 'Difícil');

CREATE TABLE IF NOT EXISTS `Dim_Turma` (
    `TurmaKey` INTEGER NOT NULL,
    `TurmaGrupo` VARCHAR(64) NOT NULL,
    UNIQUE INDEX `TurmaGrupo`(`TurmaGrupo`),
    PRIMARY KEY (`TurmaKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `Dim_Turma` (`TurmaKey`, `TurmaGrupo`)
SELECT @row := @row + 1, d.`TurmaGrupo`
FROM (SELECT DISTINCT `TurmaGrupo` FROM `Dim_Aluno_Anonimo`) AS d
CROSS JOIN (SELECT @row := 0) AS init;

ALTER TABLE `Dim_Tempo`
    ADD COLUMN `NumeroSimulado` INTEGER NULL,
    ADD COLUMN `CodigoSimulado` VARCHAR(64) NULL,
    ADD COLUMN `DescricaoSimulado` VARCHAR(255) NULL;

UPDATE `Dim_Tempo` t
INNER JOIN `Dim_Simulado` s ON t.`TempoKey` = s.`SimuladoKey`
SET
    t.`NumeroSimulado` = s.`NumeroAplicacao`,
    t.`CodigoSimulado` = s.`CodigoSimulado`,
    t.`DescricaoSimulado` = s.`DescricaoSimulado`;

INSERT INTO `Dim_Tempo` (
    `TempoKey`, `Data`, `NumeroSimulado`, `CodigoSimulado`, `DescricaoSimulado`,
    `Ano`, `Mes`, `NomeMes`, `SemanaSemestre`
)
SELECT
    s.`SimuladoKey`,
    COALESCE(t.`Data`, CURDATE()),
    s.`NumeroAplicacao`,
    s.`CodigoSimulado`,
    s.`DescricaoSimulado`,
    COALESCE(t.`Ano`, YEAR(CURDATE())),
    COALESCE(t.`Mes`, MONTH(CURDATE())),
    COALESCE(t.`NomeMes`, 'Indefinido'),
    COALESCE(t.`SemanaSemestre`, 1)
FROM `Dim_Simulado` s
LEFT JOIN `Dim_Tempo` t ON t.`TempoKey` = s.`SimuladoKey`
WHERE t.`TempoKey` IS NULL;

UPDATE `Dim_Tempo`
SET
    `NumeroSimulado` = COALESCE(`NumeroSimulado`, `TempoKey`),
    `CodigoSimulado` = COALESCE(`CodigoSimulado`, CONCAT('SIM-', `TempoKey`)),
    `DescricaoSimulado` = COALESCE(`DescricaoSimulado`, CONCAT('Simulado ', `TempoKey`))
WHERE `CodigoSimulado` IS NULL;

ALTER TABLE `Dim_Tempo`
    MODIFY `NumeroSimulado` INTEGER NOT NULL,
    MODIFY `CodigoSimulado` VARCHAR(64) NOT NULL,
    MODIFY `DescricaoSimulado` VARCHAR(255) NOT NULL;

CREATE UNIQUE INDEX `CodigoSimulado` ON `Dim_Tempo`(`CodigoSimulado`);

RENAME TABLE `Dim_Questao` TO `Dim_Questao_Eixo`;

ALTER TABLE `Dim_Questao_Eixo`
    CHANGE COLUMN `QuestaoKey` `QuestaoEixoKey` INTEGER NOT NULL,
    ADD COLUMN `DificuldadeKey` INTEGER NULL;

UPDATE `Dim_Questao_Eixo`
SET `DificuldadeKey` = CASE
    WHEN `NivelDificuldade` COLLATE utf8mb4_unicode_ci = 'Fácil' THEN 1
    WHEN `NivelDificuldade` COLLATE utf8mb4_unicode_ci = 'Médio' THEN 2
    WHEN `NivelDificuldade` COLLATE utf8mb4_unicode_ci = 'Difícil' THEN 3
    ELSE 2
END;

ALTER TABLE `Dim_Questao_Eixo`
    MODIFY `DificuldadeKey` INTEGER NOT NULL,
    DROP COLUMN `NivelDificuldade`;

ALTER TABLE `Dim_Aluno_Anonimo` ADD COLUMN `TurmaKey` INTEGER NULL;

UPDATE `Dim_Aluno_Anonimo` a
INNER JOIN `Dim_Turma` t
    ON t.`TurmaGrupo` = (a.`TurmaGrupo` COLLATE utf8mb4_unicode_ci)
SET a.`TurmaKey` = t.`TurmaKey`;

UPDATE `Dim_Aluno_Anonimo` SET `TurmaKey` = 1 WHERE `TurmaKey` IS NULL;

ALTER TABLE `Dim_Aluno_Anonimo`
    DROP COLUMN `TurmaGrupo`,
    MODIFY `TurmaKey` INTEGER NOT NULL;

ALTER TABLE `Alternativa` CHANGE COLUMN `QuestaoKey` `QuestaoEixoKey` INTEGER NOT NULL;

ALTER TABLE `Simulado_Questao`
    CHANGE COLUMN `SimuladoKey` `TempoKey` INTEGER NOT NULL,
    CHANGE COLUMN `QuestaoKey` `QuestaoEixoKey` INTEGER NOT NULL;

ALTER TABLE `Tentativa` CHANGE COLUMN `SimuladoKey` `TempoKey` INTEGER NOT NULL;

ALTER TABLE `Tentativa_Item` CHANGE COLUMN `QuestaoKey` `QuestaoEixoKey` INTEGER NOT NULL;

CREATE TABLE `Fato_Respostas_new` (
    `RespostaKey` INTEGER NOT NULL,
    `TempoKey` INTEGER NOT NULL,
    `QuestaoEixoKey` INTEGER NOT NULL,
    `DificuldadeKey` INTEGER NOT NULL,
    `TurmaKey` INTEGER NOT NULL,
    `AlunoKey` INTEGER NOT NULL,
    `RespostaDada` VARCHAR(8) NOT NULL,
    `Acertou` INTEGER NOT NULL,
    `TempoRespostaSegundos` INTEGER NULL,
    INDEX `IX_Fato_Tempo`(`TempoKey`),
    INDEX `IX_Fato_Questao`(`QuestaoEixoKey`),
    INDEX `IX_Fato_Dificuldade`(`DificuldadeKey`),
    INDEX `IX_Fato_Turma`(`TurmaKey`),
    INDEX `IX_Fato_Aluno`(`AlunoKey`),
    UNIQUE INDEX `AlunoKey`(`AlunoKey`, `QuestaoEixoKey`, `TempoKey`),
    PRIMARY KEY (`RespostaKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `Fato_Respostas_new` (
    `RespostaKey`, `TempoKey`, `QuestaoEixoKey`, `DificuldadeKey`, `TurmaKey`, `AlunoKey`,
    `RespostaDada`, `Acertou`, `TempoRespostaSegundos`
)
SELECT
    f.`RespostaKey`,
    COALESCE(f.`TempoKey`, f.`SimuladoKey`),
    f.`QuestaoKey`,
    q.`DificuldadeKey`,
    a.`TurmaKey`,
    f.`AlunoKey`,
    f.`RespostaDada`,
    f.`Acertou`,
    CAST(f.`TempoRespostaSegundos` AS SIGNED)
FROM `Fato_Respostas` f
INNER JOIN `Dim_Questao_Eixo` q ON q.`QuestaoEixoKey` = f.`QuestaoKey`
INNER JOIN `Dim_Aluno_Anonimo` a ON a.`AlunoKey` = f.`AlunoKey`;

DROP TABLE `Fato_Respostas`;
RENAME TABLE `Fato_Respostas_new` TO `Fato_Respostas`;

DROP TABLE IF EXISTS `Dim_Simulado`;

ALTER TABLE `Dim_Questao_Eixo`
    ADD CONSTRAINT `Dim_Questao_Eixo_ibfk_1` FOREIGN KEY (`DificuldadeKey`) REFERENCES `Dim_Dificuldade`(`DificuldadeKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `Dim_Aluno_Anonimo`
    ADD CONSTRAINT `Dim_Aluno_Anonimo_ibfk_1` FOREIGN KEY (`TurmaKey`) REFERENCES `Dim_Turma`(`TurmaKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `Fato_Respostas`
    ADD CONSTRAINT `Fato_Respostas_ibfk_1` FOREIGN KEY (`TempoKey`) REFERENCES `Dim_Tempo`(`TempoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD CONSTRAINT `Fato_Respostas_ibfk_2` FOREIGN KEY (`QuestaoEixoKey`) REFERENCES `Dim_Questao_Eixo`(`QuestaoEixoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD CONSTRAINT `Fato_Respostas_ibfk_3` FOREIGN KEY (`DificuldadeKey`) REFERENCES `Dim_Dificuldade`(`DificuldadeKey`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD CONSTRAINT `Fato_Respostas_ibfk_4` FOREIGN KEY (`TurmaKey`) REFERENCES `Dim_Turma`(`TurmaKey`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    ADD CONSTRAINT `Fato_Respostas_ibfk_5` FOREIGN KEY (`AlunoKey`) REFERENCES `Dim_Aluno_Anonimo`(`AlunoKey`) ON DELETE NO ACTION ON UPDATE NO ACTION;

SET FOREIGN_KEY_CHECKS = 1;
