import { redirect } from "next/navigation";

export default async function EditStudentPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { key } = await params;
  const query = await searchParams;
  const error = query.error ? `&error=${encodeURIComponent(query.error)}` : "";
  redirect(`/admin/alunos?form=${key}${error}`);
}
