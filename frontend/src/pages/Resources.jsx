import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Resources = () => {
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/content/blogs/')
        setBlogs(res.data)
      } catch (e) {
        setError('Unable to load resources')
      }
    })()
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Resources</h2>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {blogs.map((b) => (
          <div key={b.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {b.image && <img src={b.image} alt={b.title} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <h3 className="font-bold text-slate-800">{b.title}</h3>
              <p className="text-xs text-slate-500 mt-1">By {b.author_name || 'AstroCRM'} • {new Date(b.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-slate-700 mt-2 line-clamp-3">{b.content?.slice(0, 200)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Resources