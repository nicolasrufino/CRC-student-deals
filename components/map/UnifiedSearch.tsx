'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CHICAGO_CAMPUSES, Campus } from '@/lib/campuses'

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

interface UnifiedSearchProps {
  places: Place[]
  onPlaceSelect: (place: Place) => void
  userLocation: { lat: number, lng: number } | null
  campusCenter: { lat: number, lng: number } | null
  campusName: string | null
}

const SCHOOL_DOMAINS: Record<string, string> = {
  'depaul-loop': 'depaul.edu',
  'depaul-lincoln-park': 'depaul.edu',
  'uic': 'uic.edu',
  'uic-west': 'uic.edu',
  'uchicago': 'uchicago.edu',
  'loyola': 'luc.edu',
  'loyola-maywood': 'luc.edu',
  'northwestern': 'northwestern.edu',
  'northwestern-evanston': 'northwestern.edu',
  'columbia-college': 'colum.edu',
  'iit': 'iit.edu',
  'roosevelt': 'roosevelt.edu',
  'saic': 'saic.edu',
  'neiu': 'neiu.edu',
  'chicago-state': 'csu.edu',
  'ccc-harold-washington': 'ccc.edu',
  'ccc-daley': 'ccc.edu',
  'ccc-kennedy-king': 'ccc.edu',
  'ccc-malcolm-x': 'ccc.edu',
  'ccc-olive-harvey': 'ccc.edu',
  'ccc-truman': 'ccc.edu',
  'ccc-wilbur-wright': 'ccc.edu',
  'north-park': 'northpark.edu',
  'concordia': 'cuchicago.edu',
  'dominican': 'dom.edu',
  'elmhurst': 'elmhurst.edu',
  'wheaton': 'wheaton.edu',
  'north-central': 'northcentralcollege.edu',
  'benedictine': 'ben.edu',
  'aurora': 'aurora.edu',
  'governors-state': 'govst.edu',
  'purdue-northwest-hammond': 'pnw.edu',
  'purdue-northwest-westville': 'pnw.edu',
  'valparaiso': 'valpo.edu',
  'iu-northwest': 'iun.edu',
  'college-lake-county': 'clcillinois.edu',
  'lake-forest': 'lakeforest.edu',
  'rosalind-franklin': 'rosalindfranklin.edu',
  'trinity-international': 'tiu.edu',
  'judson': 'judsonu.edu',
  'waubonsee': 'waubonsee.edu',
  'college-dupage': 'cod.edu',
  'moraine-valley': 'morainevalley.edu',
  'south-suburban': 'ssc.edu',
  'prairie-state': 'prairiestate.edu',
  'harper': 'harpercollege.edu',
  'elgin-community': 'elgin.edu',
  'oakton': 'oakton.edu',
  'triton': 'triton.edu',
  'joliet-junior': 'jjc.edu',
  'lewis': 'lewisu.edu',
  'st-francis': 'stfrancis.edu',
  'northern-illinois': 'niu.edu',
  'rush': 'rush.edu',
  'midwestern': 'midwestern.edu',
  'moody': 'moody.edu',
  'national-louis': 'nl.edu',
}

