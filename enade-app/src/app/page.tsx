import Link from "next/link";
import { obterUsuarioOpcional } from "@/lib/auth";
import { botaoPrimario, botaoSecundario, cartao } from "@/lib/estilos";

export default async function Home() {
  const usuario = await obterUsuarioOpcional();

  return (
    <div className="space-y-6">
      <section className={cartao}>
        <p className="text-sm font-medium text-blue-700">Preparação ENADE 2026</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Aplicação de simulados</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          A coordenação cadastra as perguntas e a prova de um dia. Nesse dia, cada aluno recebe
          as questões em ordem aleatória. Atualizar a página não muda a ordem. Uma prova concluída
          não pode ser refeita.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {usuario ? (
            <>
              <Link href="/prova" className={botaoPrimario}>
                Ir para as provas
              </Link>
              {usuario.role === "ADMIN" ? (
                <Link href="/admin" className={botaoSecundario}>
                  Painel admin
                </Link>
              ) : null}
            </>
          ) : (
            <Link href="/login" className={botaoPrimario}>
              Entrar
            </Link>
          )}
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <article className={cartao}>
          <h2 className="text-sm font-semibold text-slate-900">Prova do dia</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Fora da data, a prova aparece como ainda não liberada ou encerrada.
          </p>
        </article>
        <article className={cartao}>
          <h2 className="text-sm font-semibold text-slate-900">Uma tentativa</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Dá para sair e voltar no mesmo dia. A tentativa concluída fica no histórico.
          </p>
        </article>
        <article className={cartao}>
          <h2 className="text-sm font-semibold text-slate-900">Acompanhamento</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            O admin vê tentativas, média e conclusão a partir dos dados gravados no MySQL.
          </p>
        </article>
      </div>
    </div>
  );
}
