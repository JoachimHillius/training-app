import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'

const stats = [
  { value: '12+', label: 'Years coaching' },
  { value: '8k', label: 'Clients trained' },
  { value: '94%', label: 'Goal achievement' },
]

const programs = [
  {
    name: '10 Week Foundation',
    description:
      'Entry point for new athletes. Builds grip, hip power, and body awareness through structured daily sessions.',
  },
  {
    name: '3 Month Builder',
    description:
      'Periodized into three phases — accumulation, intensification, realization. Built for athletes with a base.',
  },
  {
    name: '6 Month Elite',
    description:
      'Full competition-season preparation. Peaks you for target events with planned deload weeks.',
  },
  {
    name: '1-on-1 Coaching',
    description:
      'Direct line to Pascal. Custom program built around your schedule, injuries, goals, and competition calendar.',
  },
]

export default async function CoachPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/log-in')

  const isAdmin = user.email === process.env.ADMIN_EMAIL

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <DashboardNav email={user.email ?? ''} isAdmin={isAdmin} />

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            ProGrip JP
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-tight sm:text-6xl">
            Meet the Coach
          </h1>
        </div>

        {/* Bio */}
        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl lg:mx-0">
            <Image
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80"
              alt="Coach Pascal Isabelle"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/50 to-transparent" />
          </div>

          <div>
            <h2 className="font-display text-4xl uppercase tracking-tight">
              Pascal Isabelle
            </h2>
            <p className="mt-1 font-medium text-white/50">
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

            <a
              href="mailto:pascal@progripjp.com"
              className="mt-10 inline-block rounded-full bg-accent px-8 py-3 font-bold text-dark-bg transition-colors hover:bg-accent/90"
            >
              Book 1-on-1 Session
            </a>
          </div>
        </div>

        {/* About the programs */}
        <div>
          <h2 className="mb-6 font-display text-3xl uppercase tracking-tight">
            About the Programs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-display text-xl uppercase tracking-tight text-accent">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
