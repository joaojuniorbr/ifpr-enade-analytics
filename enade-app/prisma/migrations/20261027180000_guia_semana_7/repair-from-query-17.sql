-- Reparo: rode se `pnpm db:deploy` falhou na query 17 (collation TurmaGrupo).
-- Estado esperado: Dim_Dificuldade, Dim_Turma, Dim_Questao_Eixo e coluna TurmaKey já existem.

SET FOREIGN_KEY_CHECKS = 0;

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

CREATE TABLE IF NOT EXISTS `Fato_Respostas_new` (
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
