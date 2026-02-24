'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import FilterBar from '@/components/map/FilterBar'
import PlaceDrawer from '@/components/map/PlaceDrawer'
import DiscoverView from '@/components/map/DiscoverView'
import { createClient } from '@/lib/supabase/client'

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false })

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

const SAMPLE_PLACES: Place[] = [
  // Food & Coffee
  {
    id: '1',
    name: 'Intelligentsia Coffee',
    lat: 41.8948,
    lng: -87.6365,
    discount_description: '15% off all drinks',
    category: ['coffee'],
    avg_rating: 4.5,
    address: '53 W Jackson Blvd, Chicago'
  },
  {
    id: '2',
    name: 'Cafecito',
    lat: 41.8756,
    lng: -87.6244,
    discount_description: '10% off orders',
    category: ['food', 'coffee'],
    avg_rating: 4.3,
    address: '26 E Congress Pkwy, Chicago'
  },
  {
    id: '3',
    name: 'Pizano\'s Pizza',
    lat: 41.8827,
    lng: -87.6278,
    discount_description: '20% off with student ID',
    category: ['food'],
    avg_rating: 4.4,
    address: '61 E Madison St, Chicago'
  },
  // Museums — free
  {
    id: '4',
    name: 'Chicago Cultural Center',
    lat: 41.8836,
    lng: -87.6249,
    discount_description: 'Always free for everyone',
    category: ['museums'],
    avg_rating: 4.8,
    address: '78 E Washington St, Chicago'
  },
  {
    id: '5',
    name: 'Museum of Contemporary Art',
    lat: 41.8970,
    lng: -87.6211,
    discount_description: 'Free Tuesdays 5–9pm',
    category: ['museums'],
    avg_rating: 4.6,
    address: '220 E Chicago Ave, Chicago'
  },
  {
    id: '6',
    name: 'National Museum of Mexican Art',
    lat: 41.8558,
    lng: -87.6731,
    discount_description: 'Always free admission',
    category: ['museums'],
    avg_rating: 4.7,
    address: '1852 W 19th St, Chicago'
  },
  {
    id: '7',
    name: 'Art Institute of Chicago',
    lat: 41.8796,
    lng: -87.6237,
    discount_description: 'Free with university student ID',
    category: ['museums'],
    avg_rating: 4.9,
    address: '111 S Michigan Ave, Chicago'
  },
  {
    id: '8',
    name: 'DuSable Black History Museum',
    lat: 41.7924,
    lng: -87.6065,
    discount_description: 'Free every Wednesday',
    category: ['museums'],
    avg_rating: 4.7,
    address: '740 E 56th Pl, Chicago'
  },
  {
    id: '9',
    name: 'Museum of Contemporary Photography',
    lat: 41.8724,
    lng: -87.6243,
    discount_description: 'Always free admission',
    category: ['museums'],
    avg_rating: 4.5,
    address: '600 S Michigan Ave, Chicago'
  },
  {
    id: '10',
    name: 'Hyde Park Art Center',
    lat: 41.7991,
    lng: -87.5950,
    discount_description: 'Always free admission',
    category: ['museums'],
    avg_rating: 4.4,
    address: '5020 S Cornell Ave, Chicago'
  },
  // Sports
  {
    id: '11',
    name: 'Chicago Bulls',
    lat: 41.8807,
    lng: -87.6742,
    discount_description: 'Student tickets from $20 with .edu',
    category: ['sports'],
    avg_rating: 4.6,
    address: '1901 W Madison St, Chicago'
  },
  {
    id: '12',
    name: 'Chicago Blackhawks',
    lat: 41.8807,
    lng: -87.6742,
    discount_description: 'Student rush tickets with .edu',
    category: ['sports'],
    avg_rating: 4.7,
    address: '1901 W Madison St, Chicago'
  },
  {
    id: '13',
    name: 'Chicago Cubs',
    lat: 41.9484,
    lng: -87.6553,
    discount_description: 'Last-minute tickets with .edu email',
    category: ['sports'],
    avg_rating: 4.8,
    address: '1060 W Addison St, Chicago'
  },
  // Theater
  {
    id: '14',
    name: 'Goodman Theatre',
    lat: 41.8836,
    lng: -87.6319,
    discount_description: '$5 tickets via Teen Arts Pass',
    category: ['theater'],
    avg_rating: 4.7,
    address: '170 N Dearborn St, Chicago'
  },
  {
    id: '15',
    name: 'Lyric Opera of Chicago',
    lat: 41.8858,
    lng: -87.6367,
    discount_description: '$5 tickets via Teen Arts Pass',
    category: ['theater'],
    avg_rating: 4.8,
    address: '20 N Wacker Dr, Chicago'
  },
]

