"use client";

import { botaoPerigo } from "@/lib/estilos";

export function BotaoExcluir({
  id,
  action,
  rotulo,
  mensagem,
}: {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  rotulo: string;
  mensagem: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(evento) => {
        if (!window.confirm(mensagem)) evento.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={botaoPerigo}>
        {rotulo}
      </button>
    </form>
  );
}
