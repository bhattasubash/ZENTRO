"use client";

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Hide the global Navbar on dashboard and settings where a full-height sidebar and topbar exist
  const isDashboardLayout = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings');
  if (isDashboardLayout) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img
              alt="Zentro Logo"
              className="h-55 w-auto py-10 object-contain brightness-0 invert opacity-90 drop-shadow-sm"
              src="/Transparent Logo of ZENTRO.png"
            />
          </Link>
        </div>

        {/* Center Nav Links */}
        <div className="flex gap-8 items-center">
          <Link
            className="font-['Inter'] tracking-tighter font-medium text-sm text-[#C4C5DA] hover:text-white transition-colors duration-300"
            href="/pricing"
          >
            Pricing
          </Link>

          {authInitialized && user ? (
            <Link
              className="font-['Inter'] tracking-tighter font-medium text-sm text-[#C4C5DA] hover:text-white transition-colors duration-300"
              href="/input"
            >
              New Plan
            </Link>
          ) : (
            <Link
              className="font-['Inter'] tracking-tighter font-medium text-sm text-[#C4C5DA] hover:text-white transition-colors duration-300"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>

        {/* Right Action / CTA */}
        <div className="flex items-center gap-4">
          {authInitialized && user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-primary-container text-white px-5 py-2 text-sm font-semibold rounded-lg active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(0,51,255,0.3)]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:block text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/input"
              className="bg-primary-container text-white px-5 py-2 text-sm font-semibold rounded-lg active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(0,51,255,0.3)]"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
