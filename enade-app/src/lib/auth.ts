import { Prisma, type Usuario } from "@prisma/client";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { emailsAdmin, supabaseConfigurado } from "@/lib/supabase/env";
import { criarClienteServidor } from "@/lib/supabase/server";

type UsuarioAuth = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

function nomeExibido(meta: Record<string, unknown>, email: string): string {
  for (const chave of ["full_name", "name", "user_name", "preferred_username"]) {
    const valor = meta[chave];
    if (typeof valor === "string" && valor.trim()) {
      return valor.trim().slice(0, 120);
    }
  }
  const local = email.split("@")[0]?.trim();
  return (local || "Aluno").slice(0, 120);
}

export async function sincronizarUsuario(user: UsuarioAuth): Promise<Usuario | null> {
  const email = user.email?.trim().toLowerCase();
  if (!email) return null;

  const nome = nomeExibido(user.user_metadata ?? {}, email);
  const promover = emailsAdmin().includes(email);

  try {
    const existente = await prisma.usuario.findUnique({ where: { id: user.id } });
    if (!existente) {
      return await prisma.usuario.create({
        data: {
          id: user.id,
          email,
          nome,
          role: promover ? "ADMIN" : "ALUNO",
        },
      });
    }

    return await prisma.usuario.update({
      where: { id: user.id },
      data: {
        email,
        nome,
        ...(promover ? { role: "ADMIN" as const } : {}),
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("EMAIL_EM_USO");
    }
    throw error;
  }
}

export const obterUsuarioOpcional = cache(async (): Promise<Usuario | null> => {
  if (!supabaseConfigurado()) return null;

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return sincronizarUsuario(data.user);
});

export async function exigirUsuario(): Promise<Usuario> {
  const usuario = await obterUsuarioOpcional();
  if (!usuario) redirect("/login");
  return usuario;
}

export async function exigirAdmin(): Promise<Usuario> {
  const usuario = await exigirUsuario();
  if (usuario.role !== "ADMIN") redirect("/prova");
  return usuario;
}
