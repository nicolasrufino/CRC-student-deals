'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Suspense } from 'react'

function EduConfirmContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = createClient()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirm = async () => {
      // Supabase automatically exchanges the token from the URL hash on load.
      // Wait briefly for the session to be established.
      await new Promise(r => setTimeout(r, 800))

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session) {
        setErrorMsg('Verification link is invalid or expired. Please try again.')
        setStatus('error')
        return
      }

      // Read the original user ID from the query param embedded in the redirect URL
      const uid = searchParams.get('uid')
      if (!uid) {
        setErrorMsg('Could not identify your account. Please try verifying again.')
        setStatus('error')
        return
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ edu_verified: true })
        .eq('id', uid)

      if (updateError) {
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    }

    confirm()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'var(--bg)' }}>
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: '#9D00FF', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Verifying your student email...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8"
        style={{ background: 'var(--bg)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <p className="font-bold text-lg text-center"
          style={{ fontFamily: 'var(--font-viga)', color: 'var(--text-primary)' }}>
          Verification failed
        </p>
        <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>{errorMsg}</p>
        <Link href="/verify-edu"
          className="mt-2 px-6 py-3 rounded-full text-sm font-bold text-white"
          style={{ background: '#9D00FF' }}>
          Try again
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8"
      style={{ background: 'var(--bg)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9D00FF" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <p className="font-bold text-xl text-center"
        style={{ fontFamily: 'var(--font-viga)', color: 'var(--text-primary)' }}>
        You're verified!
      </p>
      <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
        Your student status has been confirmed. You now have access to all student perks on Yapa.
      </p>
      <Link href="/profile"
        className="mt-2 px-6 py-3 rounded-full text-sm font-bold text-white"
        style={{ background: '#9D00FF' }}>
        Back to profile
      </Link>
    </div>
  )
}

export default function EduConfirmPage() {
  return (
    <Suspense>
      <EduConfirmContent />
    </Suspense>
  )
}
