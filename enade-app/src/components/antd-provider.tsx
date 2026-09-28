"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={ptBR}
        theme={{
          token: {
            colorPrimary: "#6d4aff",
            borderRadius: 6,
            fontFamily: "inherit",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
