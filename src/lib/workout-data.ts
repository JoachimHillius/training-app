export type Exercise = {
  name: string
  sets: string
  reps: string
  rest: string
}

export type DayWorkout = {
  title: string
  exercises: Exercise[]
}

export const PROGRAM_META: Record<string, { label: string; totalWeeks: number }> = {
  '10_week': { label: '10 Week Foundation', totalWeeks: 10 },
  '3_month': { label: '3 Month Builder', totalWeeks: 12 },
  '6_month': { label: '6 Month Elite 1-on-1', totalWeeks: 24 },
  '1on1': { label: '1-on-1 Coaching', totalWeeks: 24 },
}

export const PROGRAM_OPTIONS = [
  { value: '10_week', label: '10 Week Foundation' },
  { value: '3_month', label: '3 Month Builder' },
  { value: '6_month', label: '6 Month Elite 1-on-1' },
  { value: '1on1', label: '1-on-1 Coaching' },
]

export const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const TEMPLATES: DayWorkout[] = [
  {
    title: 'Lower Body Power',
    exercises: [
      { name: 'Box Jump', sets: '4', reps: '6', rest: '2 min' },
      { name: 'Trap Bar Deadlift', sets: '4', reps: '5', rest: '2 min' },
      { name: 'Bulgarian Split Squat', sets: '3', reps: '8 each', rest: '90s' },
      { name: 'Hip Flexor March', sets: '3', reps: '12 each', rest: '60s' },
      { name: 'Grip Hang', sets: '3', reps: '30s', rest: '60s' },
    ],
  },
  {
    title: 'Upper Body Pull & Grip',
    exercises: [
      { name: 'Weighted Pull-Up', sets: '4', reps: '6', rest: '2 min' },
      { name: 'Barbell Row', sets: '4', reps: '8', rest: '90s' },
      { name: 'Face Pull', sets: '3', reps: '15', rest: '60s' },
      { name: 'Hammer Curl', sets: '3', reps: '10', rest: '60s' },
      { name: 'Fat Grip Deadlift Hold', sets: '3', reps: '20s', rest: '60s' },
    ],
  },
  {
    title: 'Conditioning & Core',
    exercises: [
      { name: 'Sled Push', sets: '6', reps: '30m sprint', rest: '90s' },
      { name: 'Battle Rope Wave', sets: '5', reps: '30s', rest: '60s' },
      { name: 'Pallof Press', sets: '3', reps: '12 each', rest: '60s' },
      { name: 'Ab Wheel Rollout', sets: '3', reps: '10', rest: '60s' },
      { name: 'Dead Bug', sets: '3', reps: '8 each', rest: '45s' },
    ],
  },
  {
    title: 'Lower Body Strength',
    exercises: [
      { name: 'Back Squat', sets: '5', reps: '5', rest: '3 min' },
      { name: 'Romanian Deadlift', sets: '3', reps: '10', rest: '90s' },
      { name: 'Walking Lunge', sets: '3', reps: '12 each', rest: '90s' },
      { name: 'Seated Calf Raise', sets: '3', reps: '15', rest: '60s' },
      { name: 'Adductor Machine', sets: '3', reps: '15', rest: '60s' },
    ],
  },
  {
    title: 'Upper Body Push',
    exercises: [
      { name: 'Bench Press', sets: '4', reps: '6', rest: '2 min' },
      { name: 'Overhead Press', sets: '4', reps: '8', rest: '90s' },
      { name: 'Dumbbell Incline Press', sets: '3', reps: '10', rest: '90s' },
      { name: 'Tricep Dip', sets: '3', reps: '12', rest: '60s' },
      { name: 'Lateral Raise', sets: '3', reps: '15', rest: '60s' },
    ],
  },
  {
    title: 'Full Body & Grip Endurance',
    exercises: [
      { name: 'Power Clean', sets: '4', reps: '4', rest: '2 min' },
      { name: 'Goblet Squat', sets: '3', reps: '12', rest: '90s' },
      { name: 'Ring Row', sets: '3', reps: '12', rest: '60s' },
      { name: 'Farmers Carry', sets: '4', reps: '40m', rest: '90s' },
      { name: 'Wrist Roller', sets: '3', reps: '3 full rolls', rest: '60s' },
    ],
  },
]

export function getWorkoutForDay(day: number): DayWorkout {
  if (day === 7) return { title: 'Rest Day / Makeup', exercises: [] }
  return TEMPLATES[(day - 1) % 6]
}
