"use client";

import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import { Aviso } from "@/components/aviso";
import { botaoPrimario } from "@/lib/estilos";
import { criarClienteNavegador } from "@/lib/supabase/client";
import type { ProvedorAuth } from "@/lib/supabase/env";

export function BotoesLogin({
  provedores,
}: {
  provedores: { id: ProvedorAuth; rotulo: string }[];
}) {
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<string | null>(null);

  async function entrar(provedor: ProvedorAuth) {
    setErro(null);
    setCarregando(provedor);
    const supabase = criarClienteNavegador();
    const destino = new URL("/auth/callback", window.location.origin);
    const next = new URLSearchParams(window.location.search).get("next");
    if (next) destino.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provedor as Provider,
      options: { redirectTo: destino.toString() },
    });

    if (error) {
      setCarregando(null);
      setErro(
        "Não foi possível abrir o provedor. Confira a chave do Supabase e se o login social está habilitado no painel.",
      );
    }
  }

  if (provedores.length === 0) {
    return (
      <Aviso
        tom="ambar"
        texto="Nenhum provedor válido em NEXT_PUBLIC_AUTH_PROVIDERS. Use google e github, separados por vírgula."
      />
    );
  }

  return (
    <div className="space-y-3">
      {erro ? <Aviso tom="vermelho" texto={erro} /> : null}
      {provedores.map((provedor) => (
        <button
          key={provedor.id}
          type="button"
          className={`${botaoPrimario} w-full`}
          disabled={carregando !== null}
          onClick={() => entrar(provedor.id)}
        >
          {carregando === provedor.id ? "Redirecionando…" : `Entrar com ${provedor.rotulo}`}
        </button>
      ))}
    </div>
  );
}
