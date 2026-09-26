import { createBrowserClient } from "@supabase/ssr";
import { chaveSupabase, urlSupabase } from "@/lib/supabase/env";

export function criarClienteNavegador() {
  const url = urlSupabase();
  const chave = chaveSupabase();
  if (!url || !chave) {
    throw new Error("Supabase não configurado.");
  }
  return createBrowserClient(url, chave);
}
