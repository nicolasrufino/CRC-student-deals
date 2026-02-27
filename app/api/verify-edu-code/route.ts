import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { userId, code } = await req.json()

  if (!userId || !code) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from('edu_verifications')
    .select('*')
    .eq('user_id', userId)
    .eq('code', code)
    .eq('verified', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!data) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  // Mark verified in both tables
  await Promise.all([
    supabase.from('edu_verifications').update({ verified: true }).eq('user_id', userId),
    supabase.from('users').update({ edu_verified: true }).eq('id', userId),
  ])

  return NextResponse.json({ success: true })
}
