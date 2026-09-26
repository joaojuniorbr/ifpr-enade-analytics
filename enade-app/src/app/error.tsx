"use client";

import { primaryButton } from "@/lib/styles";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Não foi possível abrir esta tela</h1>
      <p className="mt-2 text-sm text-slate-600">
        Tente de novo. Se o problema continuar, confira a conexão com o banco e a configuração do Auth0.
      </p>
      <button type="button" className={`${primaryButton} mt-4`} onClick={reset}>
        Tentar de novo
      </button>
    </section>
  );
}
