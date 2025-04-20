'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiHome, FiPlus, FiList, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { name: 'Hub de Ferramentas', path: '/', icon: FiHome },
  { name: 'Contextos', path: '/contextos', icon: FiList },
  { name: 'Histórico', path: '/historico', icon: FiList },
  { name: 'Novidades', path: '/novidades', icon: FiList },
  { name: 'Club', path: '/club', icon: FiList },
];

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <>
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1c1c1d] border-b border-[#2d2d2d] z-50 flex items-center justify-between px-4">
        <Image
          src="/images/logo.png"
          alt="UX na Real"
          width={90}
          height={24}
          className="h-6 w-auto"
        />
        <button
          className="p-2 rounded-lg bg-white/10 border border-[#2d2d2d]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1c1c1d] border-r border-[#2d2d2d] transform transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative z-40`}
      >
        <div className="flex flex-col h-full p-4 pt-20 md:pt-4">
          <div className="mb-8 md:block hidden">
            <Image
              src="/images/logo.png"
              alt="UX na Real"
              width={90}
              height={24}
              className="h-6 w-auto"
            />
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        pathname === item.path
                          ? 'bg-white/10 text-white'
                          : 'text-[#9ca3af] hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto pt-4">
            <div className="mb-4">
              <p className="text-[#9ca3af] text-sm">
                Plano: <span className="text-white text-sm">Premium</span>
              </p>

              <div className="w-full bg-white/10 h-2 rounded-full mt-2">
                <div className="w-3/4 bg-[#A8E80E] h-full rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white">ND</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Nanda Dias</p>
                <p className="text-[#9ca3af] text-xs">uxnareal@gmail.com</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="p-2 rounded-lg bg-white/10 border border-[#2d2d2d] hover:bg-white/20 transition-colors duration-200"
                title="Configurações"
              >
                <FiSettings className="w-5 h-5 text-white" />
              </button>
              <button
                className="p-2 rounded-lg bg-white/10 border border-[#2d2d2d] hover:bg-white/20 transition-colors duration-200"
                title="Sair"
                onClick={() => signOut()}
              >
                <FiLogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 