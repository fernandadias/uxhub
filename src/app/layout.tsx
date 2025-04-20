import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UX na Real",
  description: "Análise heurística automatizada de interfaces",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAuthPage = pathname === "/auth" || pathname.startsWith("/auth/");

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          {!isAuthPage && (
            <div className="bg-background  border-border">
              <Sidebar />
            </div>
          )}
          <main className={`flex-1 min-h-screen ${!isAuthPage ? '' : ''}`}>
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
} 