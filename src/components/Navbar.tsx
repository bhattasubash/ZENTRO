"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <img
              alt="Zentro Logo"
              className="h-55 w-auto py-10 object-contain brightness-0 invert opacity-90 drop-shadow-sm"
              src="/Transparent Logo of ZENTRO.png"
            />
          </Link>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link
            className="font-['Inter'] tracking-tighter font-medium text-sm text-[#C4C5DA] hover:text-white transition-colors duration-300"
            href="/pricing"
          >
            Pricing
          </Link>
          {user ? (
            <Link
              className="font-['Inter'] tracking-tighter font-medium text-sm text-[#C4C5DA] hover:text-white transition-colors duration-300"
              href="/dashboard"
            >
              Dashboard
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
        <div className="flex items-center gap-4">
          {user ? (
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
