-- ENADE Analytics — esquema estrela (Guia Unidade 3 / Semana 7)
-- Grão: 1 resposta de 1 aluno anônimo a 1 questão em 1 aplicação de simulado.
-- Nomenclatura do guia: id_tempo → TempoKey, id_questao_eixo → QuestaoEixoKey,
-- id_dificuldade → DificuldadeKey, id_turma → TurmaKey.
-- VARCHAR (não TEXT) nas chaves UNIQUE/INDEX — MySQL erro 1170.
-- Eixos: Portaria Inep nº 171/2026, Art. 6º.

DROP TABLE IF EXISTS Tentativa_Item;
DROP TABLE IF EXISTS Tentativa;
DROP TABLE IF EXISTS Simulado_Questao;
DROP TABLE IF EXISTS Alternativa;
DROP TABLE IF EXISTS Fato_Respostas;
DROP TABLE IF EXISTS Dim_Aluno_Anonimo;
DROP TABLE IF EXISTS Dim_Questao_Eixo;
DROP TABLE IF EXISTS Dim_Dificuldade;
DROP TABLE IF EXISTS Dim_Turma;
DROP TABLE IF EXISTS Dim_Tempo;

CREATE TABLE Dim_Dificuldade (
    DificuldadeKey    INTEGER PRIMARY KEY,
    Nivel             VARCHAR(16)  NOT NULL UNIQUE,
    CHECK (Nivel IN ('Fácil', 'Médio', 'Difícil'))
);

CREATE TABLE Dim_Turma (
    TurmaKey          INTEGER PRIMARY KEY,
    TurmaGrupo        VARCHAR(64)  NOT NULL UNIQUE
);

CREATE TABLE Dim_Tempo (
    TempoKey          INTEGER PRIMARY KEY,
    Data              DATE         NOT NULL UNIQUE,
    NumeroSimulado    INTEGER      NOT NULL,
    CodigoSimulado    VARCHAR(64)  NOT NULL UNIQUE,
    DescricaoSimulado VARCHAR(255) NOT NULL,
    Ano               INTEGER      NOT NULL,
    Mes               INTEGER      NOT NULL,
    NomeMes           VARCHAR(20)  NOT NULL,
    SemanaSemestre    INTEGER      NOT NULL,
    CHECK (Mes BETWEEN 1 AND 12)
);

CREATE TABLE Dim_Questao_Eixo (
    QuestaoEixoKey    INTEGER PRIMARY KEY,
    CodigoQuestao     VARCHAR(32)   NOT NULL UNIQUE,
    EixoTematico      VARCHAR(128)  NOT NULL,
    Enunciado         VARCHAR(4000),
    DificuldadeKey    INTEGER       NOT NULL,
    FOREIGN KEY (DificuldadeKey) REFERENCES Dim_Dificuldade (DificuldadeKey)
);

CREATE TABLE Dim_Aluno_Anonimo (
    AlunoKey              INTEGER PRIMARY KEY,
    CodigoAlunoAnonimo    VARCHAR(32)  NOT NULL UNIQUE,
    TurmaKey              INTEGER      NOT NULL,
    FOREIGN KEY (TurmaKey) REFERENCES Dim_Turma (TurmaKey)
);

CREATE TABLE Fato_Respostas (
    RespostaKey              INTEGER PRIMARY KEY,
    TempoKey                 INTEGER      NOT NULL,
    QuestaoEixoKey           INTEGER      NOT NULL,
    DificuldadeKey           INTEGER      NOT NULL,
    TurmaKey                 INTEGER      NOT NULL,
    AlunoKey                 INTEGER      NOT NULL,
    RespostaDada             VARCHAR(8)   NOT NULL,
    Acertou                  INTEGER      NOT NULL,
    TempoRespostaSegundos    INTEGER,
    UNIQUE (AlunoKey, QuestaoEixoKey, TempoKey),
    CHECK (Acertou IN (0, 1)),
    CHECK (TempoRespostaSegundos IS NULL OR TempoRespostaSegundos >= 0),
    FOREIGN KEY (TempoKey)       REFERENCES Dim_Tempo (TempoKey),
    FOREIGN KEY (QuestaoEixoKey) REFERENCES Dim_Questao_Eixo (QuestaoEixoKey),
    FOREIGN KEY (DificuldadeKey) REFERENCES Dim_Dificuldade (DificuldadeKey),
    FOREIGN KEY (TurmaKey)       REFERENCES Dim_Turma (TurmaKey),
    FOREIGN KEY (AlunoKey)       REFERENCES Dim_Aluno_Anonimo (AlunoKey)
);

