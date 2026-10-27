#!/usr/bin/env python3
"""Gera CSVs (Power BI) e carga.sql. Use --demo para banco rico (turmas, simulados)."""

from __future__ import annotations

import argparse
import csv
import random
import re
from pathlib import Path

from enunciados import ENUNCIADOS

random.seed(42)

OUT = Path(__file__).parent / "powerbi"
NAVICAT = Path(__file__).parent.parent / "enade-app/sql/navicat-enade.sql"

EIXOS = [
    "Algoritmos",
    "Arquitetura de computadores",
    "Sistemas operacionais",
    "Banco de dados",
    "Engenharia de software",
    "Gerência de projetos",
    "Gestão de pessoas",
    "Gestão dos serviços de TI",
    "Tecnologias para inteligência de negócio",
    "Governança de tecnologia da informação",
    "Gestão estratégica organizacional",
    "Processos organizacionais",
    "Redes de computadores",
    "Segurança da informação",
    "Sistemas de informações gerenciais",
    "Ética, tecnologia e sociedade",
]

ACERTO_EIXO = {
    "Algoritmos": 0.45,
    "Arquitetura de computadores": 0.50,
    "Sistemas operacionais": 0.55,
    "Banco de dados": 0.58,
    "Engenharia de software": 0.62,
    "Gerência de projetos": 0.65,
    "Gestão de pessoas": 0.70,
    "Gestão dos serviços de TI": 0.60,
    "Tecnologias para inteligência de negócio": 0.72,
    "Governança de tecnologia da informação": 0.48,
    "Gestão estratégica organizacional": 0.63,
    "Processos organizacionais": 0.68,
    "Redes de computadores": 0.40,
    "Segurança da informação": 0.35,
    "Sistemas de informações gerenciais": 0.66,
    "Ética, tecnologia e sociedade": 0.75,
}

DIFICULDADE_KEY = {"Fácil": 1, "Médio": 2, "Difícil": 3}
AJUSTE_DIFICULDADE = {"Fácil": 0.12, "Médio": 0.00, "Difícil": -0.12}
ALTERNATIVAS = ["A", "B", "C", "D", "E"]

# Perfil demo: turmas com desempenho distinto no dashboard
TURMAS_DEMO = [
    (1, "TGI Noturno A — Pinhais", 0.04),
    (2, "TGI Noturno B — Pinhais", 0.00),
    (3, "TGI Noturno C — Pinhais", -0.06),
    (4, "TGI Matutino — Pinhais", 0.10),
    (5, "TGI Integrado — Colombo", 0.02),
    (6, "TGI EAD — Região Metropolitana", -0.10),
]

SIMULADOS_DEMO = [
    (1, "2026-09-10", 1, "SIM-PILOTO-01", "Simulado-piloto ENADE Analytics", 9, "Setembro", 8, 0.00),
    (2, "2026-10-22", 2, "SIM-02", "Simulado diagnóstico — outubro", 10, "Outubro", 14, 0.08),
    (3, "2026-11-05", 3, "SIM-03", "Simulado reforço — novembro", 11, "Novembro", 17, 0.12),
    (4, "2026-11-19", 4, "SIM-04", "Simulado pré-ENADE — reta final", 11, "Novembro", 19, 0.16),
]

ALUNOS_POR_TURMA_DEMO = 6


def sql_literal(valor) -> str:
    if valor is None:
        return "NULL"
    if isinstance(valor, bool):
        return "1" if valor else "0"
    if isinstance(valor, int) and not isinstance(valor, bool):
        return str(valor)
    return "'" + str(valor).replace("\\", "\\\\").replace("'", "''") + "'"


def escrever_csv(nome: str, campos: list[str], linhas: list[dict]) -> None:
    caminho = OUT / nome
    with caminho.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=campos,
            quoting=csv.QUOTE_NONNUMERIC,
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(linhas)


