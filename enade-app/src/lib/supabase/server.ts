import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { chaveSupabase, urlSupabase } from "@/lib/supabase/env";

export async function criarClienteServidor() {
  const url = urlSupabase();
  const chave = chaveSupabase();
  if (!url || !chave) {
    throw new Error("Supabase não configurado.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, chave, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component não pode gravar cookie. O middleware renova a sessão.
        }
      },
    },
  });
}
