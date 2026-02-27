'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/context/ThemeContext'

export default function PrivatePinDrawer({ pin, onClose, onDelete }: {
  pin: any
  onClose: () => void
  onDelete: (id: string) => void
}) {
  if (!pin) return null

  const { theme } = useTheme()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    setDeleting(true)
    await supabase.from('private_pins').delete().eq('id', pin.id)
    setDeleting(false)
    onDelete(pin.id)
    onClose()
  }

  const getDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`,
      '_blank'
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl flex flex-col"
        style={{
          background: 'var(--card)',
          borderTop: '1px solid var(--border)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
          maxHeight: '60vh',
        }}>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              {/* Diamond icon matching the pin color */}
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: pin.color || '#9D00FF',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-viga)', color: 'var(--text-primary)' }}
                  className="text-xl leading-tight">{pin.name}</h2>
                {pin.address && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {pin.address}
                  </p>
                )}
              </div>
            </div>

            {/* Close button */}
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full shrink-0"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Private badge */}
          <div className="mt-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              Private pin · only you can see this
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-5 pb-6 flex flex-col gap-4">

          {/* Description */}
          {pin.description && (
            <div className="rounded-2xl px-4 py-3"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{pin.description}</p>
            </div>
          )}

          {/* Directions */}
          <button onClick={getDirections}
            className="w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            Directions
          </button>

          {/* Delete */}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border transition-all hover:opacity-70"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: '#ef4444' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span className="text-xs font-semibold">Delete pin</span>
            </button>
          ) : (
            <div className="rounded-2xl border p-4 flex flex-col gap-3"
              style={{ borderColor: '#ef4444', background: theme === 'dark' ? '#2a0a0a' : '#fff5f5' }}>
              <p className="text-sm font-semibold text-center" style={{ color: '#ef4444' }}>
                Delete "{pin.name}"?
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 rounded-full text-sm border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2 rounded-full text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: '#ef4444' }}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
