import Image from "next/image";
import { redirect } from "next/navigation";
import { saveClassGroup } from "@/app/aluno/actions";
import { Notice } from "@/components/notice";
import { requireStudent } from "@/lib/auth";
import { findStudent } from "@/lib/student";
import { fieldClass, primaryButton, wordmarkClass } from "@/lib/styles";

export const metadata = { title: "Primeiro acesso" };

export default async function FirstAccess({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireStudent();
  const student = await findStudent(user);
  if (student) redirect("/");

  const params = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#eef1ea] px-6 py-10">
      <div className="flex w-full max-w-5xl items-center justify-center gap-8">
        <form action={saveClassGroup} className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-[0_8px_28px_rgba(30,40,20,0.05)] sm:p-10">
          <p className={wordmarkClass}>ENADE</p>
          <p className="mt-8 text-xs font-medium tracking-[0.18em] text-slate-500">PRIMEIRO ACESSO</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Qual é a sua turma?</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            O simulado guarda só um código anônimo e a turma. Não pedimos CPF, nome completo nem e-mail.
          </p>
          {params.error ? (
            <div className="mt-4">
              <Notice tone="red" text={params.error} />
            </div>
          ) : null}
          <label className="mt-6 block text-sm font-medium text-slate-800">
            Turma
            <input
              name="classGroup"
              required
              maxLength={64}
              placeholder="Ex.: ADS 2026"
              className={`${fieldClass} mt-2`}
            />
          </label>
          <button type="submit" className={`${primaryButton} mt-6`}>
            Continuar
          </button>
          <p className="mt-8 text-xs leading-5 text-slate-400">
            Este simulado não vale nota e não substitui o ENADE oficial.
          </p>
        </form>
        <Image
          src="/undraw-welcome.svg"
          alt=""
          width={420}
          height={360}
          unoptimized
          className="hidden h-auto w-72 shrink-0 lg:block"
        />
      </div>
    </main>
  );
}
