-- ENADE Analytics — esquema estrela (Kimball)
-- Grão: 1 resposta de 1 aluno anônimo a 1 questão em 1 aplicação de simulado.
-- MySQL / MariaDB, SQLite e PostgreSQL.
-- VARCHAR (não TEXT) nas chaves UNIQUE/INDEX — o MySQL recusa TEXT sem tamanho (erro 1170).
-- Eixos: Portaria Inep nº 171/2026, Art. 6º.

DROP TABLE IF EXISTS Tentativa_Item;
DROP TABLE IF EXISTS Tentativa;
DROP TABLE IF EXISTS Simulado_Questao;
DROP TABLE IF EXISTS Alternativa;
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
    Enunciado         VARCHAR(4000),
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
    TempoRespostaSegundos    INTEGER,
    UNIQUE (AlunoKey, QuestaoKey, SimuladoKey),
    CHECK (Acertou IN (0, 1)),
    CHECK (TempoRespostaSegundos IS NULL OR TempoRespostaSegundos >= 0),
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

-- Conteúdo da prova na aplicação. O grão de Fato_Respostas não muda.
-- Cada questão tem uma única alternativa com Correta = 1.

CREATE TABLE Alternativa (
    AlternativaKey  INTEGER PRIMARY KEY,
    QuestaoKey      INTEGER      NOT NULL,
    Letra           VARCHAR(1)   NOT NULL,
    Texto           VARCHAR(1000) NOT NULL,
    Correta         INTEGER      NOT NULL,
    UNIQUE (QuestaoKey, Letra),
    CHECK (Letra IN ('A', 'B', 'C', 'D', 'E')),
    CHECK (Correta IN (0, 1)),
    FOREIGN KEY (QuestaoKey) REFERENCES Dim_Questao (QuestaoKey)
);

CREATE TABLE Simulado_Questao (
    SimuladoKey  INTEGER NOT NULL,
    QuestaoKey   INTEGER NOT NULL,
    PRIMARY KEY (SimuladoKey, QuestaoKey),
    FOREIGN KEY (SimuladoKey) REFERENCES Dim_Simulado (SimuladoKey),
    FOREIGN KEY (QuestaoKey)  REFERENCES Dim_Questao (QuestaoKey)
);

CREATE TABLE Tentativa (
    TentativaKey    INTEGER PRIMARY KEY,
    AlunoKey        INTEGER       NOT NULL,
    SimuladoKey     INTEGER       NOT NULL,
    IniciadaEm      VARCHAR(32)   NOT NULL,
    FinalizadaEm    VARCHAR(32),
    Acertos         INTEGER       NOT NULL,
    TotalQuestoes   INTEGER       NOT NULL,
    OrdemQuestoes   VARCHAR(4000) NOT NULL,
    FOREIGN KEY (AlunoKey)    REFERENCES Dim_Aluno_Anonimo (AlunoKey),
    FOREIGN KEY (SimuladoKey) REFERENCES Dim_Simulado (SimuladoKey)
);

CREATE TABLE Tentativa_Item (
    TentativaKey  INTEGER    NOT NULL,
    QuestaoKey    INTEGER    NOT NULL,
    LetraMarcada  VARCHAR(1) NOT NULL,
    Acertou       INTEGER    NOT NULL,
    PRIMARY KEY (TentativaKey, QuestaoKey),
    CHECK (Acertou IN (0, 1)),
    FOREIGN KEY (TentativaKey) REFERENCES Tentativa (TentativaKey),
    FOREIGN KEY (QuestaoKey)   REFERENCES Dim_Questao (QuestaoKey)
);

CREATE INDEX IX_Alternativa_Questao       ON Alternativa (QuestaoKey);
CREATE INDEX IX_Simulado_Questao_Questao  ON Simulado_Questao (QuestaoKey);
CREATE INDEX IX_Tentativa_Aluno_Simulado  ON Tentativa (AlunoKey, SimuladoKey);
CREATE INDEX IX_Tentativa_Simulado        ON Tentativa (SimuladoKey);
CREATE INDEX IX_Tentativa_Item_Questao    ON Tentativa_Item (QuestaoKey);
