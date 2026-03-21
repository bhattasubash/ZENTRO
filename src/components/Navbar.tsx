import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <img alt="Zentro Logo" className="h-55 w-auto py-10 object-contain brightness-0 invert opacity-90 drop-shadow-sm" src="/Transparent Logo of ZENTRO.png" />
          </Link>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <Link className="font-['Inter'] tracking-tighter font-medium text-sm text-[#C4C5DA] hover:text-white transition-colors duration-300" href="/pricing">Pricing</Link>
          <Link className="font-['Inter'] tracking-tighter font-medium text-sm text-[#C4C5DA] hover:text-white transition-colors duration-300" href="/dashboard">Dashboard</Link>
        </div>
        <Link href="/input" className="bg-primary-container text-white px-5 py-2 text-sm font-semibold rounded-lg active:scale-95 transition-transform hover:shadow-[0_0_15px_rgba(0,51,255,0.3)]">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
