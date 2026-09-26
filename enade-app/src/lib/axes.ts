export const AXES = [
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

export type Axis = (typeof AXES)[number];

export const LEVELS = ["Fácil", "Médio", "Difícil"] as const;

export type Level = (typeof LEVELS)[number];

export function isValidLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}

export function isValidAxis(value: string): value is Axis {
  return (AXES as readonly string[]).includes(value);
}
