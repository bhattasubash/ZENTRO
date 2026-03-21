import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="relative px-8 pt-24 pb-32 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block label-sm uppercase tracking-[0.05em] text-primary-container font-semibold mb-6">
              Most people don’t fail at building. They fail at starting.
            </span>
            <h1 className="text-[3.5rem] font-extrabold tracking-tighter leading-[1.1] text-white mb-6">
              Go from idea to a real product in 14 days
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed">
              Zentro gives you a clear step-by-step path to validate, build, and launch — without overthinking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/input">
                <Button variant="primary">Start building →</Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="secondary">See how it works</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            {/* Product UI Preview */}
            <div className="bg-surface-container rounded-xl p-1 border border-outline-variant/20 shadow-2xl">
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden aspect-[4/3] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent"></div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-4 w-32 bg-surface-container-high rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-error"></div>
                      <div className="h-2 w-2 rounded-full bg-primary-container"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* 14 Day Timeline Simulation */}
                    <div className="flex items-center gap-4 p-4 bg-surface-container-high/50 rounded-lg">
                      <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-white font-bold text-xs">D-01</div>
                      <div className="flex-1">
                        <div className="h-3 w-1/3 bg-white rounded mb-2"></div>
                        <div className="h-2 w-2/3 bg-on-surface-variant/30 rounded"></div>
                      </div>
                      <span className="material-symbols-outlined text-primary-container">check_circle</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-surface-container-high rounded-lg border-l-4 border-primary-container">
                      <div className="w-10 h-10 rounded bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold text-xs">D-07</div>
                      <div className="flex-1">
                        <div className="h-3 w-1/2 bg-white rounded mb-2"></div>
                        <div className="h-2 w-1/2 bg-on-surface-variant/30 rounded"></div>
                      </div>
                      <span className="material-symbols-outlined text-primary-container">pending</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-surface-container-high/20 rounded-lg">
                      <div className="w-10 h-10 rounded bg-surface-container-highest/30 flex items-center justify-center text-on-surface-variant/30 font-bold text-xs">D-14</div>
                      <div className="flex-1">
                        <div className="h-3 w-1/4 bg-white/20 rounded mb-2"></div>
                        <div className="h-2 w-1/3 bg-on-surface-variant/10 rounded"></div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant/20">rocket_launch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-surface-container-low py-32 px-8">
        <div className="max-w-[1440px] mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tighter text-white mb-6">
            You’re not stuck because you can’t build.
          </h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">
            You’re stuck because you don’t know what to build next.
          </p>
        </div>
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container p-8 rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
            <span className="material-symbols-outlined text-primary-container mb-6 text-3xl">psychology</span>
            <h3 className="text-white font-bold text-lg mb-2">Too many ideas</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Paralyzed by possibilities, never making a choice that sticks.</p>
          </div>
          <div className="bg-surface-container p-8 rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
            <span className="material-symbols-outlined text-primary-container mb-6 text-3xl">explore</span>
            <h3 className="text-white font-bold text-lg mb-2">No clear direction</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Working hard but feeling like you're spinning in circles.</p>
          </div>
          <div className="bg-surface-container p-8 rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
            <span className="material-symbols-outlined text-primary-container mb-6 text-3xl">construction</span>
            <h3 className="text-white font-bold text-lg mb-2">Building the wrong things</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Investing months into features that nobody actually wants.</p>
          </div>
          <div className="bg-surface-container p-8 rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
            <span className="material-symbols-outlined text-primary-container mb-6 text-3xl">timer_off</span>
            <h3 className="text-white font-bold text-lg mb-2">Never launching</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Polishing details while the real opportunity passes you by.</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-8 max-w-[1440px] mx-auto">
        <h2 className="text-4xl font-bold tracking-tighter text-white mb-20">How Zentro helps you move forward</h2>
        <div className="space-y-12">
          {/* Loop over process items or duplicate similar structure */}
          <div className="group grid md:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="text-[5rem] font-black text-surface-container-high group-hover:text-primary-container transition-colors duration-500">01</div>
            <div className="border-l-2 border-outline-variant/30 pl-12 py-4">
              <h3 className="text-2xl font-bold text-white mb-2">Clarify your idea</h3>
              <p className="text-on-surface-variant mb-4">Strip away the noise and find the core value proposition of your project.</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Focus Map</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Core Logic</span>
              </div>
            </div>
          </div>
          <div className="group grid md:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="text-[5rem] font-black text-surface-container-high group-hover:text-primary-container transition-colors duration-500">02</div>
            <div className="border-l-2 border-outline-variant/30 pl-12 py-4">
              <h3 className="text-2xl font-bold text-white mb-2">Validate with real users</h3>
              <p className="text-on-surface-variant mb-4">Get honest feedback before you write a single line of production code.</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Interview Flow</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Demand Test</span>
              </div>
            </div>
          </div>
          <div className="group grid md:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="text-[5rem] font-black text-surface-container-high group-hover:text-primary-container transition-colors duration-500">03</div>
            <div className="border-l-2 border-outline-variant/30 pl-12 py-4">
              <h3 className="text-2xl font-bold text-white mb-2">Build only what matters</h3>
              <p className="text-on-surface-variant mb-4">Define your MVP by aggressive prioritization. No bloated features.</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Sprint Kit</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Spec Doc</span>
              </div>
            </div>
          </div>
          <div className="group grid md:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="text-[5rem] font-black text-surface-container-high group-hover:text-primary-container transition-colors duration-500">04</div>
            <div className="border-l-2 border-outline-variant/30 pl-12 py-4">
              <h3 className="text-2xl font-bold text-white mb-2">Launch and get feedback</h3>
              <p className="text-on-surface-variant mb-4">Go live in 14 days and start the real learning process with live traffic.</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Release Checklist</span>
                <span className="px-2 py-1 bg-surface-container-high rounded text-[0.6rem] uppercase tracking-wider text-on-surface-variant">Growth Loop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="how-it-works" className="bg-surface py-32 px-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter text-white mb-4">See how it works</h2>
            <p className="text-on-surface-variant">Real plans for real ideas. No fluff.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden shadow-2xl">
            <div className="bg-surface-container-high px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">terminal</span>
                <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">Zentro Engine v1.0</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></div>
              </div>
            </div>
            <div className="p-10 space-y-8 font-mono">
              <div className="flex gap-4">
                <span className="text-primary-container shrink-0">→</span>
                <div>
                  <span className="text-on-surface-variant">Your idea:</span>
                  <span className="text-white ml-2">fitness app for busy people</span>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-primary-container shrink-0">→</span>
                <div>
                  <span className="text-on-surface-variant">Who it’s for:</span>
                  <span className="text-white ml-2">Busy professionals with &lt; 20m/day</span>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-primary-container shrink-0">→</span>
                <div>
                  <span className="text-on-surface-variant">What to build first:</span>
                  <span className="text-white ml-2">Simple workout generator, Progress tracking</span>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant/10">
                <div className="text-primary-container mb-4 font-bold tracking-tighter uppercase text-sm">Your plan: 14-day launch steps</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface-container p-4 rounded text-center">
                    <div className="text-[0.6rem] text-on-surface-variant mb-1">DAYS 1-3</div>
                    <div className="text-[0.7rem] text-white">Validation</div>
                  </div>
                  <div className="bg-surface-container p-4 rounded text-center">
                    <div className="text-[0.6rem] text-on-surface-variant mb-1">DAYS 4-7</div>
                    <div className="text-[0.7rem] text-white">MVP Build</div>
                  </div>
                  <div className="bg-surface-container p-4 rounded text-center">
                    <div className="text-[0.6rem] text-on-surface-variant mb-1">DAYS 8-11</div>
                    <div className="text-[0.7rem] text-white">Beta Test</div>
                  </div>
                  <div className="bg-surface-container p-4 rounded text-center border border-primary-container/30">
                    <div className="text-[0.6rem] text-primary-container mb-1">DAYS 12-14</div>
                    <div className="text-[0.7rem] text-white font-bold">LAUNCH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-on-surface-variant mb-6 uppercase tracking-widest">No coding. No guessing.</p>
            <Link href="/input">
              <Button variant="primary" className="px-10 py-5 text-lg">Build my plan →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-8 max-w-[1440px] mx-auto border-t border-outline-variant/10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter text-white mb-6">Built for people starting from zero</h2>
            <p className="text-lg text-on-surface-variant mb-8">We don't expect you to have a team or a venture capital fund. We just expect you to show up.</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-container/10 p-2 rounded">
                <span className="material-symbols-outlined text-primary-container">school</span>
              </div>
              <div>
                <h4 className="text-white font-bold">No experience required</h4>
                <p className="text-on-surface-variant text-sm">We provide the frameworks and tools you need to succeed from day one.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary-container/10 p-2 rounded">
                <span className="material-symbols-outlined text-primary-container">bolt</span>
              </div>
              <div>
                <h4 className="text-white font-bold">Focus on action, not theory</h4>
                <p className="text-on-surface-variant text-sm">Less reading, more doing. Every module ends with a tangible output.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary-container/10 p-2 rounded">
                <span className="material-symbols-outlined text-primary-container">task_alt</span>
              </div>
              <div>
                <h4 className="text-white font-bold">Helps you finish what you start</h4>
                <p className="text-on-surface-variant text-sm">Our 14-day cadence is designed to keep momentum high and distractions low.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-32 px-8 bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-center text-3xl font-bold tracking-tighter text-white mb-20">Why Zentro is different</h2>
          <div className="grid md:grid-cols-2 gap-px bg-outline-variant/20 rounded-xl overflow-hidden">
            <div className="bg-surface p-12">
              <div className="text-on-surface-variant font-bold uppercase tracking-[0.1em] text-xs mb-8">Other tools</div>
              <ul className="space-y-6">
                <li className="flex gap-4 items-center text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-error/50">close</span>
                  Overwhelming documentation
                </li>
                <li className="flex gap-4 items-center text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-error/50">close</span>
                  Generic "one size fits all" advice
                </li>
                <li className="flex gap-4 items-center text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-error/50">close</span>
                  No clear end date or milestone
                </li>
                <li className="flex gap-4 items-center text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-error/50">close</span>
                  Passive video watching
                </li>
              </ul>
            </div>
            <div className="bg-surface-container p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-primary-container text-white text-[0.6rem] font-bold px-2 py-1 rounded uppercase tracking-tighter">Recommended</div>
              </div>
              <div className="text-primary-container font-bold uppercase tracking-[0.1em] text-xs mb-8">Zentro</div>
              <ul className="space-y-6">
                <li className="flex gap-4 items-center text-white font-medium">
                  <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                  Action-oriented workflow
                </li>
                <li className="flex gap-4 items-center text-white font-medium">
                  <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                  Custom plan for your specific idea
                </li>
                <li className="flex gap-4 items-center text-white font-medium">
                  <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                  Strict 14-day launch guarantee
                </li>
                <li className="flex gap-4 items-center text-white font-medium">
                  <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                  Hands-on execution framework
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Break Section */}
      <section className="bg-[#0e0e0e] py-40 px-8 text-center">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-[3.5rem] font-black tracking-tighter text-white leading-tight mb-8">
            You don’t need more ideas. <br className="hidden md:block"/>
            <span className="text-primary-container">You need direction.</span>
          </h2>
          <div className="w-24 h-1 bg-primary-container mx-auto"></div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 max-w-[1440px] mx-auto text-center">
        <h2 className="text-5xl font-extrabold tracking-tighter text-white mb-10">Stop thinking. Start building.</h2>
        <Link href="/input">
          <Button variant="primary" className="px-12 py-6 text-xl">
            Start building →
          </Button>
        </Link>
        <p className="mt-8 text-on-surface-variant/60 text-sm">Join 2,400+ builders executing their ideas today.</p>
      </section>
    </main>
  );
}
