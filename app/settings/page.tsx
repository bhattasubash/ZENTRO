"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (profile?.plan) {
        setPlan(profile.plan);
      }
      setLoading(false);
    }

    loadUserData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const userEmail = user?.email || 'User';
  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (userEmail.includes('@') ? userEmail.split('@')[0] : 'User');
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'Z';

  const provider = user?.app_metadata?.provider || 'email';
  const providerLabel =
    provider === 'google'
      ? 'Google OAuth'
      : provider === 'github'
      ? 'GitHub OAuth'
      : 'Email Magic Link';

  const lastLoginFormatted = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Active Session';

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex">
      {/* SideNavBar Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1C1B1B] hidden md:flex flex-col z-50">
        <div className="px-6 py-8">
          <Link href="/dashboard" className="text-2xl font-black tracking-tighter text-white uppercase">
            Zentro
          </Link>
          <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mt-1">
            {plan === 'pro' ? 'PRO Plan' : 'Free Tier'}
          </p>
        </div>

        <nav className="flex-1 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="#profile"
            className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <Link
            href="#preferences"
            className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150"
          >
            <span className="material-symbols-outlined">tune</span>
            <span className="text-sm font-medium">Preferences</span>
          </Link>
          <Link
            href="#security"
            className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150"
          >
            <span className="material-symbols-outlined">shield</span>
            <span className="text-sm font-medium">Security</span>
          </Link>
          <Link
            href="#danger"
            className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150"
          >
            <span className="material-symbols-outlined">warning</span>
            <span className="text-sm font-medium">Danger Zone</span>
          </Link>
        </nav>

        <div className="p-6 mt-auto flex items-center justify-between border-t border-outline-variant/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-xs text-white font-bold shrink-0">
              {initials}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-white text-xs font-bold truncate">{fullName}</span>
              <span className="text-[#C4C5DA] text-[10px] truncate">{userEmail}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="text-on-surface-variant hover:text-white transition-colors p-1"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </aside>

      {/* TopAppBar Shell */}
      <header className="fixed top-0 md:left-64 right-0 h-16 bg-[#131313]/80 backdrop-blur-xl flex items-center justify-between px-8 z-40">
        <div className="flex items-center gap-4">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#C4C5DA]">
            System / Settings
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-white flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-32 pb-24 px-12 max-w-5xl w-full">
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Account Settings</h2>
          <p className="text-on-surface-variant max-w-md">
            Manage your authenticated account, authentication methods, and platform preferences.
          </p>
        </div>

        <div className="space-y-24">
          {/* Profile Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12" id="profile">
            <div className="md:col-span-1">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mb-2">
                01 / Profile
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your authenticated account within the Zentro platform.
              </p>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant block">
                  Name
                </label>
                <input
                  className="w-full bg-surface-container-lowest border-none outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary px-0 py-3 text-on-surface placeholder-outline transition-all duration-300"
                  type="text"
                  readOnly
                  value={fullName}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant block">
                  Email Address
                </label>
                <input
                  className="w-full bg-surface-container-lowest border-none outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary px-0 py-3 text-on-surface placeholder-outline transition-all duration-300"
                  type="email"
                  readOnly
                  value={userEmail}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant block">
                  Current Plan
                </label>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-primary-container/20 border border-primary-container/40 text-primary-container text-xs font-bold uppercase tracking-wider rounded">
                    {plan === 'pro' ? 'PRO Member' : 'Free Tier'}
                  </span>
                  <Link href="/pricing" className="text-xs text-white hover:underline uppercase tracking-wider">
                    {plan === 'pro' ? 'Manage Subscription →' : 'Upgrade Plan →'}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12" id="preferences">
            <div className="md:col-span-1">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mb-2">
                02 / Preferences
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Interface settings and display modes.
              </p>
            </div>

            <div className="md:col-span-2 space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-tight">Dark Mode</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                      Optimized for high-contrast focus
                    </p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-primary-container rounded-full relative cursor-default">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-tight">
                      System Notifications
                    </h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                      Delivery updates for generation completions
                    </p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-primary-container rounded-full relative cursor-default">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section (Main Canvas) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-outline-variant/10" id="security">
            <div className="md:col-span-1">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mb-2">
                03 / Security
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Authentication method and active session information.
              </p>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="p-6 bg-surface-container-low rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">Authentication Method</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{providerLabel}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-wider rounded">
                    Verified
                  </span>
                </div>
                <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant">Last Authenticated Session</span>
                  <span className="text-white font-mono text-[11px]">{lastLoginFormatted}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-outline-variant/10" id="danger">
            <div className="md:col-span-1">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-error mb-2">
                04 / Danger Zone
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Irreversible actions that affect your account data integrity and access.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="p-8 bg-error-container/10 border border-error-container/20 rounded-lg flex flex-col items-start gap-6">
                <div>
                  <h4 className="text-sm font-bold text-error uppercase tracking-tight mb-2">Log Out of All Devices</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm">
                    Terminates all active browser sessions and requires re-authentication.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-transparent border border-error text-error px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-error hover:text-on-error transition-all duration-300"
                >
                  Log Out
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Contextual Information (Clean Real Security Detail) */}
      <div className="fixed top-32 right-12 w-64 hidden xl:block z-40">
        <div className="bg-surface-container-high/40 backdrop-blur-2xl p-6 rounded-lg border border-outline-variant/10">
          <h5 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mb-4">
            Security Overview
          </h5>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              <span className="text-[10px] uppercase font-bold text-on-surface">
                Auth: {providerLabel}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              <span className="text-[10px] uppercase font-bold text-on-surface">
                Last Login: {lastLoginFormatted}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
