import Image from 'next/image'
import Link from 'next/link'
import LandingNav from '@/components/landing-nav'
import ScrollReveal from '@/components/scroll-reveal'

const programs = [
  {
    id: '10-week',
    label: '10 Week',
    title: 'Foundation',
    description: 'Build the habits and movement patterns that will carry you through any program.',
    features: [
      'Structured 10-week plan',
      'Strength, cardio & mobility',
      'Video exercise guidance',
      'Progress tracking',
    ],
    cta: 'Start Foundation',
    featured: false,
  },
  {
    id: '3-month',
    label: '3 Month',
    title: 'Progressive',
    description: 'Periodized training designed to push you further with every passing week.',
    features: [
      '12 weeks of periodized training',
      'Weekly intensity adjustments',
      'Full video library access',
      'Priority coach support',
    ],
    cta: 'Start Progressive',
    featured: true,
  },
  {
    id: '6-month',
    label: '6 Month',
    title: 'Transformation',
    description: 'Six months of coaching to fundamentally change how you train and recover.',
    features: [
      '24 weeks of programming',
      'Monthly 1-on-1 video calls',
      'Custom plan modifications',
      'Community access',
    ],
    cta: 'Start Transformation',
    featured: false,
  },
]

const workouts = [
  {
    category: 'Strength',
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    description: 'Progressive overload, compound lifts, real results.',
  },
  {
    category: 'Cardio',
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    description: 'Intervals, endurance, and metabolic conditioning.',
  },
  {
    category: 'Mobility',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    description: 'Move better, recover faster, stay in the game longer.',
  },
]

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
            className="animate-fade-up mt-4 font-display uppercase tracking-tight text-5xl leading-none sm:text-7xl lg:text-8xl"
            style={{ animationDelay: '120ms' }}
          >
            Train. Sweat. Grip.
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-white/70"
            style={{ animationDelay: '240ms' }}
          >
            World-class programming, total body control. Choose a plan,
            dial the intensity, and go.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: '360ms' }}
          >
            <a
              href="#programs"
              className="rounded-full bg-accent px-8 py-3 font-bold text-dark-bg transition-colors hover:bg-accent/90"
            >
              View Programs
            </a>
            <a
              href="#coach"
              className="rounded-full border border-white/30 px-8 py-3 font-medium transition-colors hover:bg-white/10"
            >
              Meet the Coach
            </a>
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

      {/* ─── Programs ────────────────────────────────────────────── */}
      <section id="programs" className="px-6 py-28 sm:px-12 lg:px-20">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Programs</span>
          <h2 className="mt-3 font-display uppercase tracking-tight text-5xl leading-none sm:text-6xl">Choose your plan</h2>
          <p className="mt-4 text-lg text-white/60">
            Dial the intensity. Show up. The rest follows.
          </p>
        </ScrollReveal>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {programs.map((program, i) => (
            <ScrollReveal key={program.id} delay={i * 120}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-transform duration-300 hover:-translate-y-1 ${
                  program.featured
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                {program.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-dark-bg">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                    {program.label}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold">{program.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{program.description}</p>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="mt-0.5 shrink-0 text-accent">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/sign-up"
                  className={`block rounded-full py-3 text-center text-sm font-bold transition-colors ${
                    program.featured
                      ? 'bg-accent text-dark-bg hover:bg-accent/90'
                      : 'border border-white/20 hover:bg-white/10'
                  }`}
                >
                  {program.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── Workouts ────────────────────────────────────────────── */}
      <section id="workouts" className="px-6 py-28 sm:px-12 lg:px-20">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Workouts</span>
          <h2 className="mt-3 font-display uppercase tracking-tight text-5xl leading-none sm:text-6xl">Every session counts</h2>
          <p className="mt-4 text-lg text-white/60">
            Updated weekly. Built to adapt to your level.
          </p>
        </ScrollReveal>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {workouts.map((workout, i) => (
            <ScrollReveal key={workout.category} delay={i * 120}>
              <div className="group relative overflow-hidden rounded-2xl aspect-[4/5]">
                <Image
                  src={workout.image}
                  alt={workout.category}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="text-2xl font-bold">{workout.category}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{workout.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
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
          <h2 className="mx-auto mt-4 max-w-2xl font-display uppercase tracking-tight text-5xl leading-none sm:text-6xl">
            First week on us.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/60">
            No guesswork. No wasted sessions. Just a program built to move you
            forward — starting today.
          </p>
          <Link
            href="/auth/sign-up"
            className="mt-10 inline-block rounded-full bg-accent px-10 py-4 font-bold text-dark-bg transition-colors hover:bg-accent/90"
          >
            Start for Free
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
            <a href="#programs" className="transition-colors hover:text-white">Programs</a>
            <a href="#workouts" className="transition-colors hover:text-white">Workouts</a>
            <a href="#coach" className="transition-colors hover:text-white">Coach</a>
            <Link href="/auth/log-in" className="transition-colors hover:text-white">Log in</Link>
          </nav>
          <p className="text-sm text-white/30">
            © 2026 ProGrip JP. Built for those who show up.
          </p>
        </div>
      </footer>

    </div>
  )
}
