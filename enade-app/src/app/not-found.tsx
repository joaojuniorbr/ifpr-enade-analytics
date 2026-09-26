import Link from "next/link";
import { primaryButton, cardClass } from "@/lib/styles";

export default function NotFoundPage() {
  return (
    <section className={cardClass}>
      <h1 className="text-2xl font-semibold text-slate-900">Página não encontrada</h1>
      <p className="mt-2 text-sm text-slate-600">O endereço não corresponde a uma prova ou tela deste aplicativo.</p>
      <Link href="/" className={`${primaryButton} mt-4`}>
        Voltar ao início
      </Link>
    </section>
  );
}
