-- ENADE Analytics — esquema estrela (Kimball)
-- Grão: 1 resposta de 1 aluno anônimo a 1 questão em 1 aplicação de simulado.
-- MySQL / MariaDB, SQLite e PostgreSQL.
-- VARCHAR (não TEXT) nas chaves UNIQUE/INDEX — o MySQL recusa TEXT sem tamanho (erro 1170).
-- Eixos: Portaria Inep nº 171/2026, Art. 6º.

DROP TABLE IF EXISTS Fato_Respostas;
DROP TABLE IF EXISTS Dim_Simulado;
DROP TABLE IF EXISTS Dim_Questao;
DROP TABLE IF EXISTS Dim_Aluno_Anonimo;
DROP TABLE IF EXISTS Dim_Tempo;

CREATE TABLE Dim_Tempo (
    TempoKey          INTEGER PRIMARY KEY,
    Data              DATE         NOT NULL UNIQUE,
    Ano               INTEGER      NOT NULL,
    Mes               INTEGER      NOT NULL,
    NomeMes           VARCHAR(20)  NOT NULL,
    SemanaSemestre    INTEGER      NOT NULL,
    CHECK (Mes BETWEEN 1 AND 12)
);

CREATE TABLE Dim_Aluno_Anonimo (
    AlunoKey              INTEGER PRIMARY KEY,
    CodigoAlunoAnonimo    VARCHAR(32)  NOT NULL UNIQUE,
    TurmaGrupo            VARCHAR(64)  NOT NULL
);

CREATE TABLE Dim_Questao (
    QuestaoKey        INTEGER PRIMARY KEY,
    CodigoQuestao     VARCHAR(32)   NOT NULL UNIQUE,
    EixoTematico      VARCHAR(128)  NOT NULL,
    NivelDificuldade  VARCHAR(16)   NOT NULL,
    CHECK (NivelDificuldade IN ('Fácil', 'Médio', 'Difícil'))
);

CREATE TABLE Dim_Simulado (
    SimuladoKey         INTEGER PRIMARY KEY,
    CodigoSimulado      VARCHAR(64)   NOT NULL UNIQUE,
    NumeroAplicacao     INTEGER       NOT NULL,
    DescricaoSimulado   VARCHAR(255)  NOT NULL
);

CREATE TABLE Fato_Respostas (
    RespostaKey              INTEGER PRIMARY KEY,
    TempoKey                 INTEGER      NOT NULL,
    AlunoKey                 INTEGER      NOT NULL,
    QuestaoKey               INTEGER      NOT NULL,
    SimuladoKey              INTEGER      NOT NULL,
    RespostaDada             VARCHAR(8)   NOT NULL,
    Acertou                  INTEGER      NOT NULL,
    TempoRespostaSegundos    DOUBLE,
    UNIQUE (AlunoKey, QuestaoKey, SimuladoKey),
    CHECK (Acertou IN (0, 1)),
    FOREIGN KEY (TempoKey)    REFERENCES Dim_Tempo (TempoKey),
    FOREIGN KEY (AlunoKey)    REFERENCES Dim_Aluno_Anonimo (AlunoKey),
    FOREIGN KEY (QuestaoKey)  REFERENCES Dim_Questao (QuestaoKey),
    FOREIGN KEY (SimuladoKey) REFERENCES Dim_Simulado (SimuladoKey)
);

CREATE INDEX IX_Fato_Tempo    ON Fato_Respostas (TempoKey);
CREATE INDEX IX_Fato_Aluno    ON Fato_Respostas (AlunoKey);
CREATE INDEX IX_Fato_Questao  ON Fato_Respostas (QuestaoKey);
CREATE INDEX IX_Fato_Simulado ON Fato_Respostas (SimuladoKey);
CREATE INDEX IX_Questao_Eixo  ON Dim_Questao (EixoTematico);
