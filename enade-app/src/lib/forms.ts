export type FormState = { error: string | null };

export const initialFormState: FormState = { error: null };

export function withForm(
  path: string,
  current: Record<string, string | undefined>,
  form?: string,
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (!value || key === "form" || key === "notice" || key === "error") continue;
    search.set(key, value);
  }
  if (form) search.set("form", form);
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
