import { redirect } from "next/navigation";

export default async function EditQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { key } = await params;
  const query = await searchParams;
  const error = query.error ? `&error=${encodeURIComponent(query.error)}` : "";
  const notice = query.notice ? `&notice=${encodeURIComponent(query.notice)}` : "";
  redirect(`/admin/questoes?form=${key}${error}${notice}`);
}
