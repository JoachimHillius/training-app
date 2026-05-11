import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import DashboardNav from '@/components/dashboard-nav'
import { assignProgram } from '@/app/actions/admin'
import { PROGRAM_OPTIONS } from '@/lib/workout-data'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/log-in')
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  const { saved } = await searchParams

  const adminClient = createAdminClient()

  const [{ data: authData, error: usersError }, { data: profiles }, { data: completions }] =
    await Promise.all([
      adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      adminClient.from('profiles').select('*'),
      adminClient
        .from('day_completions')
        .select('user_id, program_type, week_number, day_number'),
    ])

  const users = authData?.users ?? []

  // Count days completed per user+program+week
  const completionCounts = new Map<string, number>()
  for (const c of completions ?? []) {
    const key = `${c.user_id}:${c.program_type}:${c.week_number}`
    completionCounts.set(key, (completionCounts.get(key) ?? 0) + 1)
  }

  const rows = users.map((u) => ({
    id: u.id,
    email: u.email ?? '(no email)',
    profile: profiles?.find((p) => p.user_id === u.id) ?? null,
  }))

  return (
    <div className="min-h-screen">
      <DashboardNav email={user.email ?? ''} isAdmin={true} />

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Admin</p>
          <h1 className="mt-2 font-display text-5xl uppercase tracking-tight">
            Manage Users
          </h1>
        </div>

        {saved && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-accent">
            Program assignment saved.
          </div>
        )}

        {usersError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            Error loading users. Check that SUPABASE_SECRET_KEY is set correctly.
          </div>
        )}

        <div className="space-y-3">
          {rows.map((row) => {
            const profile = row.profile
            const daysCompleted =
              profile?.assigned_program && profile?.current_week
                ? (completionCounts.get(
                    `${row.id}:${profile.assigned_program}:${profile.current_week}`,
                  ) ?? 0)
                : 0

            return (
              <form
                key={row.id}
                action={assignProgram}
                className="flex flex-col gap-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-5 sm:flex-row sm:items-center"
              >
                <input type="hidden" name="user_id" value={row.id} />

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{row.email}</p>
                  <p className="mt-0.5 text-xs text-black/40 dark:text-white/30">
                    {profile
                      ? profile.assigned_program
                        ? `Week ${profile.current_week} (${daysCompleted}/7 days done) · ${profile.assigned_program}`
                        : 'No program assigned'
                      : 'No profile yet'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    name="assigned_program"
                    defaultValue={profile?.assigned_program ?? ''}
                    className="rounded-xl border border-black/20 dark:border-white/20 bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="">No program</option>
                    {PROGRAM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-dark-bg">
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-white/40">Week</label>
                    <input
                      type="number"
                      name="current_week"
                      min={1}
                      max={24}
                      defaultValue={profile?.current_week ?? 1}
                      className="w-16 rounded-xl border border-black/20 dark:border-white/20 bg-white dark:bg-dark-bg px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-dark-bg transition-colors hover:bg-accent/90"
                  >
                    Save
                  </button>
                </div>
              </form>
            )
          })}

          {rows.length === 0 && !usersError && (
            <p className="text-sm text-white/40">No users found.</p>
          )}
        </div>

      </div>
    </div>
  )
}
