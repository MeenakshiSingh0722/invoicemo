"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Menu, X, LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/invoices", label: "Invoices", icon: FileText },
        { href: "/clients", label: "Clients", icon: Users },
        { href: "/settings", label: "Settings", icon: Settings },
      ]
    : [
        { href: "/about", label: "About" },
        { href: "/pricing", label: "Pricing" },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Invoicemo Logo" width={32} height={32} priority />
          <span className="text-xl font-bold tracking-tight text-primary">Invoicemo</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-destructive"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <button onClick={toggleTheme} className="p-2">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="border-b md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium hover:bg-accent"
              >
                {link.icon && <link.icon size={18} />}
                <span>{link.label}</span>
              </Link>
            ))}
            {!user && (
              <div className="mt-4 flex flex-col space-y-2 px-3">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-center text-sm font-medium py-2 hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground"
                >
                  Sign Up
                </Link>
              </div>
            )}
            {user && (
              <button
                onClick={logout}
                className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-accent"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
