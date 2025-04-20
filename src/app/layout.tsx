import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UX na Real",
  description: "Ferramenta de auditoria de heurísticas de usabilidade",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-[#1c1c1d]">
          <Sidebar />
          <main className="flex-1 md:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 