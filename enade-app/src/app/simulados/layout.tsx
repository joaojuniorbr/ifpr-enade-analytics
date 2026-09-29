import { redirect } from "next/navigation";
import { requireStudent } from "@/lib/auth";
import { findStudent } from "@/lib/student";

export default async function StudentExamLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudent();
  const student = await findStudent(user);
  if (!student) redirect("/primeiro-acesso");
  return children;
}