function MapPageContent() {
  const [tab, setTab] = useState<'map' | 'discover'>('map')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [user, setUser] = useState<any>(null)
  const searchParams = useSearchParams()
  const supabase = createClient()

  const campusLat = searchParams.get('lat')
  const campusLng = searchParams.get('lng')
  const campusName = searchParams.get('name')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const filteredPlaces = SAMPLE_PLACES.filter(place => {
    const matchesCategory = category === 'all' || place.category.includes(category)
    const matchesSearch = search === '' ||
      place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.discount_description.toLowerCase().includes(search.toLowerCase()) ||
      place.category.some(c => c.toLowerCase().includes(search.toLowerCase())) ||
      place.address.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">

      {/* TOP NAV */}
      <div className="bg-white border-b border-gray-100 px-4 pt-3 pb-0 z-10 shrink-0">

        {/* Row 1 — logo + search + avatar */}
        <div className="flex items-center gap-3 mb-3">
          <Link href="/" style={{ fontFamily: 'var(--font-viga)' }}
            className="text-xl text-gray-900 shrink-0">
            my<span style={{ color: '#9D00FF' }}>Yapa</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search matcha, museums, pizza..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-900 bg-transparent outline-none placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            )}
          </div>

          {/* Avatar or sign in */}
          {user ? (
            <Link href="/profile"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: '#9D00FF' }}>
              {user.email?.[0].toUpperCase()}
            </Link>
          ) : (
            <Link href="/auth/login"
              className="text-xs font-semibold text-white px-3 py-2 rounded-full shrink-0"
              style={{ background: '#9D00FF' }}>
              Sign in
            </Link>
          )}
        </div>

        {/* Row 2 — Map / Discover tabs + filters */}
        <div className="flex items-center gap-4 mb-0">
          {/* Tabs */}
          <div className="flex shrink-0 border-b-0">
            {(['map', 'discover'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-all"
                style={{
                  borderColor: tab === t ? '#9D00FF' : 'transparent',
                  color: tab === t ? '#9D00FF' : '#9ca3af',
                }}>
                {t === 'map' ? 'Map' : 'Discover'}
              </button>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex-1 overflow-x-auto pb-2">
            <FilterBar selected={category} onChange={setCategory} />
          </div>
        </div>
      </div>

      {/* Campus banner */}
      {campusName && (
        <div className="bg-purple-50 border-b border-purple-100 px-4 py-2 flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold text-purple-700">
            Showing spots near {campusName}
          </span>
          <Link href="/map" className="text-xs text-purple-400 hover:text-purple-600">
            Clear
          </Link>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden">
        {tab === 'map' ? (
          <MapView
            places={filteredPlaces}
            onPlaceClick={setSelectedPlace}
            selectedPlace={selectedPlace}
            center={campusLat && campusLng
              ? { lat: parseFloat(campusLat), lng: parseFloat(campusLng) }
              : undefined}
          />
        ) : (
          <DiscoverView
            places={filteredPlaces}
            onPlaceClick={setSelectedPlace}
          />
        )}
      </div>

      {/* Place drawer */}
      <PlaceDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense>
      <MapPageContent />
    </Suspense>
  )
}
