'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleReset = async () => {
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) setError(error.message)
    else {
      setSuccess(true)
      setTimeout(() => router.push('/map'), 2000)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ fontFamily: 'var(--font-dm)', background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4 p-12 max-w-sm w-full">

        <span style={{ fontFamily: 'var(--font-viga)', color: 'var(--text-primary)' }}
          className="text-3xl mb-2">
          my<span style={{ color: '#9D00FF' }}>Yapa</span>
        </span>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold text-sm">Password updated!</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Redirecting you to the map...</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Set a new password</p>

            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded-full px-5 py-4 text-sm outline-none focus:border-[#9D00FF] transition-all"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border rounded-full px-5 py-4 text-sm outline-none focus:border-[#9D00FF] transition-all"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />

            {error && <p className="text-red-500 text-xs w-full px-2">{error}</p>}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full text-white rounded-full px-6 py-4 text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#9D00FF' }}>
              {loading ? 'Updating...' : 'Update password →'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}
