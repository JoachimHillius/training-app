import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Week1Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/log-in')
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-10">

        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Week 1</p>
          <h1 className="text-4xl font-bold">Building the Foundation</h1>
        </div>

        <div className="space-y-6 text-base leading-8 text-[#191a1b]/80 dark:text-white/80">
          <p>
            Welcome to Week 1. This week is all about establishing the habits and movement patterns
            that will carry you through the full 10-week program. Don&apos;t rush — every rep
            here is an investment in what comes later.
          </p>
          <p>
            Focus on form over load. You should finish each session feeling like you had more in
            the tank. That&apos;s intentional. We&apos;re building a base, not testing your limits —
            those sessions come in Week 4 and beyond.
          </p>
          <p>
            Rest at least one full day between sessions this week. Sleep, nutrition, and recovery
            are as important as the work itself. If anything feels off, scale back the volume before
            you scale back the intensity.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-accent">This Week&apos;s Exercises</h2>
          <ol className="space-y-3">
            {[
              { name: 'Goblet Squat', detail: '3 sets × 10 reps — light to moderate weight' },
              { name: 'Push-Up', detail: '3 sets × 12 reps — full range, controlled descent' },
              { name: 'Romanian Deadlift', detail: '3 sets × 8 reps — hinge focus, soft knees' },
              { name: 'Dumbbell Row', detail: '3 sets × 10 reps each side — elbow to hip' },
              { name: 'Dead Bug', detail: '3 sets × 8 reps each side — core stability' },
            ].map((exercise, index) => (
              <li
                key={exercise.name}
                className="flex gap-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-4"
              >
                <span className="mt-0.5 text-lg font-bold text-accent">{index + 1}</span>
                <div>
                  <p className="font-semibold">{exercise.name}</p>
                  <p className="text-sm text-[#191a1b]/60 dark:text-white/60">{exercise.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </main>
  )
}
