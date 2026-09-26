import Link from "next/link";
import { botaoPrimario, cartao } from "@/lib/estilos";

export default function NaoEncontrada() {
  return (
    <section className={cartao}>
      <h1 className="text-2xl font-semibold text-slate-900">Página não encontrada</h1>
      <p className="mt-2 text-sm text-slate-600">O endereço não corresponde a uma prova ou tela deste aplicativo.</p>
      <Link href="/" className={`${botaoPrimario} mt-4`}>
        Voltar ao início
      </Link>
    </section>
  );
}
