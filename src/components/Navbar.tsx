'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-950 border-b border-white/5 py-4">
      <div className="container mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-white group-hover:scale-110 transition-transform">P</div>
          <span className="font-black tracking-tighter text-xl">PIXEL-BENCH</span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link 
            href="/leaderboard" 
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
              pathname === '/leaderboard' ? 'text-blue-400' : 'text-slate-500 hover:text-white'
            }`}
          >
            Leaderboard
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${process.env.NEXT_PUBLIC_REVIEW_MODE === 'true' ? 'bg-amber-500 animate-pulse' : 'bg-slate-800'}`} />
            <span className="text-[10px] font-mono text-slate-600 uppercase font-bold">
              {process.env.NEXT_PUBLIC_REVIEW_MODE === 'true' ? 'Review Mode' : 'Public Mode'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
