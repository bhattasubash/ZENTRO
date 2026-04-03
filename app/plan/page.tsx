"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DailyChecklistItem {
  day: number;
  task: string;
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
}

export default function Plan() {
  const router = useRouter();
  const [data, setData] = useState<PlanData | null>(null);
  const [idea, setIdea] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("zentro_plan");
    const savedIdea = localStorage.getItem("zentro_plan_idea") || "Your idea";

    if (!raw) {
      router.push("/input");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setData(parsed);
      setIdea(savedIdea);
    } catch {
      router.push("/input");
      return;
    }
    setLoaded(true);
  }, [router]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("https://zentroapi.iamsubash2064.workers.dev/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error("Failed");

      const result = await res.json();
      localStorage.setItem("zentro_plan", JSON.stringify(result.data));
      setData(result.data);
    } catch {
      // silently fail, user can retry
    } finally {
      setRegenerating(false);
    }
  };

  if (!loaded || !data) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)] flex items-center justify-center">
        <span className="material-symbols-outlined text-primary-container text-4xl animate-spin">progress_activity</span>
      </main>
    );
  }

  const checklist = data.execution_plan?.daily_checklist || [];

  return (
    <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)]">
      {/* Top Section */}
      <div className="mb-24 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border-l-2 border-primary-container">
          <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-primary">INITIALIZATION COMPLETE</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white max-w-4xl">
          Your idea: <span className="text-[#0033FF] drop-shadow-[0_0_10px_rgba(0,51,255,0.5)] italic">{data.idea_summary || idea}</span>
        </h1>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
        {/* Target Users */}
        <div className="md:col-span-4 bg-surface-container-low p-8 flex flex-col justify-between border-t border-white/5">
          <div>
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">01 / TARGET USERS</span>
            <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">{data.target_user?.join(", ") || 'Target users'}</h3>
          </div>
          <div className="mt-8 flex justify-end">
            <span className="material-symbols-outlined text-outline/30 text-4xl">groups</span>
          </div>
        </div>

        {/* Core Features */}
        <div className="md:col-span-4 bg-surface-container p-8 border-t border-white/5">
          <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">02 / CORE FEATURES</span>
          <ul className="space-y-6">
            {data.features?.map((feature, i) => (
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
            <p className="text-2xl font-black text-white leading-tight">This can be built in <span className="text-primary-container">{checklist.length > 0 ? checklist[checklist.length - 1].day : 14} days</span></p>
          </div>
        </div>

        {/* Problem */}
        {data.problem && data.problem.length > 0 && (
          <div className="md:col-span-6 bg-surface-container-low p-8 border-t border-white/5">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">PROBLEM</span>
            <ul className="space-y-4">
              {data.problem.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 mt-2 bg-error"></span>
                  <span className="text-on-surface-variant text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Solution & Unique Angle */}
        <div className="md:col-span-6 bg-surface-container p-8 border-t border-white/5">
          {data.solution && (
            <div className="mb-8">
              <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-4">SOLUTION</span>
              <p className="text-white font-medium leading-relaxed">{data.solution}</p>
            </div>
          )}
          {data.unique_angle && (
            <div>
              <span className="text-[0.6875rem] uppercase tracking-widest text-primary-container block mb-4">UNIQUE ANGLE</span>
              <p className="text-white font-medium leading-relaxed">{data.unique_angle}</p>
            </div>
          )}
        </div>

        {/* Market Insight */}
        {data.market_insight && data.market_insight.length > 0 && (
          <div className="md:col-span-4 bg-surface-container-low p-8 border-t border-white/5">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">MARKET INSIGHT</span>
            <ul className="space-y-4">
              {data.market_insight.map((item, i) => (
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
          <div className="md:col-span-4 bg-surface-container p-8 border-t border-white/5">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">MONETIZATION</span>
            <ul className="space-y-4">
              {data.monetization.map((item, i) => (
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
          <div className="md:col-span-4 bg-surface-container-low p-8 border-t border-white/5">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-6">TECH STACK</span>
            <ul className="space-y-4">
              {data.tech_stack.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-1.5 h-1.5 mt-2 bg-primary-container"></span>
                  <span className="text-on-surface-variant text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MVP Roadmap — execution_plan.daily_checklist */}
        <div className="md:col-span-12 bg-surface-container-lowest p-10 border-t border-white/5 mt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-2">EXECUTION PLAN</span>
              <h2 className="text-3xl font-black tracking-tighter text-white">{data.execution_plan?.goal || 'The 14-Day Sprint'}</h2>
            </div>
            <div className="h-px flex-grow mx-8 bg-outline-variant/20 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <span className="text-[0.6875rem] uppercase tracking-widest text-primary font-bold">ACCELERATED PATH</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-outline-variant/10">
            {checklist.map((item, i) => (
              <div key={item.day} className={`p-6 ${i < checklist.length - 1 ? 'border-b md:border-r' : ''} border-outline-variant/10 hover:bg-surface-container-high transition-colors`}>
                <h4 className="text-primary font-bold tracking-widest text-xs uppercase mb-2">Day {item.day}</h4>
                <p className="text-on-surface text-sm leading-relaxed">{item.task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risks */}
      {data.risks && data.risks.length > 0 && (
        <div className="mb-24">
          <h2 className="text-2xl font-black tracking-tighter text-white mb-8">Risks & Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.risks.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant/10 rounded">
                <span className="material-symbols-outlined text-error text-sm">warning</span>
                <span className="text-on-surface text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribution */}
      {data.distribution && data.distribution.length > 0 && (
        <div className="mb-24">
          <h2 className="text-2xl font-black tracking-tighter text-white mb-8">Distribution Channels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.distribution.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant/10 rounded">
                <span className="material-symbols-outlined text-primary-container text-sm">campaign</span>
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
