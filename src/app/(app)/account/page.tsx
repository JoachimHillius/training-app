import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/log-in')
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-bold text-accent">Account</h1>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5">
          <p className="text-sm text-black/50 dark:text-white/50">Signed in as</p>
          <p className="mt-1 font-medium">{user.email}</p>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-xl border border-black/20 dark:border-white/20 py-3 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
