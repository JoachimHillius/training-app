import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from './theme-toggle'

export default function LandingNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-8 py-6">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="ProGrip JP"
          width={120}
          height={40}
          priority
          className="h-10 w-auto object-contain"
        />
      </Link>

      {/* Center page links — hidden on small screens */}
      <div className="hidden items-center gap-8 md:flex">
        <Link href="/programs" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
          Programs
        </Link>
        <Link href="/workouts" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
          Workouts
        </Link>
        <Link href="/coach" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
          Coach
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link
          href="/auth/log-in"
          className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white sm:inline"
        >
          Log in
        </Link>
        <Link
          href="/auth/sign-up"
          className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-dark-bg transition-colors hover:bg-accent/90"
        >
          Get Started
        </Link>
      </div>
    </nav>
  )
}
