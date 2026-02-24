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
        className="fixed inset-0 z-20"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-3xl shadow-2xl p-6 pb-10"
        style={{ fontFamily: 'var(--font-dm)' }}>

        {/* Handle */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl">
          ✕
        </button>

        {/* Discount badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
          style={{ background: '#9D00FF' }}>
          🎓 {place.discount_description}
        </div>

        {/* Name */}
        <h2 style={{ fontFamily: 'var(--font-viga)' }}
          className="text-2xl text-gray-900 mb-1">
          {place.name}
        </h2>

        {/* Address */}
        <p className="text-sm text-gray-500 mb-1">{place.address}</p>

        {/* Rating */}
        {place.avg_rating > 0 && (
          <p className="text-sm text-gray-900 font-semibold mb-4">
            ⭐ {place.avg_rating.toFixed(1)}
          </p>
        )}

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {place.category?.map(cat => (
            <span key={cat}
              className="px-3 py-1 rounded-full text-xs border border-gray-200 text-gray-600 capitalize">
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
            className="flex-1 text-center border border-gray-200 rounded-full py-3 text-sm font-semibold text-gray-900 hover:border-gray-400 transition-all">
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