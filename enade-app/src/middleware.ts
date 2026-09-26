import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfigurado } from "@/lib/supabase/env";
import { atualizarSessao, copiarCookies } from "@/lib/supabase/middleware";

function protegido(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/prova" ||
    pathname.startsWith("/prova/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!supabaseConfigurado()) {
    if (protegido(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("motivo", "config");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const { resposta, autenticado } = await atualizarSessao(request);

  if (protegido(pathname) && !autenticado) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    const redirecionamento = NextResponse.redirect(url);
    copiarCookies(resposta, redirecionamento);
    return redirecionamento;
  }

  return resposta;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
