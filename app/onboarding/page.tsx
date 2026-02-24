'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [step, setStep] = useState<'edu_input' | 'edu_pending' | 'done'>('edu_input')
  const [eduEmail, setEduEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const sendVerification = async () => {
    if (!eduEmail.endsWith('.edu')) {
      setError('Please enter a valid .edu email address')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email: eduEmail,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/edu-confirm`
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setStep('edu_pending')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center"
      style={{ fontFamily: 'var(--font-dm)' }}>
      <div className="flex flex-col items-center gap-6 p-12 max-w-sm w-full">

        <span style={{ fontFamily: 'var(--font-viga)' }}
          className="text-3xl text-gray-900">
          my<span style={{ color: '#9D00FF' }}>Yapa</span>
        </span>

        {step === 'edu_input' && (
          <>
            <div className="text-center">
              <h1 style={{ fontFamily: 'var(--font-viga)' }}
                className="text-2xl text-gray-900 mb-2">
                Verify your student status
              </h1>
              <p className="text-gray-500 text-sm">
                Enter your university .edu email to unlock student discounts
              </p>
            </div>

            <input
              type="email"
              placeholder="you@university.edu"
              value={eduEmail}
              onChange={e => setEduEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-5 py-4 text-sm outline-none focus:border-[#9D00FF] transition-all"
            />

            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}

            <button
  onClick={sendVerification}
  disabled={loading}
  className="w-full text-white rounded-full px-6 py-4 text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
  style={{ background: '#9D00FF' }}>
  {loading ? 'Sending...' : 'Verify my .edu now →'}
</button>

<button
  onClick={() => router.push('/map')}
  className="text-sm text-gray-400 hover:text-gray-600 underline">
  Skip for now, explore the map
</button>
          </>
        )}

        {step === 'edu_pending' && (
          <>
            <div className="text-center">
              <div className="text-5xl mb-4">📬</div>
              <h1 style={{ fontFamily: 'var(--font-viga)' }}
                className="text-2xl text-gray-900 mb-2">
                Check your inbox
              </h1>
              <p className="text-gray-500 text-sm">
                We sent a verification link to<br />
                <span className="font-semibold text-gray-700">{eduEmail}</span>
              </p>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Click the link in your .edu email to verify your student status.
              Once verified you'll be taken to the map automatically.
            </p>

            <button
              onClick={() => setStep('edu_input')}
              className="text-xs text-gray-400 hover:text-gray-600 underline">
              Use a different email
            </button>
          </>
        )}

      </div>
    </main>
  )
}