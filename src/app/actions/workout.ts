'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PROGRAM_META } from '@/lib/workout-data'

export async function saveWorkoutDay(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/log-in')

  const programType = formData.get('program_type') as string
  const weekNumber = parseInt(formData.get('week_number') as string, 10)
  const dayNumber = parseInt(formData.get('day_number') as string, 10)
  const notesText = (formData.get('notes_text') as string) || null

  // Check if already completed so we preserve the original completed_at
  const { data: existing } = await supabase
    .from('day_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('program_type', programType)
    .eq('week_number', weekNumber)
    .eq('day_number', dayNumber)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('day_completions')
      .update({ notes_text: notesText })
      .eq('id', existing.id)
  } else {
    await supabase.from('day_completions').insert({
      user_id: user.id,
      program_type: programType,
      week_number: weekNumber,
      day_number: dayNumber,
      notes_text: notesText,
      completed_at: new Date().toISOString(),
    })

    // Auto-advance current_week when all 7 days of the current week are done
    const { count } = await supabase
      .from('day_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('program_type', programType)
      .eq('week_number', weekNumber)

    if (count === 7) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('assigned_program, current_week')
        .eq('user_id', user.id)
        .maybeSingle()

      if (
        profile?.assigned_program === programType &&
        profile.current_week === weekNumber
      ) {
        const totalWeeks = PROGRAM_META[programType]?.totalWeeks ?? 10
        const nextWeek = weekNumber + 1
        if (nextWeek <= totalWeeks) {
          await supabase
            .from('profiles')
            .update({ current_week: nextWeek })
            .eq('user_id', user.id)
        }
      }
    }
  }

  redirect(
    `/workout/${programType}/${weekNumber}/${dayNumber}?saved=1`
  )
}

export async function toggleExerciseComplete(
  programType: string,
  week: number,
  day: number,
  exerciseIndex: number,
  isComplete: boolean,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('day_completions')
    .select('id, exercises_completed')
    .eq('user_id', user.id)
    .eq('program_type', programType)
    .eq('week_number', week)
    .eq('day_number', day)
    .maybeSingle()

  let exercisesCompleted: number[] = (existing?.exercises_completed as number[]) ?? []

  if (isComplete) {
    if (!exercisesCompleted.includes(exerciseIndex)) {
      exercisesCompleted = [...exercisesCompleted, exerciseIndex]
    }
  } else {
    exercisesCompleted = exercisesCompleted.filter((i) => i !== exerciseIndex)
  }

  if (existing) {
    await supabase
      .from('day_completions')
      .update({ exercises_completed: exercisesCompleted })
      .eq('id', existing.id)
  } else {
    await supabase.from('day_completions').insert({
      user_id: user.id,
      program_type: programType,
      week_number: week,
      day_number: day,
      exercises_completed: exercisesCompleted,
    })
  }
}
