import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from './theme-toggle'

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-dark-bg px-6 py-4 sm:px-10">
      <div className="flex items-center gap-10">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="ProGrip JP"
            width={110}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
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
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link
          href="/auth/log-in"
          className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white sm:inline"
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
