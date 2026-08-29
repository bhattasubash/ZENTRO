import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface SharedPlanProps {
  params: Promise<{ token: string }>;
}

export default async function SharedPlan({ params }: SharedPlanProps) {
  const { token } = await params;

  const supabase = await createClient();
  const { data: roadmap, error } = await supabase
    .from('roadmaps')
    .select('idea, data, created_at')
    .eq('share_token', token)
    .eq('is_shared', true)
    .single();

  if (error || !roadmap) {
    notFound();
  }

  const data = roadmap.data;
  const checklist = data.execution_plan?.daily_checklist || [];

  return (
    <main className="max-w-7xl mx-auto px-8 py-20 min-h-[calc(100vh-144px)]">
      {/* Top Banner */}
      <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-surface-container-low border border-outline-variant/20 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary-container text-2xl">public</span>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-white">Shared Roadmap</p>
            <p className="text-xs text-on-surface-variant">View-only mode • Created with Zentro</p>
          </div>
        </div>
        <Link
          href="/input"
          className="bg-primary-container text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,51,255,0.4)] transition-all flex items-center gap-2 self-start md:self-auto"
        >
          Create Your Own Plan <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {/* Idea Title */}
      <div className="mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border-l-2 border-primary-container">
          <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-primary">
            EXECUTION BLUEPRINT
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white max-w-4xl">
          <span className="text-[#0033FF] drop-shadow-[0_0_10px_rgba(0,51,255,0.5)] italic">
            {data.idea_summary || roadmap.idea}
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
          <ul className="space-y-4">
            {data.features?.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 mt-2 bg-primary-container"></span>
                <span className="text-base font-bold text-white block">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Highlight */}
        <div className="md:col-span-4 bg-primary-container/5 border border-primary-container/30 p-8 flex items-center justify-center text-center relative overflow-hidden rounded-lg">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-primary-container text-5xl mb-4">bolt</span>
            <p className="text-2xl font-black text-white leading-tight">
              14-Day Sprint Cadence
            </p>
          </div>
        </div>

        {/* Solution */}
        {data.solution && (
          <div className="md:col-span-12 bg-surface-container-low p-8 border-t border-white/5 rounded-lg">
            <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-4">
              PROPOSED SOLUTION
            </span>
            <p className="text-white text-lg font-medium leading-relaxed">{data.solution}</p>
          </div>
        )}

        {/* Daily Checklist Schedule */}
        <div className="md:col-span-12 bg-surface-container-lowest p-10 border-t border-white/5 mt-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <span className="text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block mb-2">
                DAILY MILESTONES
              </span>
              <h2 className="text-3xl font-black tracking-tighter text-white">
                {data.execution_plan?.goal || 'The 14-Day Sprint'}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-outline-variant/10">
            {checklist.map((item: any, i: number) => (
              <div
                key={item.day}
                className={`p-6 ${
                  i < checklist.length - 1 ? 'border-b md:border-r' : ''
                } border-outline-variant/10 hover:bg-surface-container-high transition-colors`}
              >
                <h4 className="text-primary font-bold tracking-widest text-xs uppercase mb-2">
                  Day {item.day}
                </h4>
                <p className="text-on-surface text-sm leading-relaxed">{item.task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-16 border-t border-outline-variant/10">
        <h2 className="text-3xl font-black tracking-tighter text-white mb-4">
          Ready to build your next big idea?
        </h2>
        <p className="text-on-surface-variant mb-8 text-sm">
          Get your customized 14-day execution roadmap in seconds.
        </p>
        <Link
          href="/input"
          className="bg-primary-container text-white px-8 py-4 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(0,51,255,0.4)] transition-all inline-flex items-center gap-2"
        >
          Start Building Now <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </main>
  );
}
