import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'
import { saveWorkoutDay } from '@/app/actions/workout'
import { PROGRAM_META, DAY_NAMES, getWorkoutForDay } from '@/lib/workout-data'
import { getWorkout, TEN_WEEK_PLAN } from '@/lib/ten-week-plan'
import ExerciseTable from '@/components/exercise-table'

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

        {/* Header */}
        {isTenWeek ? (
          <div className="mb-8">
            {tenWeekPlan && (
              <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                Week {weekNum}: {tenWeekPlan.title}
              </p>
            )}
            <h1 className="font-display text-5xl uppercase tracking-tight">
              Day {dayNum}
            </h1>
            {tenWeekDay?.dayName && (
              <p className="mt-1 text-sm text-black/40 dark:text-white/40">{tenWeekDay.dayName}</p>
            )}
            {!isRestDay && tenWeekDay && (
              <p className="mt-2 text-lg font-semibold">{tenWeekDay.focus}</p>
            )}
            {isCompleted && (
              <p className="mt-2 text-sm font-medium text-accent">✓ Completed</p>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-black/40 dark:text-white/40">
              <span>{programMeta?.label ?? program}</span>
              <span>·</span>
              <span>Week {weekNum}</span>
              <span>·</span>
              <span>{DAY_NAMES[dayNum - 1]}</span>
            </div>
            <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">
              {legacyWorkout?.title ?? 'Workout'}
            </h1>
            {isCompleted && (
              <p className="mt-2 text-sm font-medium text-accent">✓ Completed</p>
            )}
          </div>
        )}

        {/* Rest day message */}
        {isRestDay ? (
          <div className="mb-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 text-black/70 dark:text-white/70">
            <p className="text-lg font-medium">Rest day.</p>
            <p className="mt-2 text-sm">
              {isTenWeek && tenWeekDay?.notes
                ? tenWeekDay.notes
                : 'Use today to recover — or, if you missed a session earlier this week, use it as a makeup day. Your body grows between sessions, not during them.'}
            </p>
          </div>
        ) : (
          <>
            {isTenWeek && tenWeekDay ? (
              <ExerciseTable
                exercises={tenWeekDay.exercises}
                initialCompleted={(completion?.exercises_completed as number[]) ?? []}
                programType={program}
                week={weekNum}
                day={dayNum}
                dayRest={tenWeekDay.rest}
                variant="ten-week"
              />
            ) : (
              <ExerciseTable
                exercises={legacyWorkout?.exercises ?? []}
                initialCompleted={(completion?.exercises_completed as number[]) ?? []}
                programType={program}
                week={weekNum}
                day={dayNum}
              />
            )}

            {/* Conditioning block (10_week only) */}
            {isTenWeek && tenWeekDay?.conditioning && (
              <div className="mb-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-4">
                <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-accent">
                  Conditioning
                </p>
                <p className="text-sm text-black/80 dark:text-white/80">{tenWeekDay.conditioning}</p>
              </div>
            )}

            {/* Execution notes (10_week only) */}
            {isTenWeek && tenWeekDay?.notes && (
              <div className="mb-8 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-4">
                <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-accent">
                  Execution Notes
                </p>
                <p className="text-sm italic text-black/60 dark:text-white/60">{tenWeekDay.notes}</p>
              </div>
            )}
          </>
        )}

        {/* Notes + Mark Complete form */}
        <form action={saveWorkoutDay} className="space-y-4">
          <input type="hidden" name="program_type" value={program} />
          <input type="hidden" name="week_number" value={weekNum} />
          <input type="hidden" name="day_number" value={dayNum} />

          <div>
            <label
              htmlFor="notes_text"
              className="mb-2 block text-sm font-semibold uppercase tracking-widest text-black/50 dark:text-white/50"
            >
              Session Notes
            </label>
            <textarea
              id="notes_text"
              name="notes_text"
              rows={4}
              defaultValue={completion?.notes_text ?? ''}
              placeholder="How did it feel? Any PRs, issues, or adjustments…"
              className="w-full rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm placeholder-black/20 dark:placeholder-white/20 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-accent py-3 font-bold text-dark-bg transition-colors hover:bg-accent/90 sm:w-auto sm:px-10"
          >
            {isCompleted ? 'Update Notes' : 'Mark Complete'}
          </button>
        </form>

      </div>
    </div>
  )
}
