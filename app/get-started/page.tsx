"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoadmap } from "@/hooks/useRoadmap";

export default function GetStarted() {
  const [idea, setIdea] = useState("");
  const { generate, loading, error } = useRoadmap();
  const router = useRouter();

  const handleGenerate = async () => {
    const projectId = await generate(idea);
    if (projectId) {
      router.push(`/plan?projectId=${projectId}`);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-144px)] flex flex-col items-center justify-center px-6">
      {/* Background Subtle Gradient Bloom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Center Focused Content Container */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center">
        {/* Technical Tag */}
        <span className="inline-block px-2 py-1 text-xs uppercase tracking-[0.05em] text-primary-fixed-dim font-bold mb-6">
          Engineered for Founders
        </span>

        {/* Hero Headline: Editorial Authority */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
          Start building your<br />first product
        </h1>

        {/* Subtext: Functional Workhorse */}
        <p className="text-lg md:text-xl text-on-surface-variant max-w-xl mb-12 font-medium">
          Enter your idea and get a clear step-by-step plan to launch.
        </p>

        {/* Input Section */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full relative group">
            <input 
              className="w-full h-20 bg-surface-container-lowest border-none text-xl md:text-2xl text-on-surface placeholder:text-outline/40 px-8 rounded-lg focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary-container transition-all hover:shadow-[0_0_10px_rgba(0,51,255,0.15)] focus:shadow-[0_0_10px_rgba(0,51,255,0.15)]" 
              placeholder="I want to build a..." 
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
            />
            {/* Floating Tech Icon */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-outline/30 hidden md:block">
              <span className="material-symbols-outlined text-3xl">terminal</span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-error text-xs font-mono opacity-80">{error}</div>
          )}

          {/* Primary CTA: The Blue Pulse */}
          <div className="w-full md:w-auto">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="group relative w-full md:w-auto flex items-center justify-center gap-3 bg-primary-container px-12 py-5 rounded-lg text-white font-bold text-lg transition-all hover:-translate-y-1 active:scale-95 duration-200 overflow-hidden hover:shadow-[0_0_15px_rgba(0,51,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {/* Gradient Soul Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-on-primary-fixed-variant opacity-50"></div>
              <span className="relative z-10">{loading ? 'Generating...' : 'Generate my plan'}</span>
              <span className={`relative z-10 material-symbols-outlined transition-transform group-hover:translate-x-1 ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'progress_activity' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>

        {/* Trust Line */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            <span className="text-[11px] uppercase tracking-[0.05em] font-medium text-on-surface-variant/60">No coding.</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-outline-variant/30"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            <span className="text-[11px] uppercase tracking-[0.05em] font-medium text-on-surface-variant/60">No guessing.</span>
          </div>
        </div>
      </div>

      {/* Decorative UI Element: The Asymmetric Accent */}
      <div className="fixed bottom-20 right-0 h-[400px] w-[1px] bg-gradient-to-t from-primary-container/40 to-transparent hidden lg:block"></div>
      <div className="fixed bottom-20 right-0 w-20 h-[1px] bg-gradient-to-l from-primary-container/40 to-transparent hidden lg:block"></div>
    </main>
  );
}
