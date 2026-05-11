import { createClient } from '@/lib/supabase/server'

export async function getCompletedDays(
  userId: string,
  programType: string,
  weekNumber: number,
): Promise<number[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('day_completions')
    .select('day_number')
    .eq('user_id', userId)
    .eq('program_type', programType)
    .eq('week_number', weekNumber)
  return data?.map((r) => r.day_number) ?? []
}

export async function isWeekComplete(
  userId: string,
  programType: string,
  weekNumber: number,
): Promise<boolean> {
  const days = await getCompletedDays(userId, programType, weekNumber)
  return days.length >= 7
}

export async function getUnlockedWeeks(
  userId: string,
  programType: string,
  totalWeeks: number,
  isAdmin: boolean,
): Promise<number[]> {
  if (isAdmin) return Array.from({ length: totalWeeks }, (_, i) => i + 1)

  const supabase = await createClient()
  const { data } = await supabase
    .from('day_completions')
    .select('week_number, day_number')
    .eq('user_id', userId)
    .eq('program_type', programType)

  const completionsByWeek = new Map<number, Set<number>>()
  for (const row of data ?? []) {
    if (!completionsByWeek.has(row.week_number)) {
      completionsByWeek.set(row.week_number, new Set())
    }
    completionsByWeek.get(row.week_number)!.add(row.day_number)
  }

  const unlocked: number[] = [1]
  for (let w = 1; w < totalWeeks; w++) {
    if ((completionsByWeek.get(w)?.size ?? 0) >= 7) {
      unlocked.push(w + 1)
    } else {
      break
    }
  }
  return unlocked
}
