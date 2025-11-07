'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled ? 'w-[95%] max-w-7xl' : 'w-[98%] max-w-7xl'}`}>
      <div className={`relative rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
        scrolled 
          ? 'border-purple-500/30 bg-zinc-950/80 shadow-2xl shadow-purple-900/30' 
          : 'border-purple-400/20 bg-zinc-950/60 shadow-xl shadow-purple-900/20'
      }`}>
        {/* Glass effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-violet-500/10 pointer-events-none" />
        
        <div className="relative flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-purple-500/50 relative overflow-hidden group">
              <Image src="/damareen.png" width="100" height="100" alt="damareen logo"/>
            </div>
            <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-2xl font-bold text-transparent">
              Damareen
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group"
            >
              Funkciók
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="#gameplay"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group"
            >
              Játékmenet
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="#cards"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group"
            >
              Kártyák
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="#about"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group"
            >
              Rólunk
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10 font-medium"
              >
                Belépés
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-violet-600 hover:shadow-purple-500/50 transition-all hover:scale-105">
                Kezdjük el!
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-purple-500/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6 text-zinc-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-2 rounded-2xl border border-purple-400/20 bg-zinc-950/95 backdrop-blur-xl shadow-xl shadow-purple-900/20 md:hidden overflow-hidden">
          <div className="space-y-1 p-4">
            <Link
              href="#features"
              className="block px-4 py-3 text-zinc-300 transition-all hover:text-purple-300 hover:bg-purple-500/10 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Funkciók
            </Link>
            <Link
              href="#gameplay"
              className="block px-4 py-3 text-zinc-300 transition-all hover:text-purple-300 hover:bg-purple-500/10 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Játékmenet
            </Link>
            <Link
              href="#cards"
              className="block px-4 py-3 text-zinc-300 transition-all hover:text-purple-300 hover:bg-purple-500/10 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Kártyák
            </Link>
            <Link
              href="#about"
              className="block px-4 py-3 text-zinc-300 transition-all hover:text-purple-300 hover:bg-purple-500/10 rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Rólunk
            </Link>
            <div className="flex flex-col gap-2 pt-3 border-t border-purple-400/20 mt-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="ghost" 
                  className="w-full text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10 font-medium"
                >
                  Belépés
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-violet-600">
                  Kezdjük el!
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
