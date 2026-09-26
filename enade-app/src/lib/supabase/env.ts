const PROVEDORES = {
  google: "Google",
  github: "GitHub",
  discord: "Discord",
  gitlab: "GitLab",
  azure: "Microsoft",
} as const;

export type ProvedorAuth = keyof typeof PROVEDORES;

export function urlSupabase(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return url ? url : undefined;
}

export function chaveSupabase(): string | undefined {
  const chave =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  return chave ? chave : undefined;
}

export function supabaseConfigurado(): boolean {
  return Boolean(urlSupabase() && chaveSupabase());
}

export function provedoresConfigurados(): { id: ProvedorAuth; rotulo: string }[] {
  const bruto = process.env.NEXT_PUBLIC_AUTH_PROVIDERS?.trim() || "google,github";
  const vistos = new Set<ProvedorAuth>();
  const lista: { id: ProvedorAuth; rotulo: string }[] = [];

  for (const item of bruto.split(",")) {
    const id = item.trim().toLowerCase();
    if (!(id in PROVEDORES) || vistos.has(id as ProvedorAuth)) continue;
    const provedor = id as ProvedorAuth;
    vistos.add(provedor);
    lista.push({ id: provedor, rotulo: PROVEDORES[provedor] });
  }

  return lista;
}

export function emailsAdmin(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
