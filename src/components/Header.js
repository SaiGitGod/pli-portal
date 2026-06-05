'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = document.cookie.split(';').find(c => c.trim().startsWith('pli-user='));
      if (raw) {
        const val = decodeURIComponent(raw.split('=').slice(1).join('='));
        setUser(JSON.parse(val));
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    document.cookie = 'pli-token=; path=/; max-age=0';
    document.cookie = 'pli-user=; path=/; max-age=0';
    router.push('/');
  };

  return (
    <header className="header-gradient text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl font-bold tracking-tight">
            <span className="text-teal-300">Effi</span>
            <span className="text-white">GO</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Logout">
            <LogOut size={18} />
          </button>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
