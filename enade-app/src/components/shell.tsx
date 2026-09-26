import Link from "next/link";
import { logoutUrl } from "@/lib/auth0";

type ShellUser = { name: string; role: "ADMIN" | "ALUNO" } | null;

const adminLinks = [
  { href: "/admin", label: "Acompanhamento" },
  { href: "/admin/questoes", label: "Questões" },
  { href: "/admin/simulados", label: "Simulados" },
  { href: "/admin/alunos", label: "Alunos" },
  { href: "/admin/tempo", label: "Tempo" },
  { href: "/admin/respostas", label: "Respostas" },
];

export function Shell({
  user,
  pathname,
  children,
}: {
  user: ShellUser;
  pathname: string;
  children: React.ReactNode;
}) {
  const links = [{ href: "/", label: "Início" }, ...(user?.role === "ADMIN" ? adminLinks : [])];

  return (
    <div className="min-h-dvh bg-[#ece8fb] p-3 text-slate-900 md:p-5">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] max-w-[1400px] gap-4 md:min-h-[calc(100dvh-2.5rem)]">
        <aside className="sticky top-5 hidden h-[calc(100dvh-2.5rem)] w-64 shrink-0 flex-col rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(90,70,180,0.06)] md:flex">
          <Link href="/" className="flex items-center gap-2 px-2 py-2">
            <Mark />
            <span className="text-lg font-semibold tracking-tight">
              ENADE<span className="text-[#6d4aff]">.</span>
            </span>
          </Link>
          <nav className="mt-6 flex flex-1 flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={navClass(pathname, link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="rounded-2xl bg-[#6d4aff] p-4 text-white">
            <p className="text-sm font-medium">Preparação ENADE 2026</p>
            <p className="mt-1 text-xs leading-5 text-white/80">
              Simulado de treino. Não vale nota e não substitui a prova oficial.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 px-1">
            {user ? (
              <>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.role === "ADMIN" ? "Administrador" : "Conta"}</p>
                </div>
                <a href={logoutUrl()} className="text-sm font-medium text-[#6d4aff]">
                  Sair
                </a>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium text-[#6d4aff]">
                Entrar
              </Link>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 rounded-[24px] bg-white p-3 shadow-[0_10px_30px_rgba(90,70,180,0.06)] md:hidden">
            <div className="flex items-center justify-between px-1">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Mark />
                ENADE<span className="text-[#6d4aff]">.</span>
              </Link>
              {user ? (
                <a href={logoutUrl()} className="text-sm font-medium text-[#6d4aff]">
                  Sair
                </a>
              ) : (
                <Link href="/login" className="text-sm font-medium text-[#6d4aff]">
                  Entrar
                </Link>
              )}
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={`${navClass(pathname, link.href)} shrink-0`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function navClass(pathname: string, href: string) {
  const active = href === "/" || href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return active
    ? "rounded-xl bg-[#f3efff] px-3 py-2.5 text-sm font-medium text-[#6d4aff]"
    : "rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[#f7f5ff]";
}

function Mark() {
  return (
    <span className="grid size-8 place-items-center rounded-xl bg-[#6d4aff] text-white" aria-hidden="true">
      <svg viewBox="0 0 32 32" className="size-4">
        <path
          d="M5 23 13 11l6 7 8-11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
