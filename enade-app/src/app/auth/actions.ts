"use server";

import { redirect } from "next/navigation";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { criarClienteServidor } from "@/lib/supabase/server";

export async function sair() {
  if (supabaseConfigurado()) {
    const supabase = await criarClienteServidor();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
