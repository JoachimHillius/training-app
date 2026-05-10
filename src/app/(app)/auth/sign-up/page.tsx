import Link from 'next/link'
import { signUp } from '@/app/actions/auth'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-bold text-accent">Create account</h1>

        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </p>
        )}

        <form action={signUp} className="space-y-5">
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
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-dark-bg hover:bg-accent/90 transition-colors"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-black/50 dark:text-white/50">
          Already have an account?{' '}
          <Link href="/auth/log-in" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
