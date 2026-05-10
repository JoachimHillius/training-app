'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function assignProgram(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const userId = formData.get('user_id') as string
  const assignedProgram = (formData.get('assigned_program') as string) || null
  const currentWeek = parseInt(formData.get('current_week') as string, 10) || 1

  const adminClient = createAdminClient()

  await adminClient.from('profiles').upsert(
    {
      user_id: userId,
      assigned_program: assignedProgram,
      current_week: currentWeek,
    },
    { onConflict: 'user_id' }
  )

  redirect(`/admin?saved=${userId}`)
}
