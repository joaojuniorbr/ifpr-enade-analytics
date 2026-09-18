#!/usr/bin/env python3
"""Gera CSVs do esquema estrela para carga no Power BI."""

from __future__ import annotations

import csv
import random
from pathlib import Path

random.seed(42)

OUT = Path(__file__).parent / "powerbi"
OUT.mkdir(exist_ok=True)

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

# Probabilidade-base de acerto por eixo (piloto sintético, para mineração no Marco 3)
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

AJUSTE_DIFICULDADE = {"Fácil": 0.12, "Médio": 0.00, "Difícil": -0.12}
EVOLUCAO_SIMULADO = {1: 0.00, 2: 0.10}

ALTERNATIVAS = ["A", "B", "C", "D", "E"]
NOMES_MES = {
    9: "Setembro",
    10: "Outubro",
}


def escrever(nome: str, campos: list[str], linhas: list[dict]) -> None:
    caminho = OUT / nome
    with caminho.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=campos)
        writer.writeheader()
        writer.writerows(linhas)


def main() -> None:
    dim_tempo = [
        {
            "TempoKey": 20260910,
            "Data": "2026-09-10",
            "Ano": 2026,
            "Mes": 9,
            "NomeMes": "Setembro",
            "SemanaSemestre": 8,
        },
        {
            "TempoKey": 20261022,
            "Data": "2026-10-22",
            "Ano": 2026,
            "Mes": 10,
            "NomeMes": "Outubro",
            "SemanaSemestre": 14,
        },
    ]

    dim_aluno = []
    for i in range(1, 13):
        dim_aluno.append(
            {
                "AlunoKey": i,
                "CodigoAlunoAnonimo": f"Aluno_{i:03d}",
                "TurmaGrupo": "TGI Noturno A" if i <= 6 else "TGI Noturno B",
            }
        )

    dim_questao = []
    gabarito: dict[int, str] = {}
    niveis_ciclo = ("Fácil", "Médio", "Difícil")
    questao_key = 1
    for i, eixo in enumerate(EIXOS):
        for deslocamento in (0, 1):
            nivel = niveis_ciclo[(i + deslocamento) % 3]
            dim_questao.append(
                {
                    "QuestaoKey": questao_key,
                    "CodigoQuestao": f"Q{questao_key:02d}",
                    "EixoTematico": eixo,
                    "NivelDificuldade": nivel,
                }
            )
            gabarito[questao_key] = ALTERNATIVAS[(questao_key - 1) % 5]
            questao_key += 1

    dim_simulado = [
        {
            "SimuladoKey": 1,
            "CodigoSimulado": "SIM-PILOTO-01",
            "NumeroAplicacao": 1,
            "DescricaoSimulado": "Simulado-piloto ENADE Analytics",
        },
        {
            "SimuladoKey": 2,
            "CodigoSimulado": "SIM-02",
            "NumeroAplicacao": 2,
            "DescricaoSimulado": "Segundo simulado — evolução no semestre",
        },
    ]

    fato = []
    resposta_key = 1
    tempo_por_simulado = {1: 20260910, 2: 20261022}

    for simulado in dim_simulado:
        simulado_key = simulado["SimuladoKey"]
        for aluno in dim_aluno:
            for questao in dim_questao:
                eixo = questao["EixoTematico"]
                nivel = questao["NivelDificuldade"]
                p = (
                    ACERTO_EIXO[eixo]
                    + AJUSTE_DIFICULDADE[nivel]
                    + EVOLUCAO_SIMULADO[simulado_key]
                )
                p = min(0.95, max(0.08, p))
                acertou = 1 if random.random() < p else 0
                correta = gabarito[questao["QuestaoKey"]]
                if acertou:
                    resposta = correta
                else:
                    resposta = random.choice([a for a in ALTERNATIVAS if a != correta])
                base_tempo = 25 if nivel == "Fácil" else 55 if nivel == "Médio" else 90
                fato.append(
                    {
                        "RespostaKey": resposta_key,
                        "TempoKey": tempo_por_simulado[simulado_key],
                        "AlunoKey": aluno["AlunoKey"],
                        "QuestaoKey": questao["QuestaoKey"],
                        "SimuladoKey": simulado_key,
                        "RespostaDada": resposta,
                        "Acertou": acertou,
                        "TempoRespostaSegundos": round(random.gauss(base_tempo, 12), 1),
                    }
                )
                resposta_key += 1

    escrever("Dim_Tempo.csv", list(dim_tempo[0].keys()), dim_tempo)
    escrever("Dim_Aluno_Anonimo.csv", list(dim_aluno[0].keys()), dim_aluno)
    escrever("Dim_Questao.csv", list(dim_questao[0].keys()), dim_questao)
    escrever("Dim_Simulado.csv", list(dim_simulado[0].keys()), dim_simulado)
    escrever("Fato_Respostas.csv", list(fato[0].keys()), fato)

    total_acertos = sum(r["Acertou"] for r in fato)
    print(f"Gerados {len(fato)} fatos em {OUT}")
    print(f"Taxa de acerto geral: {total_acertos / len(fato):.1%}")


if __name__ == "__main__":
    main()
