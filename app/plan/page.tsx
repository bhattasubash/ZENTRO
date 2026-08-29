"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getRoadmap, generateRoadmap, type SavedProject } from '@/lib/api';

interface DailyChecklistItem {
  day: number;
  task: string;
  locked?: boolean;
}

interface PlanData {
  idea_summary?: string;
  target_user?: string[];
  problem?: string[];
  solution?: string;
  unique_angle?: string;
  market_insight?: string[];
  features?: string[];
  monetization?: string[];
  distribution?: string[];
  risks?: string[];
  tech_stack?: string[];
  execution_plan?: {
    goal?: string;
    daily_checklist?: DailyChecklistItem[];
  };
  is_gated?: boolean;
  [key: string]: any;
}

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  const [data, setData] = useState<PlanData | null>(null);
  const [idea, setIdea] = useState('');
  const [projectId, setProjectId] = useState<string | null>(projectIdParam);
  const [loaded, setLoaded] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Share state
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (projectIdParam) {
        const project = await getRoadmap(projectIdParam);
        if (project) {
          setData(project.data);
          setIdea(project.idea);
          setProjectId(project.projectId);
          setLoaded(true);
          return;
        }
      }

      // Fallback to local storage
      const raw = localStorage.getItem('zentro_plan');
      const savedIdea = localStorage.getItem('zentro_plan_idea') || 'Your idea';

      if (!raw) {
        router.push('/input');
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        setData(parsed);
        setIdea(savedIdea);
      } catch {
        router.push('/input');
        return;
      }
      setLoaded(true);
    }

    loadData();
  }, [projectIdParam, router]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const result = await generateRoadmap(idea);
      setData(result.data);
      if (result.projectId) {
        setProjectId(result.projectId);
      }
    } catch {
      // user can retry
    } finally {
      setRegenerating(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    setExportError(null);

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, data }),
      });

      if (res.status === 403) {
        setExportError('PRO_REQUIRED');
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to generate PDF');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zentro-${(data?.idea_summary || idea || 'roadmap').slice(0, 20).replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err.message || 'Error exporting PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    if (!projectId) {
      alert('Please save or generate a plan before sharing.');
      return;
    }

    setSharing(true);
    setShowShareModal(true);

    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      const resData = await res.json();
      if (resData.shareUrl) {
        setShareUrl(resData.shareUrl);
      } else {
        alert(resData.error || 'Please log in to share your plan.');
        setShowShareModal(false);
      }
    } catch {
      alert('Error creating share link.');
      setShowShareModal(false);
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleRevokeShare = async () => {
    if (!projectId) return;
    try {
      await fetch('/api/share', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      setShareUrl(null);
      setShowShareModal(false);
      alert('Share link revoked.');
    } catch {
      alert('Failed to revoke share link.');
    }
  };

  if (!loaded || !data) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)] flex items-center justify-center">
        <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">
          progress_activity
        </span>
      </main>
    );
  }

  const checklist = data.execution_plan?.daily_checklist || [];
  const hasLockedItems = checklist.some((item) => item.locked);

  return (
    <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)]">
      {/* Top Action Bar */}
      <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className="text-xs uppercase tracking-widest text-on-surface-variant hover:text-white flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="bg-surface-container-high hover:bg-surface-bright text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="bg-primary-container hover:bg-on-primary-fixed-variant text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-60 shadow-[0_0_15px_rgba(0,51,255,0.3)]"
          >
            {exporting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export PRO Banner if triggered by Free User */}
      {exportError === 'PRO_REQUIRED' && (
        <div className="mb-12 p-6 bg-surface-container-high border border-primary-container/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary-container text-3xl">workspace_premium</span>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">PDF Export is a PRO Feature</h4>
              <p className="text-xs text-on-surface-variant">Upgrade your account to export beautiful branded PDFs anytime.</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="bg-primary-container text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,51,255,0.4)] transition-all shrink-0"
          >
            Upgrade to PRO
          </Link>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1B1B] border border-outline-variant/30 rounded-xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Share this Roadmap</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Anyone with this link can view a clean, read-only version of this roadmap. Your personal account and email remain private.
            </p>

            {sharing ? (
              <div className="flex items-center justify-center py-6">
                <span className="material-symbols-outlined text-primary-container text-3xl animate-spin">
                  progress_activity
                </span>
              </div>
            ) : shareUrl ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent border-none outline-none text-xs text-on-surface flex-1 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-primary-container text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider shrink-0 transition-all hover:bg-on-primary-fixed-variant"
                  >
                    {shareCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={handleRevokeShare}
                    className="text-xs text-error hover:underline uppercase tracking-wider"
                  >
                    Revoke Share Link
                  </button>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-xs text-on-surface-variant hover:text-white uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-error">Could not generate share link. Please try again.</p>
            )}
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="mb-24 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border-l-2 border-primary-container">
          <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-primary">
            INITIALIZATION COMPLETE
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white max-w-4xl">
          Your idea:{' '}
          <span className="text-[#0033FF] drop-shadow-[0_0_10px_rgba(0,51,255,0.5)] italic">
            {data.idea_summary || idea}
          </span>
        </h1>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
        {/* Target Users */}
        <div className="md:col-span-4 bg-surface-container-low p-8 flex flex-col justify-between border-t border-white/5 rounded-lg">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">
              01 / TARGET USERS
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">
              {Array.isArray(data.target_user) ? data.target_user.join(', ') : data.target_user || 'Target users'}
            </h3>
          </div>
          <div className="mt-8 flex justify-end">
            <span className="material-symbols-outlined text-outline/30 text-4xl">groups</span>
          </div>
        </div>

        {/* Core Features */}
        <div className="md:col-span-4 bg-surface-container p-8 border-t border-white/5 rounded-lg">
          <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">
            02 / CORE FEATURES
          </span>
          <ul className="space-y-6">
            {data.features?.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 mt-2 bg-primary-container"></span>
                <div>
                  <span className="text-lg font-bold text-white block">{feature}</span>
                </div>
              </li>
            ))}
            {hasLockedItems && (
              <li className="flex items-center gap-3 pt-2 text-xs font-mono text-outline">
                <span className="material-symbols-outlined text-sm text-primary-container">lock</span>
                <span>+ Additional features unlocked in PRO</span>
              </li>
            )}
          </ul>
        </div>

        {/* Highlight Box */}
        <div className="md:col-span-4 bg-primary-container/5 border border-primary-container/30 p-8 flex items-center justify-center text-center relative overflow-hidden group rounded-lg">
          <div className="absolute inset-0 bg-primary-container/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <span className="material-symbols-outlined text-primary-container text-5xl mb-4">bolt</span>
            <p className="text-2xl font-black text-white leading-tight">
              This can be built in{' '}
              <span className="text-primary-container">
                {checklist.length > 0 ? checklist[checklist.length - 1].day : 14} days
              </span>
            </p>
          </div>
        </div>

        {/* Problem */}
        {data.problem && data.problem.length > 0 && (
          <div className="md:col-span-6 bg-surface-container-low p-8 border-t border-white/5 rounded-lg">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">
              PROBLEM
            </span>
            <ul className="space-y-4">
              {data.problem.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 mt-2 bg-error"></span>
                  <span className="text-on-surface-variant text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Solution & Unique Angle */}
        <div className="md:col-span-6 bg-surface-container p-8 border-t border-white/5 rounded-lg">
          {data.solution && (
            <div className="mb-8">
              <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-4">
                SOLUTION
              </span>
              <p className="text-white font-medium leading-relaxed">{data.solution}</p>
            </div>
          )}
          {data.unique_angle && (
            <div>
              <span className="text-[0.6875rem] uppercase tracking-widest text-primary-container block mb-4">
                UNIQUE ANGLE
              </span>
              <p className="text-white font-medium leading-relaxed">{data.unique_angle}</p>
            </div>
          )}
        </div>

        {/* Market Insight */}
        {data.market_insight && data.market_insight.length > 0 && (
          <div className="md:col-span-4 bg-surface-container-low p-8 border-t border-white/5 rounded-lg">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">
              MARKET INSIGHT
            </span>
            <ul className="space-y-4">
              {data.market_insight.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 mt-2 bg-primary-container"></span>
                  <span className="text-on-surface-variant text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Monetization */}
        {data.monetization && data.monetization.length > 0 && (
          <div className="md:col-span-4 bg-surface-container p-8 border-t border-white/5 rounded-lg">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">
              MONETIZATION
            </span>
            <ul className="space-y-4">
              {data.monetization.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 mt-2 bg-primary-container"></span>
                  <span className="text-on-surface-variant text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {data.tech_stack && data.tech_stack.length > 0 && (
          <div className="md:col-span-4 bg-surface-container-low p-8 border-t border-white/5 rounded-lg">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">
              TECH STACK
            </span>
            <ul className="space-y-4">
              {data.tech_stack.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 mt-2 bg-primary-container"></span>
                  <span className="text-on-surface-variant text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MVP Roadmap — execution_plan.daily_checklist */}
        <div className="md:col-span-12 bg-surface-container-lowest p-10 border-t border-white/5 mt-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-2">
                EXECUTION PLAN
              </span>
              <h2 className="text-3xl font-black tracking-tighter text-white">
                {data.execution_plan?.goal || 'The 14-Day Sprint'}
              </h2>
            </div>
            <div className="h-px flex-grow mx-8 bg-outline-variant/20 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <span className="text-[0.6875rem] uppercase tracking-widest text-primary font-bold">
                ACCELERATED PATH
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-outline-variant/10">
            {checklist.map((item: any, i: number) => (
              <div
                key={item.day}
                className={`p-6 ${
                  i < checklist.length - 1 ? 'border-b md:border-r' : ''
                } border-outline-variant/10 transition-colors ${
                  item.locked
                    ? 'bg-surface-container-low/40 relative overflow-hidden'
                    : 'hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-primary font-bold tracking-widest text-xs uppercase">
                    Day {item.day}
                  </h4>
                  {item.locked && (
                    <span className="px-2 py-0.5 bg-primary-container/20 border border-primary-container/40 text-primary-container text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">lock</span>
                      PRO
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${item.locked ? 'text-outline select-none' : 'text-on-surface'}`}>
                  {item.task}
                </p>
              </div>
            ))}
          </div>

          {/* Locked Gating Callout */}
          {hasLockedItems && (
            <div className="mt-8 p-8 bg-gradient-to-r from-primary-container/10 via-surface-container-high to-primary-container/5 border border-primary-container/30 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-2xl">lock_open</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white uppercase tracking-tight">Unlock Days 4–14 with Zentro PRO</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Get full step-by-step daily deliverables, validation tactics, and PDF export capabilities.</p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="bg-primary-container text-white px-8 py-3.5 rounded-lg text-xs font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,51,255,0.4)] transition-all shrink-0 active:scale-95"
              >
                Upgrade to PRO ($49/mo)
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-16 border-t border-outline-variant/10">
        <div className="max-w-md">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to materialize?</h3>
          <p className="text-on-surface-variant">
            Your roadmap is optimized and the engine is primed for execution.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link
            href="/input"
            className="bg-[#0033FF] text-white px-10 py-4 font-bold tracking-tight rounded-lg hover:shadow-[0_0_15px_rgba(0,51,255,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Start building <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="bg-surface-container-high text-on-surface px-10 py-4 font-bold tracking-tight rounded-lg hover:bg-surface-bright active:scale-95 transition-all border border-outline-variant/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Plan() {
  return (
    <Suspense
      fallback={
        <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)] flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">
            progress_activity
          </span>
        </main>
      }
    >
      <PlanContent />
    </Suspense>
  );
}
