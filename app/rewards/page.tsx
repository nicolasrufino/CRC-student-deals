'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RewardsComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('waitlist').insert({ email, type: 'rewards' })
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6"
      style={{ fontFamily: 'var(--font-dm)' }}>
      <div className="max-w-sm w-full text-center flex flex-col items-center gap-6">
        <Link href="/" style={{ fontFamily: 'var(--font-viga)' }}
          className="text-2xl text-gray-900">
          my<span style={{ color: '#9D00FF' }}>Yapa</span>
        </Link>

        <div className="text-6xl">🎁</div>

        <div>
          <h1 style={{ fontFamily: 'var(--font-viga)' }}
            className="text-3xl text-gray-900 mb-2">
            Rewards are coming
          </h1>
          <p className="text-sm text-gray-600">
            We're working hard to build something really cool — earn points every time you use your student discount and redeem them for free stuff.
          </p>
        </div>

        {submitted ? (
          <div className="w-full bg-purple-50 border border-purple-200 rounded-2xl px-6 py-4">
            <p className="text-sm font-semibold text-purple-700">You're on the list! 🎉</p>
            <p className="text-xs text-purple-500 mt-1">We'll email you when rewards launch.</p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <p className="text-sm text-gray-900 font-semibold">Get notified when it's ready</p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-5 py-4 text-sm text-gray-900 outline-none focus:border-[#9D00FF] transition-all"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full text-white rounded-full py-4 text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
              style={{ background: '#9D00FF' }}>
              {loading ? 'Subscribing...' : 'Notify me →'}
            </button>
          </div>
        )}

        <Link href="/map"
          className="text-xs text-gray-400 hover:text-gray-600 underline">
          Back to map
        </Link>
      </div>
    </main>
  )
}
