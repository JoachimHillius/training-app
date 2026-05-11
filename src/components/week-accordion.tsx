'use client'

import { useState } from 'react'
import Link from 'next/link'

type DayData = {
  dayNumber: number
  dayName: string
  label: string
  isCompleted: boolean
  isRest: boolean
}

export type WeekData = {
  weekNumber: number
  title: string
  days: DayData[]
  isCompleted: boolean
  isUnlocked: boolean
  isCurrent: boolean
}

interface WeekAccordionProps {
  weeks: WeekData[]
  program: string
  currentWeek: number
}

export default function WeekAccordion({ weeks, program, currentWeek }: WeekAccordionProps) {
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([currentWeek]))

  function toggle(weekNumber: number, isUnlocked: boolean) {
    if (!isUnlocked) return
    setOpenWeeks((prev) => {
      const next = new Set(prev)
      if (next.has(weekNumber)) next.delete(weekNumber)
      else next.add(weekNumber)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {weeks.map((week) => {
        const isOpen = openWeeks.has(week.weekNumber)

        return (
          <div
            key={week.weekNumber}
            className={`rounded-2xl border transition-colors ${
              week.isCurrent && !week.isCompleted
                ? 'border-accent/40 bg-accent/5'
                : week.isCompleted
                  ? 'border-white/10 bg-white/5'
                  : week.isUnlocked
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/5 bg-white/[0.02] opacity-50'
            }`}
          >
            {/* Header row */}
            <button
              type="button"
              onClick={() => toggle(week.weekNumber, week.isUnlocked)}
              disabled={!week.isUnlocked}
              className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left ${
                week.isUnlocked ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Left: week number + title */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-xl uppercase tracking-tight">
                    Week {week.weekNumber}
                  </span>
                  {week.title && (
                    <span className="text-sm text-white/40 truncate">{week.title}</span>
                  )}
                </div>
              </div>

              {/* Right: status + chevron */}
              <div className="flex items-center gap-3 shrink-0">
                {week.isCompleted && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    ✓ Done
                  </span>
                )}
                {week.isCurrent && !week.isCompleted && (
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent">
                    Current
                  </span>
                )}
                {!week.isUnlocked && (
                  <span className="text-xs text-white/30">
                    🔒 Complete Week {week.weekNumber - 1} to unlock
                  </span>
                )}
                {week.isUnlocked && (
                  <span
                    className={`text-white/40 text-sm transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    style={{ display: 'inline-block' }}
                  >
                    ▾
                  </span>
                )}
              </div>
            </button>

            {/* Expanded content: 7-day grid */}
            {isOpen && week.isUnlocked && (
              <div className="px-5 pb-5">
                <div className="mb-4 h-px bg-white/10" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {week.days.map((day) => (
                    <Link
                      key={day.dayNumber}
                      href={`/workout/${program}/${week.weekNumber}/${day.dayNumber}`}
                      className={`group flex flex-col rounded-xl border p-4 transition-all hover:-translate-y-0.5 ${
                        day.isCompleted
                          ? 'border-accent/40 bg-accent/10'
                          : day.isRest
                            ? 'border-white/10 bg-white/5 opacity-70'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                          {day.dayName.slice(0, 3)}
                        </span>
                        {day.isCompleted && (
                          <span className="text-sm text-accent">✓</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold leading-snug">{day.label}</p>
                      <p className="mt-auto pt-3 text-xs text-white/30">Day {day.dayNumber}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
