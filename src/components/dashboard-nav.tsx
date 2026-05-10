import Image from 'next/image'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import ThemeToggle from './theme-toggle'

export default function DashboardNav({
  email,
  isAdmin,
}: {
  email: string
  isAdmin: boolean
}) {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-dark-bg px-6 py-4 sm:px-10">
      <div className="flex items-center gap-8">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="ProGrip JP"
            width={100}
            height={34}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <span className="hidden max-w-[180px] truncate text-sm text-white/40 sm:inline">
          {email}
        </span>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  )
}
