import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'
import { PROGRAM_META, DAY_NAMES, getWorkoutForDay } from '@/lib/workout-data'

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

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const assignedProgram = profile?.assigned_program ?? null
  const currentWeek = profile?.current_week ?? 1
  const programMeta = assignedProgram ? PROGRAM_META[assignedProgram] : null

  // Fetch completions for current week (only when program assigned)
  const completedDays = new Set<number>()
  if (assignedProgram) {
    const { data: completions } = await supabase
      .from('day_completions')
      .select('day_number')
      .eq('user_id', user.id)
      .eq('program_type', assignedProgram)
      .eq('week_number', currentWeek)

    completions?.forEach((c) => completedDays.add(c.day_number))
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <DashboardNav email={user.email ?? ''} isAdmin={isAdmin} />

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">

        {/* Welcome banner */}
        {welcome && (
          <div className="mb-8 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-accent">
            Welcome to ProGrip JP — your coach will assign your program shortly.
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Your Training
          </p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-white/50">{user.email}</p>
        </div>

        {/* Program status */}
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          {programMeta ? (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Assigned Program
                </p>
                <p className="mt-1 text-2xl font-bold">{programMeta.label}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  Current Progress
                </p>
                <p className="mt-1 text-2xl font-bold">
                  Week {currentWeek}{' '}
                  <span className="text-base font-normal text-white/40">
                    of {programMeta.totalWeeks}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-white/50">
              No program assigned yet — your coach will set this up for you shortly.
            </p>
          )}
        </div>

        {/* 7-day week grid */}
        {assignedProgram && (
          <div>
            <h2 className="mb-5 font-display text-2xl uppercase tracking-tight text-white/80">
              Week {currentWeek} — Daily Plan
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {Array.from({ length: 7 }, (_, i) => {
                const dayNumber = i + 1
                const dayName = DAY_NAMES[i]
                const isRest = dayNumber === 7
                const isCompleted = completedDays.has(dayNumber)
                const workout = getWorkoutForDay(dayNumber)

                return (
                  <Link
                    key={dayNumber}
                    href={`/workout/${assignedProgram}/${currentWeek}/${dayNumber}`}
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
                        <span className="text-accent text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold leading-snug">
                      {isRest ? 'Rest / Makeup' : workout.title}
                    </p>
                    <p className="mt-auto pt-3 text-xs text-white/30">
                      Day {dayNumber}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
