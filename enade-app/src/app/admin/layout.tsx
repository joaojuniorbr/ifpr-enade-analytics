import Link from "next/link";
import { exigirAdmin } from "@/lib/auth";
import { botaoSecundario } from "@/lib/estilos";

const links = [
  { href: "/admin", rotulo: "Acompanhamento" },
  { href: "/admin/perguntas", rotulo: "Perguntas" },
  { href: "/admin/provas", rotulo: "Provas" },
  { href: "/admin/usuarios", rotulo: "Usuários" },
];

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  await exigirAdmin();

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={botaoSecundario}>
            {link.rotulo}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
