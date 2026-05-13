"use client"
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

function Header() {
  const path = usePathname();

  const navLink = (href, label) => (
    <li
      className={`cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 hover:text-teal-700
      ${path === href ? 'bg-teal-50 text-teal-700' : 'text-slate-600'}`}
    >
      {label}
    </li>
  );

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Image src="/logo.svg" width={42} height={42} alt="logo" />
        <span className="truncate text-lg font-bold tracking-tight text-slate-800 sm:text-xl">AI Interviewer</span>
      </div>
      <ul className="hidden md:flex items-center gap-2">
        {navLink('/dashboard', 'Dashboard')}
      </ul>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default Header;
