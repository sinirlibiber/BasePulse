"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Zap, Menu, X, Home, User, PenSquare, Wallet } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Feed", href: "/feed", icon: Zap },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Create", href: "/create", icon: PenSquare },
];

export function Header() {
  const pathname = usePathname();
  const { open } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-pulse-darker/80 backdrop-blur-xl border-b border-pulse-border/30" />
      
      <nav className="relative max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-pulse-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl font-display hidden sm:block">
            BasePulse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
                  isActive
                    ? "bg-pulse-card text-white"
                    : "text-gray-400 hover:text-white hover:bg-pulse-card/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Wallet Button */}
        <div className="flex items-center gap-4">
          {isConnected ? (
            <button
              onClick={() => open({ view: "Account" })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pulse-card border border-pulse-border hover:border-pulse-primary transition-all duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-pulse-gradient flex items-center justify-center">
                <Wallet className="w-3 h-3 text-white" />
              </div>
              <span className="font-mono text-sm hidden sm:block">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </button>
          ) : (
            <button
              onClick={() => open()}
              className="btn-primary text-sm px-4 py-2"
            >
              Connect
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-pulse-card/50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-pulse-darker/95 backdrop-blur-xl border-b border-pulse-border/30">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-pulse-card text-white"
                      : "text-gray-400 hover:text-white hover:bg-pulse-card/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

