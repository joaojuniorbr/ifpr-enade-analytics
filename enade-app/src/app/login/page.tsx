import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginShowcase } from "@/components/login-showcase";
import { Notice } from "@/components/notice";
import { isAuth0Configured, logoutUrl } from "@/lib/auth0";
import { getAuthSession, getOptionalUser } from "@/lib/auth";

const errorMessages: Record<string, string> = {
  callback: "O login não foi concluído. Tente de novo.",
  email: "A conta não devolveu um e-mail verificado. Confirme o e-mail no Auth0 e entre outra vez.",
  "email-em-uso": "Este e-mail já está ligado a outra conta e o acesso não foi unido.",
};

function safeReturnPath(value: string | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  if (
    value === "/" ||
    value.startsWith("/admin") ||
    value.startsWith("/simulados") ||
    value.startsWith("/evolucao")
  ) {
    return value;
  }
  return null;
}

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string; next?: string }>;
}) {
  const params = await searchParams;
  const isConfigured = isAuth0Configured();
  const user = await getOptionalUser();
  if (user) {
    redirect(safeReturnPath(params.next) ?? (user.role === "ADMIN" ? "/admin" : "/"));
  }

  const session = isConfigured ? await getAuthSession() : null;
  const message = params.error ? errorMessages[params.error] : null;
  const returnTo = safeReturnPath(params.next) ?? "/login";
  const loginHref = `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-md bg-white shadow-[0_30px_80px_rgba(90,70,180,0.12)] lg:min-h-[720px] lg:grid-cols-2">
        <section className="flex flex-col px-8 py-10 sm:px-14 sm:py-12">
          <Logo />
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
            <h1 className="text-center text-[2rem] font-semibold tracking-tight text-slate-950">Bem-vindo</h1>
            <p className="mt-2 text-center text-sm text-slate-500">
              Entre para acompanhar o simulado do ENADE.
            </p>
            <div className="mt-8 space-y-3">
              {params.reason === "config" ? (
                <Notice
                  tone="amber"
                  text="O painel administrativo fica fechado até o Auth0 estar configurado."
                />
              ) : null}
              {message ? <Notice tone="red" text={message} /> : null}
              {session?.user && !user ? (
                <div className="space-y-3">
                  <Notice
                    tone="red"
                    text={
                      session.user.email_verified === false || !session.user.email
                        ? errorMessages.email
                        : errorMessages["email-em-uso"]
                    }
                  />
                  <a href={logoutUrl()} className={loginButton}>
                    Sair e tentar de novo
                  </a>
                </div>
              ) : isConfigured ? (
                <a href={loginHref} className={loginButton}>
                  Entrar
                </a>
              ) : (
                <Instructions />
              )}
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              Acesso pelo Auth0
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          </div>
          <p className="mx-auto max-w-sm text-center text-xs leading-5 text-slate-400">
            Simulado de preparação. Não vale nota e não substitui o ENADE oficial. O painel da equipe só
            abre para os e-mails autorizados.
          </p>
        </section>
        <aside className="relative flex min-h-[28rem] items-stretch overflow-hidden bg-gradient-to-b from-[#8b74ff] via-[#6d4aff] to-[#5430e0] px-6 py-8 text-white sm:px-10 sm:py-10">
          <LoginShowcase />
        </aside>
      </div>
      <ul className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["/undraw-books.svg", "Leituras"],
          ["/undraw-teaching.svg", "Aula"],
          ["/undraw-quiz.svg", "Questões"],
          ["/undraw-dados.svg", "Acompanhamento"],
        ].map(([src, label]) => (
          <li key={src} className="rounded-md bg-white/80 p-3 text-center">
            <Image src={src} alt="" width={240} height={160} unoptimized className="mx-auto h-24 w-auto" />
            <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

const loginButton =
  "flex h-12 w-full items-center justify-center rounded-md bg-[#6d4aff] text-sm font-medium text-white shadow-sm hover:bg-[#5b3ae0]";

function Logo() {
  return (
    <div className="flex items-center gap-2.5 text-slate-950">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <path
          d="M5 23 13 11l6 7 8-11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 7h8v8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight">ENADE Analytics</span>
    </div>
  );
}

function Instructions() {
  return (
    <div className="space-y-3 text-sm leading-6 text-slate-700">
      <Notice
        tone="amber"
        text="Faltam as variáveis do Auth0 neste ambiente. Preencha o arquivo .env.local e reinicie o servidor."
      />
      <p>Variáveis:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <code>APP_BASE_URL</code>
        </li>
        <li>
          <code>AUTH0_DOMAIN</code>
        </li>
        <li>
          <code>AUTH0_CLIENT_ID</code>
        </li>
        <li>
          <code>AUTH0_CLIENT_SECRET</code>
        </li>
        <li>
          <code>AUTH0_SECRET</code>
        </li>
        <li>
          <code>ADMIN_EMAILS</code> — e-mails separados por vírgula que viram administrador no login
        </li>
      </ul>
      <p>
        No painel do Auth0, a URL de callback desta aplicação é{" "}
        <code>http://localhost:3000/auth/callback</code> e o logout pode voltar para{" "}
        <code>http://localhost:3000/login</code>. O passo a passo está no README desta pasta.
      </p>
    </div>
  );
}
