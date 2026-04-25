'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-black border-b border-[#1A1A1A] py-4">
      <div className="container mx-auto px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#C5A059] flex items-center justify-center font-black text-black group-hover:brightness-110 transition-all">P</div>
          <span className="font-black tracking-tighter text-xl uppercase">PIXEL-BENCH</span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link
            href="/runs"
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
              pathname === '/runs' ? 'text-[#C5A059]' : 'text-[#333333] hover:text-[#f5f5f5]'
            }`}
          >
            Gallery
          </Link>
          <Link
            href="/compare"
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
              pathname === '/compare' ? 'text-[#C5A059]' : 'text-[#333333] hover:text-[#f5f5f5]'
            }`}
          >
            Compare
          </Link>
          <div className="h-4 w-px bg-[#1A1A1A]" />
          <Link
            href="/leaderboard"
            className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
              pathname === '/leaderboard' ? 'text-[#C5A059]' : 'text-[#333333] hover:text-[#f5f5f5]'
            }`}
          >
            Leaderboard
          </Link>
          <div className="h-4 w-px bg-[#1A1A1A]" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${process.env.NEXT_PUBLIC_REVIEW_MODE === 'true' ? 'bg-[#C5A059] animate-pulse' : 'bg-[#333333]'}`} />
            <span className="text-[10px] font-mono text-[#333333] uppercase font-bold">
              {process.env.NEXT_PUBLIC_REVIEW_MODE === 'true' ? 'Review Mode' : 'Public Mode'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
