"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Database, Calendar, Play } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Proyección", href: "/", icon: TrendingUp },
    { name: "Grupos", href: "/groups", icon: Database },
  ];

  return (
    <header className="border-b border-card-border bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-mono text-xl font-black tracking-wider text-slate-50 uppercase">
              MUNDIAL<span className="text-accent-green">2026</span> <span className="text-xs px-2 py-0.5 bg-accent-green/10 text-accent-green rounded border border-accent-green/20 font-bold ml-1">IA</span>
            </span>
          </Link>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md font-mono text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-accent-green bg-accent-green/5"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-full border border-card-border font-terminal text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            <span className="text-slate-400">Recalculado hoy</span>
          </div>
        </div>
      </div>
    </header>
  );
}
