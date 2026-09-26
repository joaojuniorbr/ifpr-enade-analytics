import { NextResponse } from "next/server";
import { sincronizarUsuario } from "@/lib/auth";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { criarClienteServidor } from "@/lib/supabase/server";

function destinoSeguro(valor: string | null): string | null {
  if (!valor) return null;
  if (!valor.startsWith("/") || valor.startsWith("//") || valor.includes("\\")) return null;
  if (valor.startsWith("/admin") || valor.startsWith("/prova") || valor === "/") return valor;
  return null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!supabaseConfigurado()) {
    return NextResponse.redirect(new URL("/login?motivo=config", url.origin));
  }

  const code = url.searchParams.get("code");
  if (url.searchParams.get("error") || !code) {
    return NextResponse.redirect(new URL("/login?erro=callback", url.origin));
  }

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?erro=callback", url.origin));
  }
  const user = data.user;

  try {
    const usuario = await sincronizarUsuario(user);
    if (!usuario) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?erro=email", url.origin));
    }
    const destino =
      destinoSeguro(url.searchParams.get("next")) ??
      (usuario.role === "ADMIN" ? "/admin" : "/prova");
    return NextResponse.redirect(new URL(destino, url.origin));
  } catch (falha) {
    if (falha instanceof Error && falha.message === "EMAIL_EM_USO") {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?erro=email-em-uso", url.origin));
    }
    throw falha;
  }
}
