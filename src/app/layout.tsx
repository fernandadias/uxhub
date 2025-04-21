import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SupabaseProvider } from '@/contexts/SupabaseContext';
import { Sidebar } from '@/components/shared/Sidebar';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

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
        <SupabaseProvider>
          <AuthProvider>
            <div className="flex min-h-screen">
              {!isAuthPage && (
                <div className="bg-background border-border">
                  <Sidebar />
                </div>
              )}
              <main className={`flex-1 min-h-screen ${!isAuthPage ? '' : ''}`}>
                <div className="h-full">
                  {children}
                </div>
              </main>
            </div>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
} 