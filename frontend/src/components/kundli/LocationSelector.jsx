import React, { useEffect, useRef, useState } from 'react'

const loadGoogleMaps = (apiKey) => new Promise((resolve, reject) => {
  if (window.google && window.google.maps && window.google.maps.places) return resolve()
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = resolve
  script.onerror = reject
  document.head.appendChild(script)
})

const LocationSelector = ({ onLocation }) => {
  const countryRef = useRef(null)
  const stateRef = useRef(null)
  const cityRef = useRef(null)
  const [error, setError] = useState('')
  const [countryCode, setCountryCode] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          setError('Google Maps API key missing. Set VITE_GOOGLE_MAPS_API_KEY in .env')
          return
        }
        await loadGoogleMaps(apiKey)

        const countryAutocomplete = new window.google.maps.places.Autocomplete(countryRef.current, {
          types: ['(regions)']
        })
        countryAutocomplete.addListener('place_changed', () => {
          const place = countryAutocomplete.getPlace()
          const comps = place.address_components || []
          const country = comps.find(c => c.types.includes('country'))
          if (country) {
            setCountryCode(country.short_name || '')
          }
        })

        const stateAutocomplete = new window.google.maps.places.Autocomplete(stateRef.current, {
          types: ['(regions)'],
          componentRestrictions: () => countryCode ? { country: countryCode } : undefined
        })

        const cityAutocomplete = new window.google.maps.places.Autocomplete(cityRef.current, {
          types: ['(cities)'],
          componentRestrictions: () => countryCode ? { country: countryCode } : undefined
        })
        cityAutocomplete.addListener('place_changed', () => {
          const place = cityAutocomplete.getPlace()
          if (place && place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat()
            const lon = place.geometry.location.lng()
            const comps = place.address_components || []
            const country = comps.find(c => c.types.includes('country'))
            const state = comps.find(c => c.types.includes('administrative_area_level_1'))
            const city = comps.find(c => c.types.includes('locality')) || comps.find(c => c.types.includes('administrative_area_level_2'))
            onLocation && onLocation({
              country: country?.long_name,
              countryCode: country?.short_name,
              state: state?.long_name,
              city: city?.long_name || place.name,
              lat, lon
            })
          }
        })
      } catch (e) {
        setError('Failed to initialize location selector')
      }
    }
    init()
  }, [countryCode])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label className="block text-sm text-slate-600 mb-1">Country</label>
        <input ref={countryRef} type="text" placeholder="Type country" className="w-full border-slate-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 mb-1">State</label>
        <input ref={stateRef} type="text" placeholder="Type state" className="w-full border-slate-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 mb-1">City</label>
        <input ref={cityRef} type="text" placeholder="Type city" className="w-full border-slate-300 rounded px-3 py-2" />
      </div>
      {error && <div className="md:col-span-3 p-2 bg-red-50 text-red-700 rounded">{error}</div>}
    </div>
  )
}

export default LocationSelector