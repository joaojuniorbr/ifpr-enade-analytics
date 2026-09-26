"use client";

import { dangerButton } from "@/lib/styles";

export function DeleteButton({
  id,
  action,
  label,
  message,
}: {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  message: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={dangerButton}>
        {label}
      </button>
    </form>
  );
}
