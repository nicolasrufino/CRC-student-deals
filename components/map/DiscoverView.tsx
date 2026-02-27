'use client'

import { useState } from 'react'


interface Place {
  id: string
  name: string
  lat: number
  lng: number
  discount_description: string
  category: string[]
  avg_rating: number
  address: string
  image_url?: string
}

interface DiscoverViewProps {
  places: Place[]
  onPlaceClick: (place: Place) => void
  userLocation?: { lat: number, lng: number } | null
  campusCenters?: { lat: number, lng: number, name: string }[]
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function parseDiscount(desc: string): number {
  const match = desc?.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

const CATEGORY_EMOJI: Record<string, string> = {
  coffee: '☕',
  food: '🍕',
  museums: '🎨',
  sports: '🏟️',
  theater: '🎭',
  drinks: '🧃',
}

function PlaceCard({ place, onClick }: { place: Place, onClick: () => void }) {
  return (
    <div onClick={onClick}
      className="rounded-2xl border overflow-hidden transition-all hover:opacity-80 cursor-pointer"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="w-full h-24 overflow-hidden"
        style={{ background: 'var(--bg-secondary)' }}>
        {place.image_url
          ? <img src={place.image_url} alt={place.name}
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          : <div className="w-full h-full flex items-center justify-center text-2xl">
              {CATEGORY_EMOJI[place.category?.[0]] ?? '📍'}
            </div>
        }
      </div>
      <div className="p-3">
        <p className="text-sm font-bold truncate"
          style={{ color: 'var(--text-primary)' }}>{place.name}</p>
        <p className="text-xs truncate mt-0.5"
          style={{ color: 'var(--text-secondary)' }}>{place.address}</p>
        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
          style={{ background: '#9D00FF' }}>
          {place.discount_description}
        </span>
      </div>
    </div>
  )
}

export default function DiscoverView({ places, onPlaceClick, userLocation, campusCenters }: DiscoverViewProps) {
  const hasCampus = !!campusCenters?.length
  const [sortBy, setSortBy] = useState<'distance' | 'discount' | 'alpha'>(hasCampus ? 'distance' : 'alpha')

  const minDistToCampus = (place: Place) =>
    Math.min(...(campusCenters ?? []).map(c => getDistance(c.lat, c.lng, place.lat, place.lng)))

  const sorted = [...places].sort((a, b) => {
    if (sortBy === 'discount') return parseDiscount(b.discount_description) - parseDiscount(a.discount_description)
    if (sortBy === 'distance' && hasCampus) return minDistToCampus(a) - minDistToCampus(b)
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="h-full overflow-y-auto px-4 py-4" style={{ background: 'var(--bg-secondary)' }}>

      {/* Sort row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
          {places.length} spots · Sort:
        </span>
        {hasCampus && (
          <button onClick={() => setSortBy('distance')}
            className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: sortBy === 'distance' ? '#9D00FF' : 'var(--card)',
              color: sortBy === 'distance' ? 'white' : 'var(--text-primary)',
              borderColor: sortBy === 'distance' ? '#9D00FF' : 'var(--border)',
            }}>
            Near campus
          </button>
        )}
        {([['discount', 'Most % off'], ['alpha', 'A–Z']] as const).map(([val, label]) => (
          <button key={val} onClick={() => setSortBy(val)}
            className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
            style={{
              background: sortBy === val ? '#9D00FF' : 'var(--card)',
              color: sortBy === val ? 'white' : 'var(--text-primary)',
              borderColor: sortBy === val ? '#9D00FF' : 'var(--border)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-3">
        {sorted.map(place => (
          <PlaceCard
            key={place.id}
            place={place}
            onClick={() => onPlaceClick(place)}
          />
        ))}

        {places.length === 0 && (
          <div className="col-span-2 text-center py-16" style={{ color: 'var(--text-secondary)' }}>
            <p className="text-sm font-medium">No spots found</p>
            <p className="text-xs mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
