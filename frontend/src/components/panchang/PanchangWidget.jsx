import React, { useEffect, useState } from 'react'
import axios from 'axios'

const defaultLocations = [
  { name: 'Delhi', lat: 28.6139, lon: 77.2090, tzone: 5.5 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, tzone: 5.5 }
]

const PanchangWidget = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      let loc = defaultLocations[0]
      try {
        await new Promise((resolve) => {
          if (!navigator.geolocation) return resolve()
          navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords
            loc = { name: 'Your Location', lat: latitude, lon: longitude, tzone: 5.5 }
            resolve()
          }, () => resolve(), { timeout: 3000 })
        })
      } catch {}

      try {
        const now = new Date()
        const date = now.toISOString().slice(0, 10)
        // tzone best-effort: assume 5.5 for India; frontend could compute via Time Zone API (already done in Kundli form)
        const res = await axios.post('/api/consultation/panchang/', { date, lat: loc.lat, lon: loc.lon, tzone: loc.tzone })
        setData(res.data)
      } catch (e) {
        setError('Unable to load Panchang')
      }
    }
    run()
  }, [])

  const getField = (obj, keys) => keys.find(k => obj?.[k]) && obj[keys.find(k => obj?.[k])]

  const tithi = getField(data, ['tithi_name', 'tithi', 'tithiDetails'])
  const nakshatra = getField(data, ['nakshatra_name', 'nakshatra'])
  const yog = getField(data, ['yog_name', 'yog'])
  const rahu = data?.rahu_kaal || data?.rahuKaal
  const rahuStart = rahu?.start || rahu?.start_time
  const rahuEnd = rahu?.end || rahu?.end_time

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Daily Panchang</h3>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      {data ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-xs text-slate-500">Tithi</p>
            <p className="text-sm font-medium text-slate-800">{typeof tithi === 'string' ? tithi : tithi?.name || '-'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-xs text-slate-500">Nakshatra</p>
            <p className="text-sm font-medium text-slate-800">{typeof nakshatra === 'string' ? nakshatra : nakshatra?.name || '-'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-xs text-slate-500">Yog</p>
            <p className="text-sm font-medium text-slate-800">{typeof yog === 'string' ? yog : yog?.name || '-'}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-xs text-slate-500">Rahu Kaal</p>
            <p className="text-sm font-medium text-slate-800">{rahuStart || '-'} → {rahuEnd || '-'}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500 mt-2">Loading...</p>
      )}
    </div>
  )
}

export default PanchangWidget