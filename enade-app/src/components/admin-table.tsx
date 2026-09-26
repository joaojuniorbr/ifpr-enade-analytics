import Link from "next/link";
import { Notice } from "@/components/notice";
import { DeleteButton } from "@/components/delete-button";

export function Messages({ notice, error }: { notice?: string; error?: string }) {
  return (
    <>
      {error ? <Notice tone="red" text={error} /> : null}
      {notice === "saved" ? <Notice tone="green" text="Registro gravado." /> : null}
      {notice === "deleted" ? <Notice tone="green" text="Registro excluído." /> : null}
    </>
  );
}

export function AdminTable({
  headers,
  rows,
  deleteAction,
}: {
  headers: string[];
  rows: { id: string; href: string; columns: string[] }[];
  deleteAction: (formData: FormData) => void | Promise<void>;
}) {
  if (rows.length === 0) return <p className="text-sm text-slate-600">Nenhum registro.</p>;
  return (
    <div className="overflow-x-auto rounded-[24px] bg-white shadow-[0_10px_30px_rgba(90,70,180,0.06)]">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-200">
              {row.columns.map((column, index) => (
                <td key={`${row.id}-${index}`} className="px-4 py-3">
                  {column}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Link href={row.href} className="text-sm font-medium text-[#6d4aff] hover:underline">
                    Editar
                  </Link>
                  <DeleteButton
                    id={row.id}
                    action={deleteAction}
                    label="Excluir"
                    message="Excluir este registro? Respostas ligadas impedem a exclusão."
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
