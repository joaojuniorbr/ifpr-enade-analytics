import Link from "next/link";
import { sair } from "@/app/auth/actions";
import { botaoSecundario } from "@/lib/estilos";

export function Cabecalho({
  usuario,
}: {
  usuario: { nome: string; role: "ADMIN" | "ALUNO" } | null;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold text-slate-900">
            ENADE Analytics
          </Link>
          <p className="text-xs text-slate-500">Aplicação de simulados</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {usuario ? (
            <>
              <Link href="/prova" className={botaoSecundario}>
                Provas
              </Link>
              <Link href="/prova/desempenho" className={botaoSecundario}>
                Desempenho
              </Link>
              {usuario.role === "ADMIN" ? (
                <Link href="/admin" className={botaoSecundario}>
                  Admin
                </Link>
              ) : null}
              <span className="px-2 text-sm text-slate-600">{usuario.nome}</span>
              <form action={sair}>
                <button type="submit" className={botaoSecundario}>
                  Sair
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className={botaoSecundario}>
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
