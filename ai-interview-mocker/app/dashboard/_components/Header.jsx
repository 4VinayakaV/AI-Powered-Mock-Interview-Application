"use client"
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);

  const navLink = (href, label) => (
    <li
      className={`transition-all cursor-pointer hover:text-primary hover:font-bold px-2 py-1 rounded-md
      ${path === href ? 'text-primary font-bold bg-gray-100' : ''}`}
    >
      {label}
    </li>
  );

  return (
    <div className="flex p-4 items-center justify-between bg-white shadow-md border-b sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" width={42} height={42} alt="logo" />
        <span className="text-xl font-semibold tracking-tight text-gray-700">AI Interviewer</span>
      </div>
      <ul className="hidden md:flex gap-6 text-gray-600 text-sm">
        {navLink('/dashboard', 'DashBoard')}
        {navLink('/dashboard/questions', 'Questions')}
        {navLink('/dashboard/upgrade', 'Upgrade')}
        {navLink('/dashboard/how', 'How does it work?')}
      </ul>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}

export default Header;