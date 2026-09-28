import { requireStudent } from "@/lib/auth";

export default async function StudentExamLayout({ children }: { children: React.ReactNode }) {
  await requireStudent();
  return children;
}
