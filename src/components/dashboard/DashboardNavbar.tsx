'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { 
  Home, 
  Gamepad2, 
  BarChart3, 
  Settings, 
  User, 
  LogOut,
  Menu,
  X,
  Shield,
  Users
} from "lucide-react";

export default function DashboardNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-7xl">
      <div className="relative rounded-2xl border border-purple-400/20 bg-zinc-950/70 backdrop-blur-xl">
        {/* Glass effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-violet-500/10 pointer-events-none" />
        
        <div className="relative flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ring-2 ring-purple-500 from-purple-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-purple-500/50 relative overflow-hidden group">
              <Image src="/damareen.png" width="100" height="100" alt="damareen logo"/>
            </div>
            <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-fuchsia-300 bg-clip-text text-2xl font-bold text-transparent">
              Damareen
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Áttekintés
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/dashboard/games"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              Játékaim
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/dashboard/players"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Játékosok
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/dashboard/stats"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Statisztikák
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/dashboard/settings"
              className="relative text-sm font-medium text-zinc-300 transition-all hover:text-purple-300 group flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Beállítások
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-400 transition-all group-hover:w-full" />
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {session?.user.role === "WEBMASTER" && (
              <Link href="/webmaster">
                <Button 
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Webmester Panel
                </Button>
              </Link>
            )}
            
            <Link href="/">
              <Button 
                variant="outline" 
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Főoldal
              </Button>
            </Link>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">{session?.user.username}</span>
            </div>

            <Button 
              onClick={() => signOut({ callbackUrl: `${window.location.origin}/dashboard` })}
              variant="ghost"
              className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-300 hover:text-purple-300 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Áttekintés</span>
            </Link>
            <Link
              href="/dashboard/games"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">Játékaim</span>
            </Link>
            <Link
              href="/dashboard/players"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Játékosok</span>
            </Link>
            <Link
              href="/dashboard/stats"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Statisztikák</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Beállítások</span>
            </Link>
            
            {session?.user.role === "WEBMASTER" && (
              <Link
                href="/webmaster"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Webmester Panel</span>
              </Link>
            )}

            <div className="pt-2 border-t border-zinc-800 mt-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900/50">
                <User className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-white">{session?.user.username}</span>
              </div>
              <Button 
                onClick={() => signOut({ callbackUrl: `${window.location.origin}/dashboard` })}
                variant="ghost"
                className="w-full mt-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Kijelentkezés
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