def escrever_insert(fh, tabela: str, linhas: list[dict]) -> None:
    if not linhas:
        return
    cols = list(linhas[0].keys())
    fh.write(f"INSERT INTO {tabela} ({', '.join(cols)}) VALUES\n")
    valores = []
    for linha in linhas:
        items = ", ".join(sql_literal(linha[c]) for c in cols)
        valores.append(f"({items})")
    fh.write(",\n".join(valores))
    fh.write(";\n\n")


def parse_alternativas_navicat() -> list[dict]:
    texto = NAVICAT.read_text(encoding="utf-8")
    bloco = re.search(
        r"INSERT INTO Alternativa \(AlternativaKey, QuestaoEixoKey, Letra, Texto, Correta\) VALUES\n(.*?);\n",
        texto,
        re.DOTALL,
    )
    if not bloco:
        raise RuntimeError("Não achei INSERT de Alternativa em navicat-enade.sql")
    linhas = []
    padrao = re.compile(
        r"\((\d+),\s*(\d+),\s*'([A-E])',\s*'((?:[^'\\]|\\.|'')*)',\s*(\d+)\)"
    )
    for match in padrao.finditer(bloco.group(1)):
        alt_key, qkey, letra, txt, correta = match.groups()
        txt = txt.replace("''", "'")
        linhas.append(
            {
                "AlternativaKey": int(alt_key),
                "QuestaoEixoKey": int(qkey),
                "Letra": letra,
                "Texto": txt,
                "Correta": int(correta),
            }
        )
    return linhas


def montar_questoes() -> tuple[list[dict], dict[int, str]]:
    dim_questao_eixo = []
    gabarito: dict[int, str] = {}
    niveis_ciclo = ("Fácil", "Médio", "Difícil")
    questao_key = 1
    for i, eixo in enumerate(EIXOS):
        for deslocamento in (0, 1):
            nivel = niveis_ciclo[(i + deslocamento) % 3]
            dim_questao_eixo.append(
                {
                    "QuestaoEixoKey": questao_key,
                    "CodigoQuestao": f"Q{questao_key:02d}",
                    "EixoTematico": eixo,
                    "Enunciado": ENUNCIADOS.get(questao_key),
                    "DificuldadeKey": DIFICULDADE_KEY[nivel],
                }
            )
            gabarito[questao_key] = ALTERNATIVAS[(questao_key - 1) % 5]
            questao_key += 1
    return dim_questao_eixo, gabarito


def gerar_fato(
    dim_tempo: list[dict],
    dim_aluno: list[dict],
    dim_questao_eixo: list[dict],
    gabarito: dict[int, str],
    turma_ajuste: dict[int, float],
    evolucao_por_numero: dict[int, float],
) -> list[dict]:
    fato = []
    resposta_key = 1
    aluno_turma = {a["AlunoKey"]: a["TurmaKey"] for a in dim_aluno}
    aluno_habilidade = {a["AlunoKey"]: random.gauss(0, 0.06) for a in dim_aluno}
    questao_dificuldade = {q["QuestaoEixoKey"]: q["DificuldadeKey"] for q in dim_questao_eixo}
    questao_eixo_nivel = {
        q["QuestaoEixoKey"]: next(
            n for n, k in DIFICULDADE_KEY.items() if k == q["DificuldadeKey"]
        )
        for q in dim_questao_eixo
    }
    questao_por_eixo = {q["QuestaoEixoKey"]: q["EixoTematico"] for q in dim_questao_eixo}

    for tempo in dim_tempo:
        tempo_key = tempo["TempoKey"]
        numero_sim = tempo["NumeroSimulado"]
        evol = evolucao_por_numero.get(numero_sim, 0.0)
        for aluno in dim_aluno:
            aluno_key = aluno["AlunoKey"]
            turma_key = aluno_turma[aluno_key]
            for questao in dim_questao_eixo:
                qkey = questao["QuestaoEixoKey"]
                eixo = questao_por_eixo[qkey]
                nivel = questao_eixo_nivel[qkey]
                p = (
                    ACERTO_EIXO[eixo]
                    + AJUSTE_DIFICULDADE[nivel]
                    + evol
                    + turma_ajuste.get(turma_key, 0.0)
                    + aluno_habilidade[aluno_key]
                )
                p = min(0.96, max(0.06, p))
                acertou = 1 if random.random() < p else 0
                correta = gabarito[qkey]
                resposta = correta if acertou else random.choice(
                    [a for a in ALTERNATIVAS if a != correta]
                )
                base_tempo = 25 if nivel == "Fácil" else 55 if nivel == "Médio" else 90
                segundos = max(5, int(round(random.gauss(base_tempo, 12))))
                fato.append(
                    {
                        "RespostaKey": resposta_key,
                        "TempoKey": tempo_key,
                        "QuestaoEixoKey": qkey,
                        "DificuldadeKey": questao_dificuldade[qkey],
                        "TurmaKey": turma_key,
                        "AlunoKey": aluno_key,
                        "RespostaDada": resposta,
                        "Acertou": acertou,
                        "TempoRespostaSegundos": segundos,
                    }
                )
                resposta_key += 1
    return fato


