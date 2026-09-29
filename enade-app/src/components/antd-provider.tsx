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
            colorPrimary: "#3c7a4b",
            borderRadius: 10,
            fontFamily: "inherit",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
