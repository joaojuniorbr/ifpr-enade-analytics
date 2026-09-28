"use client";

import { Drawer } from "antd";
import { useRouter } from "next/navigation";

export function FormDrawer({
  open,
  title,
  closeHref,
  width = 480,
  children,
}: {
  open: boolean;
  title: string;
  closeHref: string;
  width?: number;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Drawer
      title={title}
      open={open}
      width={width}
      destroyOnHidden
      onClose={() => router.push(closeHref)}
    >
      {open ? children : null}
    </Drawer>
  );
}
