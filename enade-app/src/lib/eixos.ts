export const EIXOS = [
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
] as const;

export type Eixo = (typeof EIXOS)[number];

export const NIVEIS = [
  { valor: "FACIL", rotulo: "Fácil" },
  { valor: "MEDIO", rotulo: "Médio" },
  { valor: "DIFICIL", rotulo: "Difícil" },
] as const;

export type Nivel = (typeof NIVEIS)[number]["valor"];

export function rotuloNivel(nivel: string | null | undefined): string | null {
  return NIVEIS.find((item) => item.valor === nivel)?.rotulo ?? null;
}

export function eixoValido(valor: string): valor is Eixo {
  return (EIXOS as readonly string[]).includes(valor);
}
