import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'
import { PROGRAM_META, DAY_NAMES, getWorkoutForDay } from '@/lib/workout-data'
import { getWorkout, TEN_WEEK_PLAN } from '@/lib/ten-week-plan'
import WorkoutInteractive from '@/components/workout-interactive'

export default async function WorkoutDayPage({
  params,
  searchParams,
}: {
  params: Promise<{ program: string; week: string; day: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/log-in')

  const { program, week, day } = await params
  const { saved } = await searchParams

  const weekNum = parseInt(week, 10)
  const dayNum = parseInt(day, 10)
  const isAdmin = user.email === process.env.ADMIN_EMAIL

  if (isNaN(weekNum) || isNaN(dayNum) || dayNum < 1 || dayNum > 7) {
    redirect('/dashboard')
  }

  const isTenWeek = program === '10_week'
  const programMeta = PROGRAM_META[program]
  const isRestDay = dayNum === 7

  const tenWeekDay = isTenWeek ? getWorkout(weekNum, dayNum) : null
  const tenWeekPlan = isTenWeek ? TEN_WEEK_PLAN.find((w) => w.weekNumber === weekNum) : null
  const legacyWorkout = !isTenWeek ? getWorkoutForDay(dayNum) : null

  const { data: completion } = await supabase
    .from('day_completions')
    .select('*')
    .eq('user_id', user.id)
    .eq('program_type', program)
    .eq('week_number', weekNum)
    .eq('day_number', dayNum)
    .maybeSingle()

  const isCompleted = !!completion

  // Build header props for WorkoutInteractive
  const headerChip = isTenWeek
    ? (tenWeekPlan ? `Week ${weekNum}: ${tenWeekPlan.title}` : `Week ${weekNum}`)
    : `${programMeta?.label ?? program} · Week ${weekNum}`

  const headerTitle = isTenWeek
    ? `Day ${dayNum}`
    : (legacyWorkout?.title ?? 'Workout')

  const headerSubtitle = isTenWeek
    ? (tenWeekDay?.dayName ?? DAY_NAMES[dayNum - 1])
    : DAY_NAMES[dayNum - 1]

  const headerFocus = isTenWeek && !isRestDay ? (tenWeekDay?.focus ?? undefined) : undefined

  return (
    <div className="min-h-screen">
      <DashboardNav email={user.email ?? ''} isAdmin={isAdmin} />

      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10">

        {/* Back link */}
        <Link
          href={`/dashboard/${program}`}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          ← Back
        </Link>

        {/* Saved banner */}
        {saved && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-accent">
            {isCompleted ? 'Notes updated.' : 'Day marked complete — great work.'}
          </div>
        )}

        {isRestDay ? (
          <>
            {/* Header for rest day (no WorkoutInteractive) */}
            <div className="mb-8">
              {isTenWeek && tenWeekPlan && (
                <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Week {weekNum}: {tenWeekPlan.title}
                </p>
              )}
              {!isTenWeek && (
                <div className="mb-1 flex flex-wrap items-center gap-3 text-sm text-black/40 dark:text-white/40">
                  <span>{programMeta?.label ?? program}</span>
                  <span>·</span>
                  <span>Week {weekNum}</span>
                </div>
              )}
              <h1 className="font-display text-5xl uppercase tracking-tight">
                {isTenWeek ? `Day ${dayNum}` : 'Rest Day'}
              </h1>
              {isTenWeek && <p className="mt-1 text-sm text-black/40 dark:text-white/40">{DAY_NAMES[dayNum - 1]}</p>}
            </div>

            <div className="mb-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 text-black/70 dark:text-white/70">
              <p className="text-lg font-medium">Rest day.</p>
              <p className="mt-2 text-sm">
                {isTenWeek && tenWeekDay?.notes
                  ? tenWeekDay.notes
                  : 'Use today to recover — or, if you missed a session earlier this week, use it as a makeup day. Your body grows between sessions, not during them.'}
              </p>
            </div>
          </>
        ) : (
          <WorkoutInteractive
            headerChip={headerChip}
            headerTitle={headerTitle}
            headerSubtitle={headerSubtitle}
            headerFocus={headerFocus}
            exercises={isTenWeek && tenWeekDay ? tenWeekDay.exercises : (legacyWorkout?.exercises ?? [])}
            initialCompleted={(completion?.exercises_completed as number[]) ?? []}
            programType={program}
            week={weekNum}
            day={dayNum}
            dayRest={isTenWeek && tenWeekDay ? tenWeekDay.rest : undefined}
            variant={isTenWeek && tenWeekDay ? 'ten-week' : 'standard'}
            isCompleted={isCompleted}
            savedNotes={completion?.notes_text ?? ''}
            conditioning={isTenWeek ? (tenWeekDay?.conditioning ?? undefined) : undefined}
            executionNotes={isTenWeek ? (tenWeekDay?.notes ?? undefined) : undefined}
          />
        )}

      </div>
    </div>
  )
}
