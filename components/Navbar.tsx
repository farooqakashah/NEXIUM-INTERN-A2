'use client';

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-transparent backdrop-blur-sm border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-extrabold tracking-tight hover:text-gray-200 transition-colors">
          Blog Summariser
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
