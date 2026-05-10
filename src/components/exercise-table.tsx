'use client'

import { useState, useTransition } from 'react'
import { toggleExerciseComplete } from '@/app/actions/workout'

type TableExercise = {
  name: string
  sets?: string
  reps?: string
  rest?: string
  setsReps?: string
}

interface ExerciseTableProps {
  exercises: TableExercise[]
  initialCompleted: number[]
  programType: string
  week: number
  day: number
  dayRest?: string
  variant?: 'standard' | 'ten-week'
}

export default function ExerciseTable({
  exercises,
  initialCompleted,
  programType,
  week,
  day,
  dayRest,
  variant = 'standard',
}: ExerciseTableProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set(initialCompleted))
  const [, startTransition] = useTransition()

  function handleToggle(index: number, isComplete: boolean) {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (isComplete) next.add(index)
      else next.delete(index)
      return next
    })

    startTransition(async () => {
      await toggleExerciseComplete(programType, week, day, index, isComplete)
    })
  }

  if (variant === 'ten-week') {
    return (
      <div className="mb-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-center font-semibold text-white/50">Done</th>
              <th className="px-5 py-3 text-left font-semibold text-white/50">Exercise</th>
              <th className="px-4 py-3 text-center font-semibold text-white/50">Sets / Reps</th>
              <th className="px-4 py-3 text-center font-semibold text-white/50">Rest</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex, i) => {
              const isDone = completed.has(i)
              return (
                <tr
                  key={i}
                  className={`border-b border-white/5 transition-colors ${
                    isDone ? 'bg-accent/10' : i % 2 === 0 ? '' : 'bg-white/[0.02]'
                  }`}
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(e) => handleToggle(i, e.target.checked)}
                      className="h-4 w-4 cursor-pointer accent-[#e5ab3a]"
                    />
                  </td>
                  <td className={`px-5 py-4 font-medium transition-colors ${isDone ? 'text-white/30 line-through' : ''}`}>
                    {ex.name}
                  </td>
                  <td className="px-4 py-4 text-center text-white/70">
                    {ex.setsReps ?? '—'}
                  </td>
                  <td className="px-4 py-4 text-center text-white/70">
                    {ex.setsReps ? (dayRest ?? '—') : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="mb-8 overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-4 py-3 text-center font-semibold text-white/50">Done</th>
            <th className="px-5 py-3 text-left font-semibold text-white/50">Exercise</th>
            <th className="px-4 py-3 text-center font-semibold text-white/50">Sets</th>
            <th className="px-4 py-3 text-center font-semibold text-white/50">Reps</th>
            <th className="px-4 py-3 text-center font-semibold text-white/50">Rest</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, i) => {
            const isDone = completed.has(i)
            return (
              <tr
                key={ex.name}
                className={`border-b border-white/5 transition-colors ${
                  isDone ? 'bg-accent/10' : i % 2 === 0 ? '' : 'bg-white/[0.02]'
                }`}
              >
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={(e) => handleToggle(i, e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-[#e5ab3a]"
                  />
                </td>
                <td className={`px-5 py-4 font-medium transition-colors ${isDone ? 'text-white/30 line-through' : ''}`}>
                  {ex.name}
                </td>
                <td className="px-4 py-4 text-center text-white/70">{ex.sets}</td>
                <td className="px-4 py-4 text-center text-white/70">{ex.reps}</td>
                <td className="px-4 py-4 text-center text-white/70">{ex.rest}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
