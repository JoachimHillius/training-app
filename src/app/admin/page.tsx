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

  // Use service-role client to bypass RLS
  const adminClient = createAdminClient()

  const [{ data: authData, error: usersError }, { data: profiles }] = await Promise.all([
    adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    adminClient.from('profiles').select('*'),
  ])

  const users = authData?.users ?? []

  const rows = users.map((u) => ({
    id: u.id,
    email: u.email ?? '(no email)',
    profile: profiles?.find((p) => p.user_id === u.id) ?? null,
  }))

  return (
    <div className="min-h-screen bg-dark-bg text-white">
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
          {rows.map((row) => (
            <form
              key={row.id}
              action={assignProgram}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center"
            >
              <input type="hidden" name="user_id" value={row.id} />

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{row.email}</p>
                <p className="mt-0.5 text-xs text-white/30">
                  {row.profile
                    ? `Week ${row.profile.current_week} · ${row.profile.assigned_program ?? 'no program'}`
                    : 'No profile yet'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Program dropdown */}
                <select
                  name="assigned_program"
                  defaultValue={row.profile?.assigned_program ?? ''}
                  className="rounded-xl border border-white/20 bg-dark-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                >
                  <option value="">No program</option>
                  {PROGRAM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-dark-bg">
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Current week */}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/40">Week</label>
                  <input
                    type="number"
                    name="current_week"
                    min={1}
                    max={24}
                    defaultValue={row.profile?.current_week ?? 1}
                    className="w-16 rounded-xl border border-white/20 bg-dark-bg px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
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
          ))}

          {rows.length === 0 && !usersError && (
            <p className="text-sm text-white/40">No users found.</p>
          )}
        </div>

      </div>
    </div>
  )
}
