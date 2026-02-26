'use client'

interface Place {
  id: string
  name: string
  lat: number
  lng: number
  discount_description: string
  category: string[]
  avg_rating: number
  address: string
}

interface PlaceDrawerProps {
  place: Place | null
  onClose: () => void
}

export default function PlaceDrawer({ place, onClose }: PlaceDrawerProps) {
  if (!place) return null

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6 pb-10"
        style={{
          fontFamily: 'var(--font-dm)',
          background: 'var(--card)',
          borderTop: '1px solid var(--border)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
        }}>

        {/* Drag handle */}
        <div className="flex justify-center pt-1 pb-4 -mt-2">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-xl"
          style={{ color: 'var(--text-secondary)' }}>
          ✕
        </button>

        {/* Discount badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
          style={{ background: '#9D00FF' }}>
          🎓 {place.discount_description}
        </div>

        {/* Name */}
        <h2 style={{ fontFamily: 'var(--font-viga)', color: 'var(--text-primary)' }}
          className="text-2xl mb-1">
          {place.name}
        </h2>

        {/* Address */}
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{place.address}</p>

        {/* Rating */}
        {place.avg_rating > 0 && (
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            ⭐ {place.avg_rating.toFixed(1)}
          </p>
        )}

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {place.category?.map(cat => (
            <span key={cat}
              className="px-3 py-1 rounded-full text-xs border capitalize"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              {cat}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border rounded-full py-3 text-sm font-semibold transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            Get Directions →
          </a>
          <button
            className="flex-1 text-white rounded-full py-3 text-sm font-bold hover:opacity-90 transition-all"
            style={{ background: '#9D00FF' }}>
            View Menu & Order
          </button>
        </div>
      </div>
    </>
  )
}