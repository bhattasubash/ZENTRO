"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Pricing() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUserPlan() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (profile?.plan === 'pro') {
          setPlan('pro');
        }
      }
      setCheckingAuth(false);
    }

    loadUserPlan();
  }, [supabase]);

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initiate checkout.');
      }
    } catch (err) {
      alert('Something went wrong connecting to checkout.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open billing portal.');
      }
    } catch (err) {
      alert('Something went wrong opening billing portal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-[calc(100vh-144px)]">
      {/* Header Section */}
      <header className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block px-2 py-1 text-xs text-primary-container font-bold uppercase tracking-[0.2em] mb-4">
              Execution Tiers
            </span>
            <h1 className="text-[3.5rem] font-extrabold tracking-tighter leading-none text-white mb-6">
              Simple pricing
            </h1>
            <p className="text-on-surface-variant text-xl leading-relaxed max-w-lg">
              Choose the plan that fits your execution speed. No hidden fees, no complexity.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-surface-container-low p-1 rounded-lg flex gap-1">
              <button className="px-6 py-2 bg-surface-container-high text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                Monthly
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* FREE Plan */}
        <div className="bg-surface-container-low p-10 lg:p-12 flex flex-col justify-between border-t-2 border-transparent transition-all duration-300 hover:bg-surface-container rounded-lg">
          <div>
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-white text-3xl font-extrabold tracking-tighter mb-2">FREE</h2>
                <p className="text-on-surface-variant text-sm uppercase tracking-widest font-medium">Core essentials</p>
              </div>
              <div className="text-4xl font-extrabold text-white">
                $0<span className="text-lg text-on-surface-variant font-normal">/mo</span>
              </div>
            </div>

            <ul className="space-y-6 mb-16">
              <li className="flex items-center gap-4 group">
                <span className="material-symbols-outlined text-outline text-sm">check</span>
                <span className="text-on-surface-variant group-hover:text-white transition-colors">Limited plans</span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="material-symbols-outlined text-outline text-sm">check</span>
                <span className="text-on-surface-variant group-hover:text-white transition-colors">Community support</span>
              </li>
              <li className="flex items-center gap-4 group opacity-40">
                <span className="material-symbols-outlined text-outline text-sm">close</span>
                <span className="text-on-surface-variant">Faster generation</span>
              </li>
              <li className="flex items-center gap-4 group opacity-40">
                <span className="material-symbols-outlined text-outline text-sm">close</span>
                <span className="text-on-surface-variant">Priority support</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-lg border border-outline-variant/20 uppercase tracking-widest text-xs cursor-default"
          >
            {plan === 'free' ? 'Current Plan' : 'Free Tier'}
          </button>
        </div>

        {/* PRO Plan */}
        <div className="bg-surface-container p-10 lg:p-12 flex flex-col justify-between border-t-2 border-primary-container relative overflow-hidden group rounded-lg">
          {/* Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[80px] rounded-full"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-white text-3xl font-extrabold tracking-tighter">PRO</h2>
                  <span className="bg-primary-container text-[10px] text-white font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                    Recommended
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm uppercase tracking-widest font-medium">High performance</p>
              </div>
              <div className="text-4xl font-extrabold text-white">
                $49<span className="text-lg text-on-surface-variant font-normal">/mo</span>
              </div>
            </div>

            <ul className="space-y-6 mb-16">
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-white">Unlimited plans</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-white">Faster generation</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-white">PDF Roadmap Export</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-white">Priority support</span>
              </li>
            </ul>
          </div>

          {plan === 'pro' ? (
            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="relative z-10 w-full py-4 bg-surface-bright text-white font-bold rounded-lg hover:bg-[#444] transition-all active:scale-[0.98] uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-primary-container/40"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Opening Portal...</span>
                </>
              ) : (
                <>
                  <span>Current Plan (Manage Subscription)</span>
                  <span className="material-symbols-outlined text-sm">settings</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="relative z-10 w-full py-4 bg-primary-container text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,51,255,0.4)] transition-all active:scale-[0.98] uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Upgrade</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Trust Section / Comparison */}
      <section className="mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-outline-variant/10">
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Architectural Design</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Built on the &apos;Electric Monolith&apos; system, ensuring every output is visually commanding and precise.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Global Scale</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Infrastructure designed for zero latency, regardless of plan complexity or generation volume.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase tracking-widest text-xs">Unmatched Support</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Direct access to the core engineering team for Pro users, ensuring zero downtime for your workflow.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Simple */}
      <section className="mt-32 max-w-3xl">
        <h2 className="text-2xl font-bold text-white mb-12 uppercase tracking-tight">Questions</h2>
        <div className="space-y-10">
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Can I change plans at any time?</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Yes. You can upgrade or manage your subscription anytime through the Stripe Customer Portal.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-semibold">What defines &quot;faster generation&quot;?</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Pro users are allocated to dedicated compute nodes with high-priority queues, reducing wait times by up to 80%.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
