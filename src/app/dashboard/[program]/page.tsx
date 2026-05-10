import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'
import { PROGRAM_META, DAY_NAMES, getWorkoutForDay } from '@/lib/workout-data'
import { TEN_WEEK_PLAN, TEN_WEEK_TOTAL_WEEKS } from '@/lib/ten-week-plan'

export default async function ProgramDashboardPage({
  params,
}: {
  params: Promise<{ program: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/log-in')

  const { program } = await params
  const isAdmin = user.email === process.env.ADMIN_EMAIL

  const programMeta = PROGRAM_META[program]
  if (!programMeta) redirect('/dashboard')

  const isTenWeek = program === '10_week'

  const { data: profile } = await supabase
    .from('profiles')
    .select('assigned_program, current_week')
    .eq('user_id', user.id)
    .maybeSingle()

  const currentWeek =
    profile?.assigned_program === program ? (profile?.current_week ?? 1) : 1

  const { data: completions } = await supabase
    .from('day_completions')
    .select('day_number')
    .eq('user_id', user.id)
    .eq('program_type', program)
    .eq('week_number', currentWeek)

  const completedDays = new Set(completions?.map((c) => c.day_number) ?? [])

  const totalWeeks = isTenWeek ? TEN_WEEK_TOTAL_WEEKS : programMeta.totalWeeks
  const tenWeekPlan = isTenWeek
    ? TEN_WEEK_PLAN.find((w) => w.weekNumber === currentWeek)
    : null

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <DashboardNav email={user.email ?? ''} isAdmin={isAdmin} />

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">

        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          ← Back to Programs
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Your Training
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-tight">
            {programMeta.label}
          </h1>
          <p className="mt-1 text-white/50">
            Week {currentWeek} of {totalWeeks}
          </p>
        </div>

        {/* 7-day week grid */}
        <div>
          <div className="mb-5">
            <h2 className="font-display text-2xl uppercase tracking-tight text-white/80">
              Week {currentWeek} — Daily Plan
            </h2>
            {tenWeekPlan && (
              <p className="mt-1 text-sm text-white/40">{tenWeekPlan.title}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {Array.from({ length: 7 }, (_, i) => {
              const dayNumber = i + 1
              const dayName = DAY_NAMES[i]
              const isRest = dayNumber === 7
              const isCompleted = completedDays.has(dayNumber)

              const dayLabel = isRest
                ? 'Rest / Makeup'
                : isTenWeek
                  ? (tenWeekPlan?.days.find((d) => d.day === dayNumber)?.focus ?? '—')
                  : getWorkoutForDay(dayNumber).title

              return (
                <Link
                  key={dayNumber}
                  href={`/workout/${program}/${currentWeek}/${dayNumber}`}
                  className={`group flex flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5 ${
                    isCompleted
                      ? 'border-accent/40 bg-accent/10'
                      : isRest
                        ? 'border-white/10 bg-white/5 opacity-70'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                      {dayName.slice(0, 3)}
                    </span>
                    {isCompleted && (
                      <span className="text-sm text-accent">✓</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold leading-snug">
                    {dayLabel}
                  </p>
                  <p className="mt-auto pt-3 text-xs text-white/30">
                    Day {dayNumber}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
