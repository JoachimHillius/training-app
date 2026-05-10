import SiteNav from '@/components/site-nav'
import WorkoutCard from '@/components/workout-card'
import ScrollReveal from '@/components/scroll-reveal'

const workouts = [
  {
    category: 'Strength',
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    description: 'Progressive overload, compound lifts, real results.',
  },
  {
    category: 'Cardio',
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    description: 'Intervals, endurance, and metabolic conditioning.',
  },
  {
    category: 'Mobility',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    description: 'Move better, recover faster, stay in the game longer.',
  },
]

export default function WorkoutsPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <SiteNav />

      {/* Page hero */}
      <div className="px-6 pb-8 pt-20 text-center sm:px-12">
        <ScrollReveal>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Training Library
          </span>
          <h1 className="mt-3 font-display text-6xl uppercase tracking-tight sm:text-7xl">
            Every Session Counts
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Three categories. One goal. Tap a card to explore — new content drops weekly.
          </p>
        </ScrollReveal>
      </div>

      {/* Workout cards */}
      <div className="px-6 pb-28 pt-12 sm:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {workouts.map((workout, i) => (
            <ScrollReveal key={workout.category} delay={i * 120}>
              <WorkoutCard workout={workout} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-white/10 px-6 py-8 text-center">
        <p className="text-sm text-white/30">
          © 2026 ProGrip JP. Built for those who show up.
        </p>
      </div>
    </div>
  )
}
