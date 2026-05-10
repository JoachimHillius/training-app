import Image from 'next/image'
import Link from 'next/link'
import SiteNav from '@/components/site-nav'
import ScrollReveal from '@/components/scroll-reveal'

const stats = [
  { value: '12+', label: 'Years coaching' },
  { value: '8k', label: 'Clients trained' },
  { value: '94%', label: 'Hit their goals' },
]

const credentials = [
  'NSCA Certified Strength & Conditioning Specialist (CSCS)',
  'USA Rodeo Performance Trainer',
  '12+ years working with professional bareback riders',
  'Former competitive rodeo athlete',
]

export default function CoachPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <SiteNav />

      {/* Hero strip */}
      <div className="px-6 pt-16 text-center sm:px-12">
        <ScrollReveal>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            The Coach
          </span>
          <h1 className="mt-3 font-display text-6xl uppercase tracking-tight sm:text-7xl">
            Pascal Isabelle
          </h1>
          <p className="mx-auto mt-4 text-base text-white/50">
            Head Coach · NSCA-CSCS · 12+ years training pros
          </p>
        </ScrollReveal>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-12 lg:px-20">
        <div className="grid items-start gap-16 lg:grid-cols-2">

          {/* Photo */}
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] w-full max-w-md mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80"
                alt="Coach Pascal Isabelle"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/50 to-transparent" />
            </div>
          </ScrollReveal>

          {/* Bio + stats */}
          <ScrollReveal delay={150}>
            <div className="space-y-8">

              <div>
                <h2 className="font-display text-4xl uppercase tracking-tight text-accent">
                  Built From the Arena Up
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-white/70">
                  Pascal Isabelle didn&apos;t start as a coach — he started as a competitor.
                  After years on the rodeo circuit, he channelled everything he learned about
                  strength, timing, and resilience into a coaching philosophy that has since
                  transformed hundreds of athletes.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-white/70">
                  His training methodology is rooted in functional movement, sport-specific
                  conditioning, and the mental discipline required to perform under pressure.
                  Every program in ProGrip JP reflects that real-world experience — no fluff,
                  just the work that actually makes riders better.
                </p>
              </div>

              {/* Credentials */}
              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Credentials
                </h3>
                <ul className="space-y-2">
                  {credentials.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm text-white/70">
                      <span className="mt-0.5 shrink-0 text-accent">✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-4xl uppercase tracking-tight text-accent">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="mailto:coach@progripjp.com"
                  className="inline-block rounded-full bg-accent px-8 py-3 font-bold text-dark-bg transition-colors hover:bg-accent/90"
                >
                  Book 1-on-1 Session
                </a>
                <Link
                  href="/programs"
                  className="inline-block rounded-full border border-white/20 px-8 py-3 font-medium transition-colors hover:bg-white/10"
                >
                  View Programs
                </Link>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-white/10 px-6 py-8 text-center">
        <p className="text-sm text-white/30">
          © 2026 ProGrip JP. Built for those who show up.
        </p>
      </div>
    </div>
  )
}
