"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { getRoadmap, type SavedProject, generateRoadmap } from '@/lib/api';
import Link from 'next/link';

function PlanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('projectId');
  const [project, setProject] = useState<SavedProject | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (projectId) {
      const saved = getRoadmap(projectId);
      setProject(saved);
    }
    setLoaded(true);
  }, [projectId]);

  const handleRegenerate = async () => {
    if (!project) return;
    setRegenerating(true);
    try {
      const result = await generateRoadmap(project.idea);
      router.push(`/plan?projectId=${result.projectId}`);
      router.refresh();
    } catch {
      // silently fail, user can retry
    } finally {
      setRegenerating(false);
    }
  };

  if (!loaded) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)] flex items-center justify-center">
        <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">progress_activity</span>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)] flex flex-col items-center justify-center gap-8">
        <span className="material-symbols-outlined text-outline text-6xl">assignment_late</span>
        <h1 className="text-3xl font-black tracking-tighter text-white">No plan found</h1>
        <p className="text-on-surface-variant">This plan doesn&apos;t exist or has been removed.</p>
        <Link href="/input" className="bg-primary-container text-white px-8 py-4 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(0,51,255,0.4)] active:scale-95 transition-all">
          Create a new plan
        </Link>
      </main>
    );
  }

  const { data } = project;

  return (
    <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)]">
      {/* Top Section */}
      <div className="mb-24 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border-l-2 border-primary-container">
          <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-primary">INITIALIZATION COMPLETE</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white max-w-4xl">
          Your idea: <span className="text-[#0033FF] drop-shadow-[0_0_10px_rgba(0,51,255,0.5)] italic">{project.idea}</span>
        </h1>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
        {/* Target Users */}
        <div className="md:col-span-4 bg-surface-container-low p-8 flex flex-col justify-between border-t border-white/5">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">01 / TARGET USERS</span>
            <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">{data.target_user}</h3>
          </div>
          <div className="mt-8 flex justify-end">
            <span className="material-symbols-outlined text-outline/30 text-4xl">groups</span>
          </div>
        </div>

        {/* Core Features */}
        <div className="md:col-span-4 bg-surface-container p-8 border-t border-white/5">
          <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">02 / CORE FEATURES</span>
          <ul className="space-y-6">
            {data.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 mt-2 bg-primary-container"></span>
                <div>
                  <span className="text-lg font-bold text-white block">{feature}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Highlight Box */}
        <div className="md:col-span-4 bg-primary-container/5 border border-primary-container/30 p-8 flex items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary-container/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <span className="material-symbols-outlined text-primary-container text-5xl mb-4">bolt</span>
            <p className="text-2xl font-black text-white leading-tight">This can be built in <span className="text-primary-container">{data.roadmap.length > 0 ? data.roadmap[data.roadmap.length - 1].day.split('–').pop()?.trim() ?? '14' : '14'} days</span></p>
          </div>
        </div>

        {/* MVP Roadmap (Main Focus) */}
        <div className="md:col-span-12 bg-surface-container-lowest p-10 border-t border-white/5 mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-2">03 / MVP ROADMAP</span>
              <h2 className="text-3xl font-black tracking-tighter text-white">The 14-Day Sprint</h2>
            </div>
            <div className="h-px flex-grow mx-8 bg-outline-variant/20 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <span className="text-[0.6875rem] uppercase tracking-widest text-primary font-bold">ACCELERATED PATH</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-outline-variant/10">
            {data.roadmap.map((step, i) => (
              <div key={i} className={`p-8 ${i < data.roadmap.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''} border-outline-variant/10 hover:bg-surface-container-high transition-colors`}>
                <span className="text-4xl font-black text-outline-variant/30 block mb-4">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="text-primary font-bold tracking-widest text-xs uppercase mb-2">{step.day}</h4>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{step.task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checklist */}
      {data.checklist && data.checklist.length > 0 && (
        <div className="mb-24">
          <h2 className="text-2xl font-black tracking-tighter text-white mb-8">Launch Checklist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant/10 rounded">
                <span className="material-symbols-outlined text-primary-container text-sm">check_box_outline_blank</span>
                <span className="text-on-surface text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-16 border-t border-outline-variant/10">
        <div className="max-w-md">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to materialize?</h3>
          <p className="text-on-surface-variant">Your roadmap is optimized and the engine is primed for execution.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link href="/input" className="bg-[#0033FF] text-white px-10 py-4 font-bold tracking-tight rounded-lg hover:shadow-[0_0_15px_rgba(0,51,255,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2">
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
    <Suspense fallback={
      <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)] flex items-center justify-center">
        <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">progress_activity</span>
      </main>
    }>
      <PlanContent />
    </Suspense>
  );
}