CREATE INDEX IX_Fato_Tempo       ON Fato_Respostas (TempoKey);
CREATE INDEX IX_Fato_Questao     ON Fato_Respostas (QuestaoEixoKey);
CREATE INDEX IX_Fato_Dificuldade ON Fato_Respostas (DificuldadeKey);
CREATE INDEX IX_Fato_Turma     ON Fato_Respostas (TurmaKey);
CREATE INDEX IX_Fato_Aluno     ON Fato_Respostas (AlunoKey);
CREATE INDEX IX_Questao_Eixo     ON Dim_Questao_Eixo (EixoTematico);

-- Conteúdo da prova (aplicação web). Grão analítico inalterado.

CREATE TABLE Alternativa (
    AlternativaKey  INTEGER PRIMARY KEY,
    QuestaoEixoKey  INTEGER       NOT NULL,
    Letra           VARCHAR(1)    NOT NULL,
    Texto           VARCHAR(1000) NOT NULL,
    Correta         INTEGER       NOT NULL,
    UNIQUE (QuestaoEixoKey, Letra),
    CHECK (Letra IN ('A', 'B', 'C', 'D', 'E')),
    CHECK (Correta IN (0, 1)),
    FOREIGN KEY (QuestaoEixoKey) REFERENCES Dim_Questao_Eixo (QuestaoEixoKey)
);

CREATE TABLE Simulado_Questao (
    TempoKey        INTEGER NOT NULL,
    QuestaoEixoKey  INTEGER NOT NULL,
    PRIMARY KEY (TempoKey, QuestaoEixoKey),
    FOREIGN KEY (TempoKey)       REFERENCES Dim_Tempo (TempoKey),
    FOREIGN KEY (QuestaoEixoKey) REFERENCES Dim_Questao_Eixo (QuestaoEixoKey)
);

CREATE TABLE Tentativa (
    TentativaKey    INTEGER PRIMARY KEY,
    AlunoKey        INTEGER       NOT NULL,
    TempoKey        INTEGER       NOT NULL,
    IniciadaEm      VARCHAR(32)   NOT NULL,
    FinalizadaEm    VARCHAR(32),
    Acertos         INTEGER       NOT NULL,
    TotalQuestoes   INTEGER       NOT NULL,
    OrdemQuestoes   VARCHAR(4000) NOT NULL,
    FOREIGN KEY (AlunoKey) REFERENCES Dim_Aluno_Anonimo (AlunoKey),
    FOREIGN KEY (TempoKey) REFERENCES Dim_Tempo (TempoKey)
);

CREATE TABLE Tentativa_Item (
    TentativaKey    INTEGER    NOT NULL,
    QuestaoEixoKey  INTEGER    NOT NULL,
    LetraMarcada    VARCHAR(1) NOT NULL,
    Acertou         INTEGER    NOT NULL,
    PRIMARY KEY (TentativaKey, QuestaoEixoKey),
    CHECK (Acertou IN (0, 1)),
    FOREIGN KEY (TentativaKey)   REFERENCES Tentativa (TentativaKey),
    FOREIGN KEY (QuestaoEixoKey) REFERENCES Dim_Questao_Eixo (QuestaoEixoKey)
);

CREATE INDEX IX_Alternativa_Questao      ON Alternativa (QuestaoEixoKey);
CREATE INDEX IX_Simulado_Questao_Questao ON Simulado_Questao (QuestaoEixoKey);
CREATE INDEX IX_Tentativa_Aluno_Tempo    ON Tentativa (AlunoKey, TempoKey);
CREATE INDEX IX_Tentativa_Tempo          ON Tentativa (TempoKey);
CREATE INDEX IX_Tentativa_Item_Questao   ON Tentativa_Item (QuestaoEixoKey);
