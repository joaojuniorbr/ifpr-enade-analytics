import { redirect } from "next/navigation";
import { Aviso } from "@/components/aviso";
import { BotoesLogin } from "@/components/botoes-login";
import { obterUsuarioOpcional } from "@/lib/auth";
import { cartao } from "@/lib/estilos";
import { provedoresConfigurados, supabaseConfigurado } from "@/lib/supabase/env";

const erros: Record<string, string> = {
  callback: "O login não foi concluído. Tente de novo.",
  email: "A conta do provedor não devolveu um e-mail. Autorize o acesso ao e-mail e entre outra vez.",
  "email-em-uso": "Este e-mail já está ligado a outra conta. Entre com o mesmo provedor da primeira vez.",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; motivo?: string }>;
}) {
  const usuario = await obterUsuarioOpcional();
  if (usuario) redirect(usuario.role === "ADMIN" ? "/admin" : "/prova");

  const params = await searchParams;
  const configurado = supabaseConfigurado();
  const mensagem = params.erro ? erros[params.erro] : null;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <section className={cartao}>
        <h1 className="text-2xl font-semibold text-slate-900">Entrar</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          O acesso é só por login social, para identificar quem faz a prova. Não há cadastro com senha.
        </p>
        <div className="mt-4 space-y-3">
          {params.motivo === "config" ? (
            <Aviso
              tom="ambar"
              texto="As rotas da prova e do admin ficam fechadas até o Supabase Auth estar configurado."
            />
          ) : null}
          {mensagem ? <Aviso tom="vermelho" texto={mensagem} /> : null}
          {configurado ? (
            <BotoesLogin provedores={provedoresConfigurados()} />
          ) : (
            <Instrucoes />
          )}
        </div>
      </section>
    </div>
  );
}

function Instrucoes() {
  return (
    <div className="space-y-3 text-sm leading-6 text-slate-700">
      <Aviso
        tom="ambar"
        texto="Faltam as chaves do Supabase neste ambiente. Preencha o arquivo .env.local e reinicie o servidor."
      />
      <p>Variáveis:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <code>NEXT_PUBLIC_SUPABASE_URL</code>
        </li>
        <li>
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
        </li>
        <li>
          <code>ADMIN_EMAILS</code> — e-mails separados por vírgula que viram administrador no login
        </li>
        <li>
          <code>NEXT_PUBLIC_AUTH_PROVIDERS</code> — opcional, padrão google,github
        </li>
      </ul>
      <p>
        No painel do Supabase, habilite Google e GitHub e inclua{" "}
        <code>http://localhost:3000/auth/callback</code> nas URLs de redirecionamento. O passo a passo
        está no README desta pasta.
      </p>
    </div>
  );
}