const SCHOOL_LOGO_OVERRIDES: Record<string, string> = {
  'depaul-loop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DePaul_Athletics_Logo_NEW2025.png/330px-DePaul_Athletics_Logo_NEW2025.png',
  'depaul-lincoln-park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DePaul_Athletics_Logo_NEW2025.png/330px-DePaul_Athletics_Logo_NEW2025.png',
  'iit': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Illinois_Institute_of_Technology_%28seal%29.svg/330px-Illinois_Institute_of_Technology_%28seal%29.svg.png',
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3959 // miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function UnifiedSearch({
  places,
  onPlaceSelect,
  userLocation,
  campusCenter,
  campusName,
}: UnifiedSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const refPoint = userLocation || campusCenter || { lat: 41.8781, lng: -87.6298 }

  const campusResults = query.length > 0
    ? CHICAGO_CAMPUSES.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.university.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : []

  const placeResults = query.length > 0
    ? places
        .filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
          p.discount_description.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) =>
          getDistance(refPoint.lat, refPoint.lng, a.lat, a.lng) -
          getDistance(refPoint.lat, refPoint.lng, b.lat, b.lng)
        )
        .slice(0, 5)
    : []

  const allResults = [
    ...campusResults.map(c => ({ type: 'campus' as const, data: c })),
    ...placeResults.map(p => ({ type: 'place' as const, data: p })),
  ]

  useEffect(() => {
    setHighlightedIndex(0)
    setOpen(query.length > 0 && allResults.length > 0)
  }, [query, allResults.length])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleCampusSelect = (campus: Campus) => {
    setQuery(campus.name)
    setOpen(false)
    router.push(`/map?campus=${campus.id}&lat=${campus.lat}&lng=${campus.lng}&name=${encodeURIComponent(campus.name)}`)
  }

  const handlePlaceSelect = (place: Place) => {
    setQuery(place.name)
    setOpen(false)
    onPlaceSelect(place)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(i => Math.min(i + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && allResults.length > 0) {
      const item = allResults[highlightedIndex]
      if (item.type === 'campus') handleCampusSelect(item.data as Campus)
      else handlePlaceSelect(item.data as Place)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative flex-1">
      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder={campusName ? `Search near ${campusName}...` : 'Search campus, matcha, museums...'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => allResults.length > 0 && setOpen(true)}
          className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder-gray-400"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }}
            className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
        )}
      </div>

      {open && (
        <div ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-y-auto z-[100]"
          style={{ maxHeight: '320px' }}>

          {campusResults.length > 0 && (
            <>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Campuses</span>
              </div>
              {campusResults.map((campus, i) => (
                <button
                  key={campus.id}
                  onClick={() => handleCampusSelect(campus)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-b border-gray-50 last:border-0"
                  style={{ background: highlightedIndex === i ? '#f5f0ff' : 'white' }}>
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-gray-100 bg-gray-50">
                    <img
                      src={SCHOOL_LOGO_OVERRIDES[campus.id] || `https://www.google.com/s2/favicons?domain=${SCHOOL_DOMAINS[campus.id]}&sz=32`}
                      alt={campus.name}
                      className="w-5 h-5 object-contain"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{campus.name}</div>
                    <div className="text-xs text-gray-500">{campus.university}</div>
                  </div>
                  {highlightedIndex === i && (
                    <span className="text-xs text-gray-400">↵</span>
                  )}
                </button>
              ))}
            </>
          )}

          {placeResults.length > 0 && (
            <>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  {campusName ? `Near ${campusName}` : userLocation ? 'Near you' : 'Places'}
                </span>
              </div>
              {placeResults.map((place, i) => {
                const globalIndex = campusResults.length + i
                const dist = getDistance(refPoint.lat, refPoint.lng, place.lat, place.lng)
                return (
                  <button
                    key={place.id}
                    onClick={() => handlePlaceSelect(place)}
                    onMouseEnter={() => setHighlightedIndex(globalIndex)}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-b border-gray-50 last:border-0"
                    style={{ background: highlightedIndex === globalIndex ? '#f5f0ff' : 'white' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-base"
                      style={{ background: '#f5f0ff' }}>
                      {place.category?.[0] === 'coffee' ? '☕' :
                       place.category?.[0] === 'food' ? '🍕' :
                       place.category?.[0] === 'museums' ? '🎨' :
                       place.category?.[0] === 'sports' ? '🏟️' :
                       place.category?.[0] === 'theater' ? '🎭' : '📍'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{place.name}</div>
                      <div className="text-xs text-gray-500">{place.discount_description}</div>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0">
                      {dist < 1 ? `${(dist * 5280).toFixed(0)}ft` : `${dist.toFixed(1)}mi`}
                    </div>
                  </button>
                )
              })}
            </>
          )}

          {allResults.length === 0 && query.length > 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No results for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
