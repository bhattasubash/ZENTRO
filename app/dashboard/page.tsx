"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllRoadmaps, deleteRoadmap, duplicateRoadmap, type SavedProject } from '@/lib/api';
import { createClient } from '@/lib/supabase/client';

export default function Dashboard() {
  const [plans, setPlans] = useState<SavedProject[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const loadPlans = async () => {
    try {
      const data = await getAllRoadmaps();
      setPlans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    setActionLoading(projectId);
    try {
      await deleteRoadmap(projectId);
      setPlans((prev) => prev.filter((p) => p.projectId !== projectId));
    } catch (err) {
      alert('Failed to delete roadmap.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setActionLoading(projectId);
    try {
      const duplicated = await duplicateRoadmap(projectId);
      if (duplicated) {
        setPlans((prev) => [duplicated, ...prev]);
      }
    } catch (err) {
      alert('Failed to duplicate roadmap.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex">
      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#1C1B1B] py-6 z-[60]">
        <div className="px-8 mb-12">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-black text-white tracking-tighter">
              ZENTRO
            </Link>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-outline mt-2 font-bold">
            Guided Execution
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/dashboard"
            className="text-white border-l-2 border-[#0033FF] bg-[#393939] px-8 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out"
          >
            <span className="material-symbols-outlined text-xl text-primary-container">dashboard</span>
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link
            href="/input"
            className="text-[#C4C5DA] px-8 py-3 flex items-center gap-3 hover:bg-[#201F1F] hover:text-white transition-all duration-200 ease-in-out group"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-primary-container">add_circle</span>
            <span className="font-medium text-sm">New Plan</span>
          </Link>
          <Link
            href="/pricing"
            className="text-[#C4C5DA] px-8 py-3 flex items-center gap-3 hover:bg-[#201F1F] hover:text-white transition-all duration-200 ease-in-out group"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-primary-container">payments</span>
            <span className="font-medium text-sm">Pricing</span>
          </Link>
        </nav>

        <div className="mt-auto pt-6 space-y-1">
          <Link
            href="/settings"
            className="text-[#C4C5DA] px-8 py-3 flex items-center gap-3 hover:bg-[#201F1F] hover:text-white transition-all duration-200 ease-in-out group"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left text-[#C4C5DA] px-8 py-3 flex items-center gap-3 hover:bg-[#201F1F] hover:text-white transition-all duration-200 ease-in-out group"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen flex flex-col w-full z-40 bg-surface relative">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-8 py-6 bg-[#131313] sticky top-0 z-40">
          <div className="md:hidden flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-tighter text-white uppercase">
              ZENTRO
            </Link>
          </div>
          <h1 className="hidden md:block text-2xl font-extrabold tracking-tighter text-on-surface uppercase pr-4">
            Your Plans
          </h1>
          <div className="flex items-center gap-6">
            <Link
              href="/input"
              className="bg-primary-container text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-[0_0_15px_0_rgba(0,51,255,0.3)] active:scale-95 transition-all flex items-center gap-2"
            >
              New Plan <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </header>

        {/* Content Canvas */}
        <section className="flex-1 px-8 py-12 max-w-6xl w-full mx-auto">
          {/* Mobile Headline */}
          <div className="md:hidden mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">Your Plans</h1>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 gap-4">
            {!loaded ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">
                  progress_activity
                </span>
              </div>
            ) : plans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <span className="material-symbols-outlined text-outline text-6xl">assignment</span>
                <h3 className="text-xl font-bold text-white">No plans yet</h3>
                <p className="text-on-surface-variant text-sm">Create your first plan to get started.</p>
                <Link
                  href="/input"
                  className="bg-primary-container text-white px-8 py-3 rounded-lg font-bold text-sm hover:shadow-[0_0_15px_rgba(0,51,255,0.3)] active:scale-95 transition-all flex items-center gap-2"
                >
                  Create Plan <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ) : (
              plans.map((plan, i) => (
                <div
                  key={plan.projectId}
                  onClick={() => {
                    localStorage.setItem('zentro_plan', JSON.stringify(plan.data));
                    localStorage.setItem('zentro_plan_idea', plan.idea);
                    router.push(`/plan?projectId=${plan.projectId}`);
                  }}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-container-low hover:bg-surface-bright transition-all duration-300 cursor-pointer overflow-hidden rounded-lg border border-transparent hover:border-outline-variant/20"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[10px] uppercase tracking-widest text-outline font-bold">
                      Plan #{String(plans.length - i).padStart(3, '0')}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                      {plan.idea}
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Created{' '}
                      {new Date(plan.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-4 shrink-0">
                    <span className="px-3 py-1 bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-black uppercase tracking-wider rounded-sm">
                      Generated
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        title="Duplicate plan"
                        onClick={(e) => handleDuplicate(e, plan.projectId)}
                        disabled={actionLoading === plan.projectId}
                        className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-container-high rounded transition-colors disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                      </button>

                      <button
                        title="Delete plan"
                        onClick={(e) => handleDelete(e, plan.projectId)}
                        disabled={actionLoading === plan.projectId}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>

                    <span className="material-symbols-outlined text-outline group-hover:translate-x-1 group-hover:text-white transition-all">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Footer / Technical Metadata */}
        <footer className="px-8 py-12 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-outline-variant/10 pt-8 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">Zentro Engine v2.4.0</p>
              <p className="text-[10px] text-outline-variant mt-1">Ready for deployment sequence.</p>
            </div>
            <div className="flex gap-8">
              <Link href="/status" className="text-[10px] font-bold uppercase tracking-widest text-outline-variant hover:text-white transition-colors">
                System Status
              </Link>
              <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-outline-variant hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1C1B1B] h-16 flex justify-around items-center z-50 border-t border-outline-variant/10">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary-container">
          <span className="material-symbols-outlined text-xl">dashboard</span>
        </Link>
        <Link href="/input" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-xl">add_circle</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-xl">settings</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>
      </nav>
    </div>
  );
}
