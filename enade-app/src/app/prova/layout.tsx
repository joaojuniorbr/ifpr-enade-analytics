import { exigirUsuario } from "@/lib/auth";

export default async function LayoutProva({ children }: { children: React.ReactNode }) {
  await exigirUsuario();
  return children;
}
