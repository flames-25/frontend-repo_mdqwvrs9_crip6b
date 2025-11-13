import { useEffect, useMemo, useState } from 'react'
import GigCard from './GigCard'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function CreatorDashboard() {
  const [user, setUser] = useState(null)
  const [gigs, setGigs] = useState([])
  const [form, setForm] = useState({ title: '', description: '', category: 'Design', price: 100 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Bootstraps a demo creator account on first load
    const init = async () => {
      try {
        setLoading(true)
        // Create or fetch a demo creator
        const existing = sessionStorage.getItem('creatorId')
        let creatorId = existing
        if (!existing) {
          const res = await fetch(`${API}/api/users?role=creator`)
          const list = await res.json()
          if (list.length) {
            creatorId = list[0].id
          } else {
            const created = await fetch(`${API}/api/users`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: 'Demo Creator', email: 'creator@example.com', role: 'creator', bio: 'Creates awesome gigs', skills: ['design', 'video'] })
            }).then(r => r.json())
            creatorId = created.id
          }
          sessionStorage.setItem('creatorId', creatorId)
        }
        setUser({ id: creatorId, name: 'Demo Creator' })
        await loadGigs()
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const loadGigs = async () => {
    const res = await fetch(`${API}/api/gigs`)
    const data = await res.json()
    setGigs(data)
  }

  const canSubmit = useMemo(() => form.title && form.description && form.price > 0 && user?.id, [form, user])

  const createGig = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, creator_id: user.id, creator_name: user.name }
      const res = await fetch(`${API}/api/gigs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create gig')
      setForm({ title: '', description: '', category: 'Design', price: 100 })
      await loadGigs()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Creator Dashboard</h2>
      <p className="text-gray-600 mb-6">Post gigs and manage your offerings.</p>

      <form onSubmit={createGig} className="bg-white rounded-lg border p-4 grid gap-3 md:grid-cols-2">
        <input className="border rounded p-2" placeholder="Gig title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="border rounded p-2" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <textarea className="border rounded p-2 md:col-span-2" placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div className="flex items-center gap-2">
          <span className="text-gray-600">$</span>
          <input type="number" className="border rounded p-2 w-32" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} />
        </div>
        <button disabled={!canSubmit || loading} className="bg-blue-600 disabled:bg-gray-300 text-white font-semibold rounded px-4 py-2">
          {loading ? 'Creating...' : 'Create Gig'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gigs.map(g => <GigCard key={g.id} gig={g} />)}
      </div>
    </div>
  )
}
