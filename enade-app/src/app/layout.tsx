import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cabecalho } from "@/components/cabecalho";
import { obterUsuarioOpcional } from "@/lib/auth";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "ENADE Analytics",
    template: "%s · ENADE Analytics",
  },
  description: "Aplicação de simulados para preparação ao ENADE.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const usuario = await obterUsuarioOpcional();

  return (
    <html lang="pt-BR">
      <body className={`${geist.className} bg-slate-50 text-slate-900 antialiased`}>
        <Cabecalho usuario={usuario ? { nome: usuario.nome, role: usuario.role } : null} />
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          Simulado de preparação. Não vale nota e não substitui o ENADE oficial.
        </footer>
      </body>
    </html>
  );
}
