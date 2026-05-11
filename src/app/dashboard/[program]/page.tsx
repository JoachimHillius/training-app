import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'
import { PROGRAM_META, DAY_NAMES, getWorkoutForDay } from '@/lib/workout-data'
import { TEN_WEEK_PLAN, TEN_WEEK_TOTAL_WEEKS } from '@/lib/ten-week-plan'
import WeekAccordion, { type WeekData } from '@/components/week-accordion'

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
  const totalWeeks = isTenWeek ? TEN_WEEK_TOTAL_WEEKS : programMeta.totalWeeks

  const { data: profile } = await supabase
    .from('profiles')
    .select('assigned_program, current_week')
    .eq('user_id', user.id)
    .maybeSingle()

  const currentWeek =
    profile?.assigned_program === program ? (profile?.current_week ?? 1) : 1

  // Fetch all completions for this user + program in one query
  const { data: allCompletions } = await supabase
    .from('day_completions')
    .select('week_number, day_number')
    .eq('user_id', user.id)
    .eq('program_type', program)

  // Group by week
  const completionsByWeek = new Map<number, Set<number>>()
  for (const row of allCompletions ?? []) {
    if (!completionsByWeek.has(row.week_number)) {
      completionsByWeek.set(row.week_number, new Set())
    }
    completionsByWeek.get(row.week_number)!.add(row.day_number)
  }

  // Sequential unlock: week 1 always unlocked, week N+1 unlocked if week N has 7 days
  const unlockedSet = new Set<number>([1])
  for (let w = 1; w < totalWeeks; w++) {
    if ((completionsByWeek.get(w)?.size ?? 0) >= 7) {
      unlockedSet.add(w + 1)
    } else {
      break
    }
  }
  if (isAdmin) {
    for (let w = 1; w <= totalWeeks; w++) unlockedSet.add(w)
  }

  // Build serializable week data for the client component
  const weeks: WeekData[] = Array.from({ length: totalWeeks }, (_, i) => {
    const weekNumber = i + 1
    const tenWeekWeek = isTenWeek
      ? TEN_WEEK_PLAN.find((w) => w.weekNumber === weekNumber)
      : null
    const completedDaysSet = completionsByWeek.get(weekNumber) ?? new Set<number>()

    const days = Array.from({ length: 7 }, (_, j) => {
      const dayNumber = j + 1
      const isRest = dayNumber === 7
      const label = isRest
        ? 'Rest / Makeup'
        : isTenWeek
          ? (tenWeekWeek?.days.find((d) => d.day === dayNumber)?.focus ?? '—')
          : getWorkoutForDay(dayNumber).title

      return {
        dayNumber,
        dayName: DAY_NAMES[j],
        label,
        isCompleted: completedDaysSet.has(dayNumber),
        isRest,
      }
    })

    return {
      weekNumber,
      title: tenWeekWeek?.title ?? '',
      days,
      isCompleted: completedDaysSet.size >= 7,
      isUnlocked: unlockedSet.has(weekNumber),
      isCurrent: weekNumber === currentWeek,
    }
  })

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <DashboardNav email={user.email ?? ''} isAdmin={isAdmin} />

      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">

        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          ← Back to Programs
        </Link>

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

        <WeekAccordion weeks={weeks} program={program} currentWeek={currentWeek} />

      </div>
    </div>
  )
}
