import Link from 'next/link';

export default function Settings() {
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex">
      {/* SideNavBar Shell */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1C1B1B] hidden md:flex flex-col z-50">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Zentro</h1>
          <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mt-1">Premium Account</p>
        </div>
        
        <nav className="flex-1 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150">
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-6 py-4 text-white border-l-2 border-[#0033FF] bg-[#393939] active:scale-[0.98] duration-150">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Preferences</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150">
            <span className="material-symbols-outlined">shield</span>
            <span className="text-sm font-medium">Security</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-6 py-4 text-[#C4C5DA] hover:text-white transition-colors hover:bg-[#2A2A2A] active:scale-[0.98] duration-150">
            <span className="material-symbols-outlined">warning</span>
            <span className="text-sm font-medium">Danger Zone</span>
          </Link>
        </nav>
        
        <div className="p-6 mt-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20">
            {/* Using a placeholder div instead of external image to avoid loading issues, or import an avatar */}
            <div className="w-full h-full flex items-center justify-center text-xs bg-primary-container text-white font-bold">AR</div>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xs font-bold">Alex Rivera</span>
            <span className="text-[#C4C5DA] text-[10px] uppercase tracking-wider">Settings</span>
          </div>
        </div>
      </aside>

      {/* TopAppBar Shell */}
      <header className="fixed top-0 md:left-64 right-0 h-16 bg-[#131313]/80 backdrop-blur-xl flex items-center justify-between px-8 z-40">
        <div className="flex items-center gap-4">
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#C4C5DA]">System / Preferences</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="material-symbols-outlined text-[#C4C5DA] hover:text-white cursor-pointer transition-colors">notifications</span>
          </div>
          <span className="material-symbols-outlined text-[#C4C5DA] hover:text-white cursor-pointer transition-colors">help</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="md:ml-64 pt-32 pb-24 px-12 max-w-5xl w-full">
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Account Settings</h2>
          <p className="text-on-surface-variant max-w-md">Manage your digital presence and system-wide preferences for the Zentro platform.</p>
        </div>

        <div className="space-y-24">
          {/* Profile Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12" id="profile">
            <div className="md:col-span-1">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mb-2">01 / Profile</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Your identity within the Zentro ecosystem. This information is visible to other team members.</p>
            </div>
            
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant block">Full Name</label>
                <input 
                  className="w-full bg-surface-container-lowest border-none outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary px-0 py-3 text-on-surface placeholder-outline transition-all duration-300" 
                  type="text" 
                  defaultValue="Alex Rivera"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant block">Email Address</label>
                <input 
                  className="w-full bg-surface-container-lowest border-none outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary px-0 py-3 text-on-surface placeholder-outline transition-all duration-300" 
                  type="email" 
                  defaultValue="alex@example.com"
                />
              </div>
              <button className="bg-primary-container text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-lg hover:shadow-[0_0_15px_rgba(0,51,255,0.3)] transition-all active:scale-[0.98]">
                Update Profile
              </button>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12" id="preferences">
            <div className="md:col-span-1">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mb-2">02 / Preferences</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Tailor the interface behavior and alert frequencies to your workflow.</p>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">dark_mode</span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-tight">Dark Mode</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Optimized for low-light high-performance focus</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-primary-container rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-tight">System Notifications</h4>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Desktop alerts for critical system updates</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-surface-container-highest rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-on-surface-variant rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-outline-variant/10" id="danger">
            <div className="md:col-span-1">
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-error mb-2">03 / Danger Zone</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">Irreversible actions that affect your account data integrity and access.</p>
            </div>
            
            <div className="md:col-span-2">
              <div className="p-8 bg-error-container/10 border border-error-container/20 rounded-lg flex flex-col items-start gap-6">
                <div>
                  <h4 className="text-sm font-bold text-error uppercase tracking-tight mb-2">Delete Account</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm">This will permanently delete all associated project data, API keys, and configurations. This action is non-reversible.</p>
                </div>
                <button className="bg-transparent border border-error text-error px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-error hover:text-on-error transition-all duration-300">
                  Terminate Zentro ID
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Contextual Information (Glassmorphism Sidebar Detail) */}
      <div className="fixed top-32 right-12 w-64 hidden xl:block z-40">
        <div className="bg-surface-container-high/40 backdrop-blur-2xl p-6 rounded-lg border border-outline-variant/10">
          <h5 className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#0033FF] mb-4">Security Overview</h5>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              <span className="text-[10px] uppercase font-bold text-on-surface">2FA Enabled</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              <span className="text-[10px] uppercase font-bold text-on-surface">Last Login: 2m ago</span>
            </div>
            <div className="pt-4 border-t border-outline-variant/10">
              <p className="text-[10px] text-on-surface-variant uppercase leading-4">Session: 49.12.94.102<br />Zurich, Switzerland</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
