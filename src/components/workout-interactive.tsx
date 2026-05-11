'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { toggleExerciseComplete, saveWorkoutDay } from '@/app/actions/workout'
import { playTimerSound, SOUND_STORAGE_KEY, type SoundPreset } from '@/lib/workout-sounds'

type TableExercise = {
  name: string
  sets?: string
  reps?: string
  rest?: string
  setsReps?: string
}

interface WorkoutInteractiveProps {
  // Header content (rendered below the session timer)
  headerChip?: string     // "Week 1: Foundation" — small accent line
  headerTitle: string     // "Day 3" or "Lower Body Power" — big Bebas title
  headerSubtitle?: string // "Tuesday" — muted below title
  headerFocus?: string    // "Bareback Specific + Core" — bold focus line

  // Exercise data
  exercises: TableExercise[]
  initialCompleted: number[]
  programType: string
  week: number
  day: number
  dayRest?: string
  variant?: 'standard' | 'ten-week'
  isCompleted: boolean
  savedNotes: string
  conditioning?: string
  executionNotes?: string
}

function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function parseRestSeconds(str: string | undefined | null): number {
  if (!str) return 0
  const min = str.match(/(\d+)\s*min/)
  if (min) return parseInt(min[1]) * 60
  const sec = str.match(/(\d+)\s*sec/)
  if (sec) return parseInt(sec[1])
  return 0
}

function parseDrillSeconds(setsReps: string | undefined | null): number {
  if (!setsReps) return 0
  if (!/sec/i.test(setsReps)) return 0
  const m = setsReps.match(/(\d+)\s*sec/i)
  return m ? parseInt(m[1]) : 0
}