def perfil_demo() -> tuple[list, list, list, list, dict, dict]:
    dim_dificuldade = [
        {"DificuldadeKey": 1, "Nivel": "Fácil"},
        {"DificuldadeKey": 2, "Nivel": "Médio"},
        {"DificuldadeKey": 3, "Nivel": "Difícil"},
    ]
    dim_turma = [{"TurmaKey": k, "TurmaGrupo": nome} for k, nome, _ in TURMAS_DEMO]
    turma_ajuste = {k: adj for k, _, adj in TURMAS_DEMO}
    dim_tempo = [
        {
            "TempoKey": t[0],
            "Data": t[1],
            "NumeroSimulado": t[2],
            "CodigoSimulado": t[3],
            "DescricaoSimulado": t[4],
            "Ano": 2026,
            "Mes": t[5],
            "NomeMes": t[6],
            "SemanaSemestre": t[7],
        }
        for t in SIMULADOS_DEMO
    ]
    evolucao = {t[2]: t[8] for t in SIMULADOS_DEMO}
    dim_aluno = []
    aluno_key = 1
    for turma_key, _, _ in TURMAS_DEMO:
        for _ in range(ALUNOS_POR_TURMA_DEMO):
            dim_aluno.append(
                {
                    "AlunoKey": aluno_key,
                    "CodigoAlunoAnonimo": f"Aluno_{aluno_key:03d}",
                    "TurmaKey": turma_key,
                }
            )
            aluno_key += 1
    return dim_dificuldade, dim_turma, dim_tempo, dim_aluno, turma_ajuste, evolucao


