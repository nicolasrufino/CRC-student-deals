'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CHICAGO_CAMPUSES, Campus } from '@/lib/campuses'

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
  'harold-washington': 'ccc.edu',
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
  'thornton': 'thorntoncc.edu',
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
  'american-islamic': 'aicusa.edu',
  'national-louis': 'nl.edu',
}

const SCHOOL_LOGO_OVERRIDES: Record<string, string> = {
  'depaul-loop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DePaul_Athletics_Logo_NEW2025.png/330px-DePaul_Athletics_Logo_NEW2025.png',
  'depaul-lincoln-park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/DePaul_Athletics_Logo_NEW2025.png/330px-DePaul_Athletics_Logo_NEW2025.png',
  'iit': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Illinois_Institute_of_Technology_%28seal%29.svg/330px-Illinois_Institute_of_Technology_%28seal%29.svg.png',
}

export default function CampusSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Campus[]>([])
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 1) {
      setResults([])
      setOpen(false)
      return
    }

    const q = query.toLowerCase()
    const filtered = CHICAGO_CAMPUSES.filter(campus =>
      campus.name.toLowerCase().includes(q) ||
      campus.university.toLowerCase().includes(q) ||
      campus.aliases?.some(a => a.includes(q))
    )
    setResults(filtered)
    setOpen(filtered.length > 0)
  }, [query])

  useEffect(() => {
    setHighlightedIndex(0)
  }, [results])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (campus: Campus) => {
    setQuery(campus.name)
    setOpen(false)
    router.push(`/map?campus=${campus.id}&lat=${campus.lat}&lng=${campus.lng}&name=${encodeURIComponent(campus.name)}`)
  }

  return (
    <div className="relative w-full max-w-lg">
      {/* Search input */}
      <div className="flex items-center rounded-full shadow-lg border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 px-5 py-4 flex-1">
          <svg className="w-5 h-5 shrink-0 text-gray-400" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your campus or university"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setHighlightedIndex(i => Math.min(i + 1, results.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setHighlightedIndex(i => Math.max(i - 1, 0))
              } else if (e.key === 'Enter' && results.length > 0) {
                handleSelect(results[highlightedIndex])
              }
            }}
            className="flex-1 text-sm outline-none placeholder-gray-400"
            style={{ background: 'transparent', color: 'var(--text-primary)' }}
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none">
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => {
            if (results.length > 0 && query) {
              handleSelect(results[highlightedIndex])
            } else if (!query) {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    router.push(`/map?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&name=Near you`)
                  },
                  () => {
                    router.push('/map')
                  }
                )
              } else {
                router.push('/map')
              }
            }
          }}
          className="text-white text-sm font-bold px-6 py-4 transition-all hover:opacity-90 whitespace-nowrap"
          style={{ background: '#9D00FF' }}>
          Find Deals →
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border overflow-y-auto z-[200] max-h-72"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          {results.map((campus, index) => (
            <button
              key={campus.id}
              onClick={() => handleSelect(campus)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className="w-full flex items-center gap-3 px-5 py-4 transition-all text-left border-b last:border-0"
              style={{
                background: index === highlightedIndex ? 'var(--bg-secondary)' : 'var(--card)',
                borderColor: 'var(--border)',
              }}>
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-gray-100"
                style={{ background: index === highlightedIndex ? '#ede0ff' : '#f5f0ff' }}>
                {SCHOOL_DOMAINS[campus.id] ? (
                  <img
                    src={SCHOOL_LOGO_OVERRIDES[campus.id] ?? `https://www.google.com/s2/favicons?domain=${SCHOOL_DOMAINS[campus.id]}&sz=32`}
                    alt={campus.name}
                    className="w-5 h-5 object-contain"
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                      const fb = e.currentTarget.nextElementSibling as HTMLElement | null
                      if (fb) fb.style.display = ''
                    }}
                  />
                ) : null}
                <span style={{ color: '#9D00FF', display: SCHOOL_DOMAINS[campus.id] ? 'none' : '' }} className="text-sm">🎓</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{campus.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{campus.university}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