export default function WorkoutInteractive({
  headerChip,
  headerTitle,
  headerSubtitle,
  headerFocus,
  exercises,
  initialCompleted,
  programType,
  week,
  day,
  dayRest,
  variant = 'standard',
  isCompleted,
  savedNotes,
  conditioning,
  executionNotes,
}: WorkoutInteractiveProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set(initialCompleted))
  const [, startTransition] = useTransition()

  // Session timer
  const [sessionSeconds, setSessionSeconds] = useState(0)
  const [sessionStarted, setSessionStarted] = useState(false)
  const sessionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Rest timers: exerciseIndex → remaining seconds
  const [restTimers, setRestTimers] = useState<Map<number, number>>(new Map())
  const restIntervalsRef = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map())

  // Drill timers: exerciseIndex → remaining seconds
  const [drillTimers, setDrillTimers] = useState<Map<number, number>>(new Map())
  const drillIntervalsRef = useRef<Map<number, ReturnType<typeof setInterval>>>(new Map())

  // Gold flash state per row
  const [flashingRows, setFlashingRows] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!sessionStarted) return
    sessionIntervalRef.current = setInterval(() => setSessionSeconds((s) => s + 1), 1000)
    return () => {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current)
    }
  }, [sessionStarted])

  useEffect(() => {
    return () => {
      restIntervalsRef.current.forEach(clearInterval)
      drillIntervalsRef.current.forEach(clearInterval)
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current)
    }
  }, [])

  function flashRow(index: number) {
    setFlashingRows((prev) => new Set([...prev, index]))
    setTimeout(() => {
      setFlashingRows((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }, 600)
  }

  function fireTimerEnd(exerciseIndex: number) {
    const preset = (localStorage.getItem(SOUND_STORAGE_KEY) ?? 'bell') as SoundPreset
    playTimerSound(preset)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }
    flashRow(exerciseIndex)
  }

  function startRestTimer(exerciseIndex: number, seconds: number) {
    if (seconds <= 0) return
    const existing = restIntervalsRef.current.get(exerciseIndex)
    if (existing) clearInterval(existing)

    let remaining = seconds
    setRestTimers((prev) => new Map([...prev, [exerciseIndex, seconds]]))

    const interval = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        clearInterval(interval)
        restIntervalsRef.current.delete(exerciseIndex)
        setRestTimers((prev) => {
          const next = new Map(prev)
          next.delete(exerciseIndex)
          return next
        })
        fireTimerEnd(exerciseIndex)
      } else {
        setRestTimers((prev) => new Map([...prev, [exerciseIndex, remaining]]))
      }
    }, 1000)

    restIntervalsRef.current.set(exerciseIndex, interval)
  }

  function cancelRestTimer(exerciseIndex: number) {
    const existing = restIntervalsRef.current.get(exerciseIndex)
    if (existing) {
      clearInterval(existing)
      restIntervalsRef.current.delete(exerciseIndex)
    }
    setRestTimers((prev) => {
      const next = new Map(prev)
      next.delete(exerciseIndex)
      return next
    })
  }

  function startDrillTimer(exerciseIndex: number, seconds: number) {
    if (seconds <= 0) return
    const existing = drillIntervalsRef.current.get(exerciseIndex)
    if (existing) clearInterval(existing)

    let remaining = seconds
    setDrillTimers((prev) => new Map([...prev, [exerciseIndex, seconds]]))

    const interval = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        clearInterval(interval)
        drillIntervalsRef.current.delete(exerciseIndex)
        setDrillTimers((prev) => {
          const next = new Map(prev)
          next.delete(exerciseIndex)
          return next
        })
        fireTimerEnd(exerciseIndex)
      } else {
        setDrillTimers((prev) => new Map([...prev, [exerciseIndex, remaining]]))
      }
    }, 1000)

    drillIntervalsRef.current.set(exerciseIndex, interval)
  }

  function handleToggle(index: number, isChecked: boolean, restSecs: number) {
    if (isChecked && !sessionStarted) setSessionStarted(true)

    setCompleted((prev) => {
      const next = new Set(prev)
      if (isChecked) next.add(index)
      else next.delete(index)
      return next
    })

    if (isChecked) {
      startRestTimer(index, restSecs)
    } else {
      cancelRestTimer(index)
    }

    startTransition(async () => {
      await toggleExerciseComplete(programType, week, day, index, isChecked)
    })
  }

  return (
    <div>
      {/* ── SESSION TIMER ─────────────────────────────── */}
      <div className="mb-10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
          Session Timer
        </p>
        <div className="flex items-end gap-4">
          <span
            className={`font-display text-7xl leading-none tracking-tight transition-colors ${
              sessionStarted ? 'text-accent' : 'text-black/30 dark:text-white/30'
            }`}
          >
            {formatTime(sessionSeconds)}
          </span>
          {!sessionStarted && (
            <button
              type="button"
              onClick={() => setSessionStarted(true)}
              className="mb-1 rounded-full border border-accent/60 px-4 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              Start
            </button>
          )}
        </div>
        {!sessionStarted && (
          <p className="mt-1 text-xs text-black/30 dark:text-white/30">
            Auto-starts on first rep
          </p>
        )}
      </div>

      {/* ── HEADER ────────────────────────────────────── */}
      <div className="mb-8">
        {headerChip && (
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {headerChip}
          </p>
        )}
        <h1 className="font-display text-5xl uppercase tracking-tight">{headerTitle}</h1>
        {headerSubtitle && (
          <p className="mt-1 text-sm text-black/40 dark:text-white/40">{headerSubtitle}</p>
        )}
        {headerFocus && (
          <p className="mt-2 text-lg font-semibold">{headerFocus}</p>
        )}
        {isCompleted && (
          <p className="mt-2 text-sm font-medium text-accent">✓ Completed</p>
        )}
      </div>

      {/* ── EXERCISE TABLE ────────────────────────────── */}
      <div className="mb-8 overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
        <table className="w-full text-sm">
          <thead>
            {variant === 'ten-week' ? (
              <tr className="border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <th className="px-3 py-3 sm:px-4 text-center font-semibold text-black/50 dark:text-white/50">
                  Done
                </th>
                <th className="px-3 py-3 sm:px-5 text-left font-semibold text-black/50 dark:text-white/50">
                  Exercise
                </th>
                <th className="px-3 py-3 sm:px-4 text-center font-semibold text-black/50 dark:text-white/50 whitespace-nowrap">
                  Sets / Reps
                </th>
                <th className="px-3 py-3 sm:px-4 text-center font-semibold text-black/50 dark:text-white/50">
                  Rest
                </th>
              </tr>
            ) : (
              <tr className="border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <th className="px-3 py-3 sm:px-4 text-center font-semibold text-black/50 dark:text-white/50">
                  Done
                </th>
                <th className="px-3 py-3 sm:px-5 text-left font-semibold text-black/50 dark:text-white/50">
                  Exercise
                </th>
                <th className="px-3 py-3 sm:px-4 text-center font-semibold text-black/50 dark:text-white/50">
                  Sets
                </th>
                <th className="px-3 py-3 sm:px-4 text-center font-semibold text-black/50 dark:text-white/50">
                  Reps
                </th>
                <th className="px-3 py-3 sm:px-4 text-center font-semibold text-black/50 dark:text-white/50">
                  Rest
                </th>
              </tr>
            )}
          </thead>
          <tbody>
            {exercises.map((ex, i) => {
              const isDone = completed.has(i)
              const restSecs =
                variant === 'ten-week'
                  ? ex.setsReps
                    ? parseRestSeconds(dayRest)
                    : 0
                  : parseRestSeconds(ex.rest)
              const drillSecs = parseDrillSeconds(ex.setsReps)
              const restRemaining = restTimers.get(i)
              const drillRemaining = drillTimers.get(i)
              const isFlashing = flashingRows.has(i)

              return (
                <tr
                  key={i}
                  className={`border-b border-black/5 dark:border-white/5 transition-colors duration-300 ${
                    isFlashing
                      ? 'bg-accent/30'
                      : isDone
                      ? 'bg-accent/10'
                      : i % 2 === 0
                      ? ''
                      : 'bg-black/[0.02] dark:bg-white/[0.02]'
                  }`}
                >
                  <td className="px-3 py-3 sm:px-4 sm:py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(e) => handleToggle(i, e.target.checked, restSecs)}
                      className="h-4 w-4 cursor-pointer accent-[#e5ab3a]"
                    />
                  </td>
                  <td
                    className={`px-3 py-3 sm:px-5 sm:py-4 font-medium transition-colors ${
                      isDone ? 'text-black/30 dark:text-white/30 line-through' : ''
                    }`}
                  >
                    {ex.name}
                  </td>

                  {variant === 'ten-week' ? (
                    <>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-center text-black/70 dark:text-white/70">
                        {drillRemaining !== undefined ? (
                          <span className="font-mono font-bold text-accent tabular-nums">
                            {formatTime(drillRemaining)}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>{ex.setsReps ?? '—'}</span>
                            {drillSecs > 0 && (
                              <button
                                type="button"
                                onClick={() => startDrillTimer(i, drillSecs)}
                                title={`Start ${drillSecs}s drill`}
                                className="text-accent hover:text-accent/70 text-xs leading-none"
                              >
                                ▶
                              </button>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-center whitespace-nowrap">
                        {restRemaining !== undefined ? (
                          <span className="font-mono font-bold text-accent tabular-nums">
                            {formatTime(restRemaining)}
                          </span>
                        ) : (
                          <span className="text-black/70 dark:text-white/70">
                            {ex.setsReps ? (dayRest ?? '—') : '—'}
                          </span>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-center text-black/70 dark:text-white/70">
                        {ex.sets}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-center text-black/70 dark:text-white/70">
                        {ex.reps}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-center whitespace-nowrap">
                        {restRemaining !== undefined ? (
                          <span className="font-mono font-bold text-accent tabular-nums">
                            {formatTime(restRemaining)}
                          </span>
                        ) : (
                          <span className="text-black/70 dark:text-white/70">
                            {ex.rest ?? '—'}
                          </span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── CONDITIONING BLOCK ────────────────────────── */}
      {conditioning && (
        <div className="mb-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-4">
          <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-accent">
            Conditioning
          </p>
          <p className="text-sm text-black/80 dark:text-white/80">{conditioning}</p>
        </div>
      )}

      {/* ── EXECUTION NOTES ───────────────────────────── */}
      {executionNotes && (
        <div className="mb-8 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-4">
          <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-accent">
            Execution Notes
          </p>
          <p className="text-sm italic text-black/60 dark:text-white/60">{executionNotes}</p>
        </div>
      )}

      {/* ── SESSION NOTES + MARK COMPLETE ─────────────── */}
      <form action={saveWorkoutDay} className="space-y-4">
        <input type="hidden" name="program_type" value={programType} />
        <input type="hidden" name="week_number" value={week} />
        <input type="hidden" name="day_number" value={day} />
        <input type="hidden" name="session_seconds" value={sessionSeconds} />

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
            defaultValue={savedNotes}
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
  )
}
