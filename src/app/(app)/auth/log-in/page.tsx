import Link from 'next/link'
import { signIn } from '@/app/actions/auth'

export default async function LogInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-bold text-accent">Log in</h1>

        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </p>
        )}

        <form action={signIn} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-dark-bg hover:bg-accent/90 transition-colors"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-black/50 dark:text-white/50">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="font-medium text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
