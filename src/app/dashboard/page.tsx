import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'

const PROGRAM_CARDS = [
  {
    value: '10_week',
    name: '10 Week Training',
    weeks: 10,
    description:
      'Build your bareback rodeo base. Grip strength, hip power, and stability from the ground up.',
  },
  {
    value: '3_month',
    name: '3 Month Training',
    weeks: 12,
    description:
      'Periodized progression for athletes ready to push harder. Three phases, one goal.',
  },
  {
    value: '6_month',
    name: '6 Month Training',
    weeks: 24,
    description:
      'Advanced programming for competitors. Full-season prep with peaking protocol.',
  },
  {
    value: '1on1',
    name: '1-on-1 Coaching',
    weeks: 24,
    description:
      'Custom programming built around your schedule, injuries, and competition calendar.',
  },
]

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/log-in')

  const { welcome } = await searchParams
  const isAdmin = user.email === process.env.ADMIN_EMAIL

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <DashboardNav email={user.email ?? ''} isAdmin={isAdmin} />

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">

        {welcome && (
          <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-accent">
            Welcome to ProGrip JP — your coach will assign your program shortly.
          </div>
        )}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            ProGrip JP
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-tight">
            Select Your Training Plan
          </h1>
          <p className="mt-2 text-white/50">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_CARDS.map((card) => (
            <Link
              key={card.value}
              href={`/dashboard/${card.value}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {card.weeks} weeks
              </p>
              <h2 className="mt-3 font-display text-2xl uppercase leading-none tracking-tight">
                {card.name}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                {card.description}
              </p>
              <span className="mt-6 text-sm font-semibold text-accent transition-colors group-hover:text-accent/80">
                Start Program →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
