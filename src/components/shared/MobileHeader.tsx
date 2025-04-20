import Link from 'next/link';
import { FiHome, FiPlus, FiList } from 'react-icons/fi';

export function MobileHeader() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 bg-[#1f1e20] border-b border-[rgb(45,45,45)] z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-xl">
            UX na Real
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              <FiHome className="w-5 h-5" />
            </Link>
            <Link
              href="/heuristics/new"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              <FiPlus className="w-5 h-5" />
            </Link>
            <Link
              href="/heuristics"
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              <FiList className="w-5 h-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 