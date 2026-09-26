import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { chaveSupabase, supabaseConfigurado, urlSupabase } from "@/lib/supabase/env";

export async function atualizarSessao(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  if (!supabaseConfigurado()) {
    return { resposta, autenticado: false };
  }

  const url = urlSupabase();
  const chave = chaveSupabase();
  if (!url || !chave) {
    return { resposta, autenticado: false };
  }

  const supabase = createServerClient(url, chave, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        resposta = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          resposta.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          resposta.headers.set(key, value);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const autenticado = Boolean(data?.claims?.sub);

  return { resposta, autenticado };
}

export function copiarCookies(origem: NextResponse, destino: NextResponse) {
  origem.cookies.getAll().forEach((cookie) => {
    destino.cookies.set(cookie);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const valor = origem.headers.get(header);
    if (valor) destino.headers.set(header, valor);
  }
}
