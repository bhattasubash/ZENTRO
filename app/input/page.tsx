"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/hooks/useRoadmap';

export default function InputInterface() {
  const [idea, setIdea] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { generate, loading, error } = useRoadmap();
  const router = useRouter();

  const handleGenerate = async () => {
    const fullIdea = activeTag ? `[${activeTag}] ${idea}` : idea;
    const projectId = await generate(fullIdea);
    if (projectId) {
      router.push(`/plan?projectId=${projectId}`);
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
          <span className="text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-primary-container mb-4 block">Initialization Phase</span>
          <h1 className="text-5xl font-black tracking-tighter text-on-surface leading-none">Describe your idea</h1>
        </header>

        {/* Terminal Input Interface */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-container to-on-primary-fixed-variant opacity-10 group-focus-within:opacity-25 transition-opacity duration-500 rounded-lg blur"></div>
          <div className="relative bg-surface-container-lowest border-l-2 border-primary-container p-8 min-h-[400px] flex flex-col shadow-2xl">
            {/* Terminal Header Decor */}
            <div className="flex items-center gap-2 mb-6 opacity-30">
              <div className="w-2 h-2 rounded-full bg-on-surface"></div>
              <div className="w-2 h-2 rounded-full bg-on-surface"></div>
              <div className="w-2 h-2 rounded-full bg-on-surface"></div>
              <span className="ml-4 text-[10px] uppercase tracking-widest font-mono text-on-surface-variant">zentro-core-v1.0.4 // input_stream</span>
            </div>
            
            <textarea 
              className="w-full h-full flex-grow bg-transparent border-none outline-none focus:ring-0 text-xl md:text-2xl font-mono text-on-surface placeholder:text-surface-container-high resize-none terminal-scroll leading-relaxed" 
              placeholder="I want to build a fitness app for busy professionals"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            ></textarea>
            
            {/* Error message */}
            {error && (
              <div className="text-error text-xs font-mono mt-2 opacity-80">{error}</div>
            )}

            <div className="mt-8 pt-8 border-t border-surface-container flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-3">
                {['SaaS tool', 'Mobile app', 'AI tool', 'Marketplace'].map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => handleTagClick(tag)}
                    className={`px-4 py-1.5 rounded-sm text-[0.6875rem] uppercase tracking-widest font-bold transition-all border active:scale-95 ${
                      activeTag === tag 
                        ? 'bg-primary-container text-white border-primary-container' 
                        : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-white border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="bg-primary-container text-white px-8 py-4 rounded-lg font-bold text-sm tracking-tight flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,51,255,0.4)] hover:-translate-y-0.5 active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate roadmap'}
                <span className={`material-symbols-outlined text-lg transition-transform group-hover:translate-x-1 ${loading ? 'animate-spin' : ''}`}>
                  {loading ? 'progress_activity' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Context Info */}
        <div className="mt-12 flex items-center gap-8 text-on-surface-variant/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="text-[0.6875rem] uppercase tracking-widest font-bold">Encrypted processing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span className="text-[0.6875rem] uppercase tracking-widest font-bold">Real-time analysis</span>
          </div>
        </div>
      </section>

      {/* Side Panel (Right) */}
      <aside className="md:col-span-4 mt-24 md:mt-0">
        <div className="bg-surface-container-low p-10 h-full flex flex-col gap-12 border-l border-surface-container-high/30">
          <div>
            <h2 className="text-[0.6875rem] font-black uppercase tracking-[0.25em] text-on-surface mb-10">How it works</h2>
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-surface-container-highest border border-outline-variant/20 group-hover:border-primary-container transition-colors duration-500">
                  <span className="text-xs font-mono font-bold text-primary-container">01</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-2">We analyze your idea</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                    Our semantic engine breaks down your description into core functional modules and market categories.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-surface-container-highest border border-outline-variant/20 group-hover:border-primary-container transition-colors duration-500">
                  <span className="text-xs font-mono font-bold text-primary-container">02</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-2">Identify target users</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                    Mapping demographic data against competitive landscapes to define your ideal user personas.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-surface-container-highest border border-outline-variant/20 group-hover:border-primary-container transition-colors duration-500">
                  <span className="text-xs font-mono font-bold text-primary-container">03</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-2">Create MVP plan</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-light">
                    Generating a technical roadmap with prioritized features, tech stack, and milestone projections.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Visual */}
          <div className="mt-auto pt-10">
            <div className="bg-surface-container-lowest p-6 rounded border border-outline-variant/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant">System Status</span>
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              </div>
              <div className="space-y-1">
                <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container w-[88%]"></div>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant/50">NODE_CAPACITY: 88.2%</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
