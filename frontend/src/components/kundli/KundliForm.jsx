import React, { useState } from 'react'
import axios from 'axios'
import LocationSelector from './LocationSelector'

const KundliForm = () => {
  const [form, setForm] = useState({
    date: '',
    time: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [location, setLocation] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const [year, month, day] = form.date.split('-').map(Number)
      const [hour, minute] = form.time.split(':').map(Number)
      if (!location?.lat || !location?.lon) {
        throw new Error('Please select country, state, and city to resolve location')
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      const timestamp = Math.floor(Date.UTC(year, month - 1, day, hour, minute, 0) / 1000)
      let tzone = 5.5
      if (apiKey) {
        const tzUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lon}&timestamp=${timestamp}&key=${apiKey}`
        const tzRes = await fetch(tzUrl)
        const tzJson = await tzRes.json()
        if (tzJson && typeof tzJson.rawOffset === 'number') {
          tzone = (tzJson.rawOffset + (tzJson.dstOffset || 0)) / 3600
        }
      }

      const payload = {
        year, month, day, hour, minute,
        lat: location.lat,
        lon: location.lon,
        tzone
      }

      const res = await axios.post('/api/kundli/generate/', payload)
      setResult(res.data)
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to generate kundli. Please check inputs.')
    } finally {
      setLoading(false)
    }
  }

  const renderPlanetTable = () => {
    const data = result?.data || result
    const planets = data?.planets || data?.planet_details || data?.planet_positions

    if (!Array.isArray(planets)) return null

    return (
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm border border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 border-b">Planet</th>
              <th className="p-2 border-b">Sign</th>
              <th className="p-2 border-b">Degree</th>
              <th className="p-2 border-b">House</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-slate-50">
                <td className="p-2 border-b">{p.name || p.planet || '-'}</td>
                <td className="p-2 border-b">{p.sign || p.rashi || '-'}</td>
                <td className="p-2 border-b">{p.degree || p.deg || '-'}</td>
                <td className="p-2 border-b">{p.house || p.bhava || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Kundli Generation</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Date (YYYY-MM-DD)</label>
          <input name="date" value={form.date} onChange={handleChange} type="date" className="w-full border-slate-300 rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">Time (HH:MM)</label>
          <input name="time" value={form.time} onChange={handleChange} type="time" className="w-full border-slate-300 rounded px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <LocationSelector onLocation={setLocation} />
        </div>
        <div className="flex items-end">
          <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Kundli'}
          </button>
        </div>
      </form>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Planetary Positions</h3>
          {location && (
            <div className="mb-3 text-xs text-slate-500">Location: {location.city}, {location.state}, {location.country} — ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})</div>
          )}
          {renderPlanetTable() || <pre className="bg-slate-50 p-3 rounded border border-slate-200 overflow-x-auto text-xs">{JSON.stringify(result, null, 2)}</pre>}
        </div>
      )}
    </div>
  )
}

export default KundliForm