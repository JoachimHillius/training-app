import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/dashboard-nav'
import { saveWorkoutDay } from '@/app/actions/workout'
import { PROGRAM_META, DAY_NAMES, getWorkoutForDay } from '@/lib/workout-data'

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

  // Validate params
  if (isNaN(weekNum) || isNaN(dayNum) || dayNum < 1 || dayNum > 7) {
    redirect('/dashboard')
  }

  const workout = getWorkoutForDay(dayNum)
  const programMeta = PROGRAM_META[program]
  const isRestDay = dayNum === 7

  // Fetch existing completion for this day
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
    <div className="min-h-screen bg-dark-bg text-white">
      <DashboardNav email={user.email ?? ''} isAdmin={isAdmin} />

      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10">

        {/* Back link */}
        <Link
          href="/dashboard"
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
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
            <span>{programMeta?.label ?? program}</span>
            <span>·</span>
            <span>Week {weekNum}</span>
            <span>·</span>
            <span>{DAY_NAMES[dayNum - 1]}</span>
          </div>
          <h1 className="mt-3 font-display text-5xl uppercase tracking-tight">
            {workout.title}
          </h1>
          {isCompleted && (
            <p className="mt-2 text-sm font-medium text-accent">✓ Completed</p>
          )}
        </div>

        {/* Rest day message */}
        {isRestDay ? (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            <p className="text-lg font-medium">Rest day.</p>
            <p className="mt-2 text-sm">
              Use today to recover — or, if you missed a session earlier this week,
              use it as a makeup day. Your body grows between sessions, not during them.
            </p>
          </div>
        ) : (
          /* Exercise table */
          <div className="mb-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-5 py-3 text-left font-semibold text-white/50">Exercise</th>
                  <th className="px-4 py-3 text-center font-semibold text-white/50">Sets</th>
                  <th className="px-4 py-3 text-center font-semibold text-white/50">Reps</th>
                  <th className="px-4 py-3 text-center font-semibold text-white/50">Rest</th>
                </tr>
              </thead>
              <tbody>
                {workout.exercises.map((ex, i) => (
                  <tr
                    key={ex.name}
                    className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-5 py-4 font-medium">{ex.name}</td>
                    <td className="px-4 py-4 text-center text-white/70">{ex.sets}</td>
                    <td className="px-4 py-4 text-center text-white/70">{ex.reps}</td>
                    <td className="px-4 py-4 text-center text-white/70">{ex.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notes + Mark Complete form */}
        <form action={saveWorkoutDay} className="space-y-4">
          <input type="hidden" name="program_type" value={program} />
          <input type="hidden" name="week_number" value={weekNum} />
          <input type="hidden" name="day_number" value={dayNum} />

          <div>
            <label
              htmlFor="notes_text"
              className="mb-2 block text-sm font-semibold uppercase tracking-widest text-white/50"
            >
              Session Notes
            </label>
            <textarea
              id="notes_text"
              name="notes_text"
              rows={4}
              defaultValue={completion?.notes_text ?? ''}
              placeholder="How did it feel? Any PRs, issues, or adjustments…"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm placeholder-white/20 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
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
