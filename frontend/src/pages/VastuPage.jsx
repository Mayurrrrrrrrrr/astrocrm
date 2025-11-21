import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VastuCompass from '../components/maps/VastuCompass'

const VastuPage = () => {
  const [tab, setTab] = useState('compass')
  const [tips, setTips] = useState([])
  const [direction, setDirection] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const params = {}
        if (direction) params.direction = direction
        const res = await axios.get('/api/vastu/tips/', { params })
        setTips(res.data)
      } catch (e) {
        setTips([])
      }
    })()
  }, [direction])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setTab('compass')} className={`px-3 py-2 rounded ${tab==='compass' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Compass Map</button>
        <button onClick={() => setTab('guide')} className={`px-3 py-2 rounded ${tab==='guide' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>Vastu Guide</button>
      </div>

      {tab === 'compass' && <VastuCompass />}

      {tab === 'guide' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm text-slate-600">Filter Direction:</label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm">
              <option value="">All</option>
              <option value="N">North</option>
              <option value="NE">North-East</option>
              <option value="E">East</option>
              <option value="SE">South-East</option>
              <option value="S">South</option>
              <option value="SW">South-West</option>
              <option value="W">West</option>
              <option value="NW">North-West</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500">{t.category} • {t.direction}</div>
                <h3 className="font-bold text-slate-800 mt-1">{t.title}</h3>
                <p className="text-sm text-slate-700 mt-2">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VastuPage