import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user already exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, edu_verified')
        .eq('id', data.user.id)
        .single()

      if (!existingUser) {
        // New user — create their record
        const emailPrefix = data.user.email?.split('@')[0]
          ?.toLowerCase()
          ?.replace(/[^a-z0-9_.]/g, '')
          ?.slice(0, 20) || 'user'

        await supabase.from('users').insert({
          id: data.user.id,
          display_name: data.user.user_metadata?.full_name || emailPrefix,
          username: emailPrefix,
          edu_verified: false,
        })
        // Send to onboarding
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      // Returning user
      if (!existingUser.edu_verified) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      return NextResponse.redirect(`${origin}/map?requestLocation=true`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`)
}