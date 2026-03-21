export default function Status() {
  return (
    <main className="pt-32 pb-24 px-8 max-w-3xl mx-auto min-h-[calc(100vh-144px)]">
      <span className="text-[0.6875rem] uppercase tracking-widest text-primary-container font-bold block mb-4">Operations</span>
      <h1 className="text-5xl font-black tracking-tighter text-white mb-8">System Status</h1>
      <div className="flex items-center gap-3 mb-8">
        <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
        <span className="text-white font-bold">All systems operational</span>
      </div>
      <p className="text-on-surface-variant leading-relaxed">This page is under construction. Detailed system status will be available here soon.</p>
    </main>
  );
}
