import { Selo } from "@/components/selo";
import { formatarDataHora } from "@/lib/datas";
import { formatarNota, notaNumero } from "@/lib/formatar";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Usuários" };

export default async function PaginaUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tentativas: { select: { concluidaEm: true, nota: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Usuários</h1>
        <p className="mt-1 text-sm text-slate-600">
          Quem entrou com o login social. O papel fica no MySQL, não no provedor.
        </p>
      </div>
      {usuarios.length === 0 ? (
        <p className="text-sm text-slate-600">Ninguém entrou ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Papel</th>
                <th className="px-4 py-3 font-medium">Entrada</th>
                <th className="px-4 py-3 font-medium">Tentativas</th>
                <th className="px-4 py-3 font-medium">Média</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                const concluidas = usuario.tentativas.filter((tentativa) => tentativa.concluidaEm);
                const notas = concluidas
                  .map((tentativa) => notaNumero(tentativa.nota))
                  .filter((nota): nota is number => nota != null);
                const media =
                  notas.length === 0 ? null : notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
                return (
                  <tr key={usuario.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium">{usuario.nome}</td>
                    <td className="px-4 py-3">{usuario.email}</td>
                    <td className="px-4 py-3">
                      <Selo tom={usuario.role === "ADMIN" ? "azul" : "cinza"}>
                        {usuario.role === "ADMIN" ? "Administrador" : "Aluno"}
                      </Selo>
                    </td>
                    <td className="px-4 py-3">{formatarDataHora(usuario.createdAt)}</td>
                    <td className="px-4 py-3">
                      {usuario.tentativas.length} ({concluidas.length} concluídas)
                    </td>
                    <td className="px-4 py-3">{formatarNota(media)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