def perfil_basico() -> tuple[list, list, list, list, dict, dict]:
    dim_dificuldade = [
        {"DificuldadeKey": 1, "Nivel": "Fácil"},
        {"DificuldadeKey": 2, "Nivel": "Médio"},
        {"DificuldadeKey": 3, "Nivel": "Difícil"},
    ]
    dim_turma = [
        {"TurmaKey": 1, "TurmaGrupo": "TGI Noturno A"},
        {"TurmaKey": 2, "TurmaGrupo": "TGI Noturno B"},
    ]
    dim_tempo = [
        {
            "TempoKey": 1,
            "Data": "2026-09-10",
            "NumeroSimulado": 1,
            "CodigoSimulado": "SIM-PILOTO-01",
            "DescricaoSimulado": "Simulado-piloto ENADE Analytics",
            "Ano": 2026,
            "Mes": 9,
            "NomeMes": "Setembro",
            "SemanaSemestre": 8,
        },
        {
            "TempoKey": 2,
            "Data": "2026-10-22",
            "NumeroSimulado": 2,
            "CodigoSimulado": "SIM-02",
            "DescricaoSimulado": "Segundo simulado - evolucao no semestre",
            "Ano": 2026,
            "Mes": 10,
            "NomeMes": "Outubro",
            "SemanaSemestre": 14,
        },
    ]
    dim_aluno = [
        {
            "AlunoKey": i,
            "CodigoAlunoAnonimo": f"Aluno_{i:03d}",
            "TurmaKey": 1 if i <= 6 else 2,
        }
        for i in range(1, 13)
    ]
    return dim_dificuldade, dim_turma, dim_tempo, dim_aluno, {1: 0.0, 2: 0.0}, {1: 0.0, 2: 0.10}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--demo",
        action="store_true",
        help="6 turmas, 36 alunos, 4 simulados, alternativas e vínculos para a app",
    )
    args = parser.parse_args()

    OUT.mkdir(exist_ok=True)

    if args.demo:
        dim_dificuldade, dim_turma, dim_tempo, dim_aluno, turma_ajuste, evolucao = perfil_demo()
    else:
        dim_dificuldade, dim_turma, dim_tempo, dim_aluno, turma_ajuste, evolucao = perfil_basico()

    dim_questao_eixo, gabarito = montar_questoes()
    fato = gerar_fato(
        dim_tempo, dim_aluno, dim_questao_eixo, gabarito, turma_ajuste, evolucao
    )

    simulado_questao = [
        {"TempoKey": t["TempoKey"], "QuestaoEixoKey": q["QuestaoEixoKey"]}
        for t in dim_tempo
        for q in dim_questao_eixo
    ]

    alternativas: list[dict] = []
    if args.demo and NAVICAT.exists():
        alternativas = parse_alternativas_navicat()

    escrever_csv("Dim_Dificuldade.csv", list(dim_dificuldade[0].keys()), dim_dificuldade)
    escrever_csv("Dim_Turma.csv", list(dim_turma[0].keys()), dim_turma)
    escrever_csv("Dim_Tempo.csv", list(dim_tempo[0].keys()), dim_tempo)
    escrever_csv("Dim_Questao_Eixo.csv", list(dim_questao_eixo[0].keys()), dim_questao_eixo)
    escrever_csv("Dim_Aluno_Anonimo.csv", list(dim_aluno[0].keys()), dim_aluno)
    escrever_csv("Fato_Respostas.csv", list(fato[0].keys()), fato)

    for legado in ("Dim_Questao.csv", "Dim_Simulado.csv"):
        p = OUT / legado
        if p.exists():
            p.unlink()

    base = Path(__file__).parent
    carga = base / "carga.sql"
    with carga.open("w", encoding="utf-8", newline="\n") as fh:
        fh.write("-- Carga gerada por gerar_seed.py\n")
        fh.write("SET NAMES utf8mb4;\n")
        fh.write("SET FOREIGN_KEY_CHECKS = 0;\n\n")
        fh.write(
            "DELETE FROM Simulado_Questao;\n"
            "DELETE FROM Alternativa;\n"
            "DELETE FROM Fato_Respostas;\n"
            "DELETE FROM Dim_Aluno_Anonimo;\n"
            "DELETE FROM Dim_Questao_Eixo;\n"
            "DELETE FROM Dim_Tempo;\n"
            "DELETE FROM Dim_Turma;\n"
            "DELETE FROM Dim_Dificuldade;\n\n"
        )
        escrever_insert(fh, "Dim_Dificuldade", dim_dificuldade)
        escrever_insert(fh, "Dim_Turma", dim_turma)
        escrever_insert(fh, "Dim_Tempo", dim_tempo)
        escrever_insert(fh, "Dim_Questao_Eixo", dim_questao_eixo)
        escrever_insert(fh, "Dim_Aluno_Anonimo", dim_aluno)
        escrever_insert(fh, "Fato_Respostas", fato)
        if alternativas:
            escrever_insert(fh, "Alternativa", alternativas)
        if args.demo:
            escrever_insert(fh, "Simulado_Questao", simulado_questao)
        fh.write("SET FOREIGN_KEY_CHECKS = 1;\n")

    total_acertos = sum(r["Acertou"] for r in fato)
    print(f"Modo: {'DEMO' if args.demo else 'basico'}")
    print(f"Turmas: {len(dim_turma)} | Alunos: {len(dim_aluno)} | Simulados: {len(dim_tempo)}")
    print(f"Fato_Respostas: {len(fato)} linhas | Taxa geral: {total_acertos / len(fato):.1%}")
    print(f"CSVs: {OUT}")
    print(f"SQL: {carga}")


if __name__ == "__main__":
    main()
