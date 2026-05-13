import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Bella Make | PDV",
  description: "Sistema de PDV premium para lojas de maquiagem",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              height: "100vh",
              overflowY: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
