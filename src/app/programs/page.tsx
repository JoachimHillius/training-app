import SiteNav from '@/components/site-nav'
import ProgramCard from '@/components/program-card'
import ScrollReveal from '@/components/scroll-reveal'

const programs = [
  {
    label: '10 Week',
    duration: '10 Weeks',
    title: 'Bareback Foundation',
    description:
      'Build the foundational strength, grip endurance, and body positioning required for bareback riding. Perfect for athletes new to the rodeo circuit or returning after time off.',
    features: [
      'Structured 10-week training plan',
      'Grip strength & forearm endurance',
      'Core stability & hip flexor development',
      'Sport-specific conditioning drills',
      'Weekly progress checkpoints',
    ],
    featured: false,
  },
  {
    label: '3 Month',
    duration: '12 Weeks',
    title: 'Bareback Builder',
    description:
      'Take your riding to the next level with periodized programming that builds explosive power, reactive balance, and the mental toughness required to stay on.',
    features: [
      '12 weeks of periodized training',
      'Explosive hip & shoulder power',
      'Reactive balance & timing drills',
      'Weekly intensity adjustments',
      'Full video library access',
      'Priority coach support',
    ],
    featured: true,
  },
  {
    label: '6 Month',
    duration: '24 Weeks',
    title: 'Elite 1-on-1',
    description:
      'The complete transformation. Six months of elite-level programming with direct 1-on-1 coaching from Pascal Isabelle — built for athletes serious about competing at the highest level.',
    features: [
      '24 weeks of custom programming',
      'Monthly 1-on-1 video calls with Pascal',
      'Competition-specific preparation',
      'Custom plan modifications',
      'Community & peer access',
      'Nutrition & recovery guidance',
    ],
    featured: false,
  },
]

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <SiteNav />

      {/* Page hero */}
      <div className="px-6 pb-8 pt-20 text-center sm:px-12">
        <ScrollReveal>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            ProGrip JP
          </span>
          <h1 className="mt-3 font-display text-6xl uppercase tracking-tight sm:text-7xl">
            Choose Your Program
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Real bareback rodeo training. Pick the plan that matches where you are —
            then select your intensity and get to work.
          </p>
        </ScrollReveal>
      </div>

      {/* Program cards */}
      <div className="px-6 pb-28 pt-12 sm:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {programs.map((program, i) => (
            <ScrollReveal key={program.label} delay={i * 120}>
              <ProgramCard program={program} />
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
