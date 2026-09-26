import { PerguntaForm } from "@/components/pergunta-form";

export const metadata = { title: "Nova pergunta" };

export default function NovaPergunta() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Nova pergunta</h1>
      <PerguntaForm />
    </div>
  );
}
