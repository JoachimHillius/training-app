import Image from 'next/image'
import Link from 'next/link'
import LandingNav from '@/components/landing-nav'
import ScrollReveal from '@/components/scroll-reveal'

const stats = [
  { value: '12+', label: 'Years coaching' },
  { value: '8k', label: 'Clients trained' },
  { value: '94%', label: 'Goal achievement' },
]

export default function LandingPage() {
  return (
    <div className="bg-dark-bg text-white">

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/Bareback_Rodeo_Webinar_with_ProGrip_JP.png"
            alt="ProGrip JP training"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/80 via-dark-bg/75 to-dark-bg" />
        </div>

        <LandingNav />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
          <span
            className="animate-fade-up text-sm font-semibold uppercase tracking-[0.2em] text-accent"
            style={{ animationDelay: '0ms' }}
          >
            ProGrip JP
          </span>
          <h1
            className="animate-fade-up mt-4 font-display uppercase tracking-tight text-4xl leading-none sm:text-7xl lg:text-8xl"
            style={{ animationDelay: '120ms' }}
          >
            Train. Sweat. Grip.
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-white/70"
            style={{ animationDelay: '240ms' }}
          >
            Pick your plan. Own your edge.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: '360ms' }}
          >
            <Link
              href="/auth/sign-up"
              className="rounded-full bg-accent px-8 py-3 font-bold text-dark-bg transition-colors hover:bg-accent/90"
            >
              Start Training
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-full border border-white/30 px-8 py-3 font-medium transition-colors hover:bg-white/10"
            >
              Meet the Coach
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-fade-up"
          style={{ animationDelay: '600ms' }}
        >
          <div className="flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
            <div className="h-8 w-px bg-white/20" />
          </div>
        </div>
      </section>

      {/* ─── Coach ───────────────────────────────────────────────── */}
      <section id="coach" className="px-6 py-28 sm:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">

          <ScrollReveal>
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-2xl lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80"
                alt="Coach Pascal Isabelle"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/50 to-transparent" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">The Coach</span>
              <h2 className="mt-3 font-display uppercase tracking-tight text-5xl leading-none sm:text-6xl">Pascal Isabelle</h2>
              <p className="mt-2 font-medium text-white/50">
                Head Coach · NSCA-CSCS · 12+ years training pros
              </p>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                Pascal has spent over a decade building elite athletes from the ground up.
                His methodology focuses on sustainable performance — not flash, but
                fundamentals that compound over time. Every program in ProGrip JP is
                built on that foundation.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-bold text-accent">{stat.value}</div>
                    <div className="mt-1 text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/sign-up"
                className="mt-10 inline-block rounded-full bg-accent px-8 py-3 font-bold text-dark-bg transition-colors hover:bg-accent/90"
              >
                Book 1-on-1 Session
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section id="cta" className="relative overflow-hidden px-6 py-32 text-center sm:px-12">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
        <ScrollReveal className="relative z-10">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Get Started
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl font-display uppercase tracking-tight text-5xl leading-none sm:text-6xl">
            Start your Journey — Get to the Top
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/60">
            No guesswork. No wasted sessions. Just a program built to move you
            forward — starting today.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-10 inline-block rounded-full bg-accent px-10 py-4 font-bold text-dark-bg transition-colors hover:bg-accent/90"
          >
            Ready to Train Like a PRO
          </Link>
        </ScrollReveal>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-12 sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="ProGrip JP"
              width={100}
              height={34}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
            <a href="#coach" className="transition-colors hover:text-white">Coach</a>
            <Link href="/auth/log-in" className="transition-colors hover:text-white">Log in</Link>
            <Link href="/auth/sign-up" className="transition-colors hover:text-white">Sign up</Link>
          </nav>
          <p className="text-sm text-white/30">
            © 2026 ProGrip JP. Built for those who show up.
          </p>
        </div>
      </footer>

    </div>
  )
}
