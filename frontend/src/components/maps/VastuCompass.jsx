import React, { useEffect, useRef, useState } from 'react'

const loadGoogleMaps = (apiKey) => new Promise((resolve, reject) => {
  if (window.google && window.google.maps) return resolve()
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = resolve
  script.onerror = reject
  document.head.appendChild(script)
})

const VastuCompass = () => {
  const mapRef = useRef(null)
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [map, setMap] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          setError('Google Maps API key is missing. Add VITE_GOOGLE_MAPS_API_KEY to your .env.')
          return
        }
        await loadGoogleMaps(apiKey)

        const center = { lat: 28.6139, lng: 77.2090 }
        const m = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 18,
          mapTypeId: 'satellite'
        })
        setMap(m)

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current)
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.geometry && place.geometry.location) {
            m.setCenter(place.geometry.location)
          }
        })
      } catch (e) {
        setError('Failed to load Google Maps')
      }
    }
    init()
  }, [])

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex gap-2">
        <input ref={inputRef} type="text" placeholder="Search address" className="flex-1 border border-slate-300 rounded px-3 py-2" />
      </div>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}
      <div className="relative w-full h-[70vh] rounded overflow-hidden border border-slate-200">
        <div ref={mapRef} className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none flex">
          <div className="relative w-full h-full grid grid-cols-8 grid-rows-8">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="border border-white/30"></div>
            ))}
          </div>
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">N</div>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">S</div>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">E</div>
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">W</div>
        </div>
      </div>
    </div>
  )
}

export default VastuCompass