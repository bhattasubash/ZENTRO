import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#131313] w-full py-20 border-t border-[#444657]/20 overflow-hidden mt-auto">
      {/* Watermark Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <img alt="" className="w-160 h-160 object-contain scale-[1.3] opacity-[0.06] grayscale brightness-200 contrast-125" src="/symbol.png" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center px-8 max-w-[1440px] mx-auto gap-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <img alt="Zentro" className="h-35 w-auto object-contain brightness-0 invert opacity-80" src="/Transparent Logo of ZENTRO.png" />
          </Link>
          <span className="text-[#444657] text-sm hidden md:block">|</span>
          <span className="font-['Inter'] text-[0.6875rem] uppercase tracking-[0.05em] text-[#C4C5DA]">Execution, simplified.</span>
        </div>
        <div className="flex gap-8">
          <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-[0.05em] text-[#C4C5DA] hover:text-[#0033FF] transition-colors opacity-80 hover:opacity-100" href="/privacy">Privacy</Link>
          <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-[0.05em] text-[#C4C5DA] hover:text-[#0033FF] transition-colors opacity-80 hover:opacity-100" href="/terms">Terms</Link>
          <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-[0.05em] text-[#C4C5DA] hover:text-[#0033FF] transition-colors opacity-80 hover:opacity-100" href="/security">Security</Link>
          <Link className="font-['Inter'] text-[0.6875rem] uppercase tracking-[0.05em] text-[#C4C5DA] hover:text-[#0033FF] transition-colors opacity-80 hover:opacity-100" href="/status">Status</Link>
        </div>
        <div className="font-['Inter'] text-[0.6875rem] uppercase tracking-[0.05em] text-[#C4C5DA] opacity-60">
          © 2026 Zentro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
