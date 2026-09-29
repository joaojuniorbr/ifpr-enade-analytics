import Image from "next/image";
import { redirect } from "next/navigation";
import { Notice } from "@/components/notice";
import { isAuth0Configured, logoutUrl } from "@/lib/auth0";
import { getAuthSession, getOptionalUser } from "@/lib/auth";
import { primaryButton, wordmarkClass } from "@/lib/styles";

const errorMessages: Record<string, string> = {
  callback: "O login não foi concluído. Tente de novo.",
  email: "Seu e-mail ainda não foi verificado. Confirme no Auth0 para continuar.",
  "email-em-uso": "Este e-mail já está ligado a outra conta e o acesso não foi unido.",
};

const features = [
  ["/undraw-books.svg", "Leituras"],
  ["/undraw-teaching.svg", "Aula"],
  ["/undraw-quiz.svg", "Questões"],
  ["/undraw-dados.svg", "Acompanhamento"],
] as const;

function safeReturnPath(value: string | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  if (
    value === "/" ||
    value.startsWith("/admin") ||
    value.startsWith("/simulados") ||
    value.startsWith("/evolucao") ||
    value.startsWith("/primeiro-acesso")
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
    <main className="grid min-h-dvh bg-[#eef1ea] lg:grid-cols-[minmax(20rem,32rem)_1fr]">
      <section className="flex min-h-dvh flex-col bg-white px-8 py-10 sm:px-12">
        <p className={wordmarkClass}>ENADE</p>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Bem-vindo</h1>
          <p className="mt-3 text-sm text-slate-500">Entre para acompanhar o simulado do ENADE.</p>
          <div className="mt-8">
            {isConfigured ? (
              <a href={loginHref} className={`${primaryButton} h-12 w-full`}>
                Entrar
              </a>
            ) : (
              <span className={`${primaryButton} h-12 w-full`}>Entrar</span>
            )}
          </div>
          <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            Acesso pelo Auth0
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="mt-6 space-y-3">
            {params.reason === "config" ? (
              <Notice tone="amber" text="O painel administrativo fica fechado até o Auth0 estar configurado." />
            ) : null}
            {!isConfigured ? (
              <Notice tone="amber" text="Auth0 ainda não está configurado neste ambiente." />
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
                <a href={logoutUrl()} className={`${primaryButton} h-12 w-full`}>
                  Sair e tentar de novo
                </a>
              </div>
            ) : null}
          </div>
        </div>
        <p className="mx-auto max-w-sm text-center text-xs leading-5 text-slate-400">
          Este simulado não vale nota e não substitui o ENADE oficial.
        </p>
      </section>

      <section className="flex flex-col items-center justify-center gap-8 px-6 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white px-8 py-10 text-center shadow-[0_8px_28px_rgba(30,40,20,0.05)]">
          <Image
            src="/undraw-welcome.svg"
            alt=""
            width={420}
            height={320}
            unoptimized
            className="mx-auto h-auto max-h-64 w-full object-contain"
          />
          <p className="mt-6 text-xl font-semibold text-slate-950">Entre do seu jeito</p>
        </div>
        <ul className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {features.map(([src, label]) => (
            <li
              key={label}
              className="rounded-2xl bg-white px-3 py-4 text-center shadow-[0_8px_28px_rgba(30,40,20,0.04)]"
            >
              <Image src={src} alt="" width={160} height={110} unoptimized className="mx-auto h-16 w-auto" />
              <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
