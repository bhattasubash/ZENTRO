"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateRoadmap } from '@/lib/api';

export default function InputInterface() {
  const [idea, setIdea] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    const fullIdea = activeTag ? `[${activeTag}] ${idea}` : idea;
    if (!fullIdea.trim()) {
      setError("Please describe your idea first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateRoadmap(fullIdea);
      router.push(`/plan?projectId=${result.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  return (
    <main className="min-h-[calc(100vh-144px)] pt-32 pb-20 px-12 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
      {/* Decorative Electric Blue Accents */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/5 blur-[150px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary-container/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      {/* Main Content Area (Left) */}
      <section className="md:col-span-8 flex flex-col">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border-l-2 border-primary-container mb-6">
            <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-primary">INITIALIZE SEQUENCE</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white uppercase leading-none">
            What are we <span className="text-primary-container drop-shadow-[0_0_15px_rgba(0,51,255,0.4)]">building?</span>
          </h1>
          <p className="mt-4 text-on-surface-variant text-lg font-light max-w-xl">
            Type anything. Zentro turns messy thoughts into an actionable 14-day execution blueprint.
          </p>
        </header>

        {/* Input Interface */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="relative group mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-container to-surface-bright rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 shadow-2xl">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-on-surface-variant/40 font-mono text-lg md:text-xl resize-none outline-none leading-relaxed"
                placeholder="Example: An AI platform that analyzes local zoning laws to help small developers find compliant multi-family lots..."
              />
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/10 mt-4">
                <div className="flex items-center gap-2 text-xs font-mono text-outline">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                  <span>SYSTEM_READY</span>
                </div>
                <span className="text-xs font-mono text-outline-variant">{idea.length} chars</span>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-6 mb-12">
            <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-on-surface-variant block">SELECT SECTOR TAG</span>
            <div className="flex flex-wrap gap-3">
              {['Fintech MVP', 'B2B SaaS', 'Consumer AI', 'Developer Tool', 'Hardware + App', 'Local Marketplace'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border ${
                    activeTag === tag
                      ? 'bg-primary-container text-white border-primary-container shadow-[0_0_15px_rgba(0,51,255,0.4)]'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/20 hover:border-primary-container/50 hover:bg-surface-container-high'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error-container/40 rounded-lg text-error text-xs font-mono">
              {error}
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-primary-container hover:bg-on-primary-fixed-variant text-white font-black uppercase tracking-widest text-sm rounded-lg shadow-[0_0_25px_rgba(0,51,255,0.4)] hover:shadow-[0_0_35px_rgba(0,51,255,0.6)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  <span>Synthesizing Architecture...</span>
                </>
              ) : (
                <>
                  <span>Generate 14-Day Blueprint</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Right Column: Architectural Parameters Sidebar */}
      <aside className="md:col-span-4 flex flex-col justify-between border-l border-outline-variant/10 md:pl-12 pt-8 md:pt-0">
        <div className="space-y-12">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-white mb-6">Engine Specifications</h3>
            <div className="space-y-6">
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/10">
                <span className="text-[0.6875rem] uppercase tracking-wider text-outline block mb-1">Time Horizon</span>
                <span className="text-sm font-bold text-white uppercase">14-Day Accelerated Sprint</span>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/10">
                <span className="text-[0.6875rem] uppercase tracking-wider text-outline block mb-1">Architecture Standard</span>
                <span className="text-sm font-bold text-white uppercase">Electric Monolith System</span>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/10">
                <span className="text-[0.6875rem] uppercase tracking-wider text-outline block mb-1">Output Structure</span>
                <span className="text-sm font-bold text-white uppercase">Target, Tech, Risks &amp; Schedule</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
