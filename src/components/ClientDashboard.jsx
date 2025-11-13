import { useEffect, useMemo, useState } from 'react'
import GigCard from './GigCard'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ClientDashboard() {
  const [user, setUser] = useState(null)
  const [gigs, setGigs] = useState([])
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('Hi! I would love to work with you.')
  const [price, setPrice] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const init = async () => {
      // Create or fetch a demo client
      const existing = sessionStorage.getItem('clientId')
      let clientId = existing
      if (!existing) {
        const res = await fetch(`${API}/api/users?role=client`)
        const list = await res.json()
        if (list.length) {
          clientId = list[0].id
        } else {
          const created = await fetch(`${API}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Demo Client', email: 'client@example.com', role: 'client' })
          }).then(r => r.json())
          clientId = created.id
        }
        sessionStorage.setItem('clientId', clientId)
      }
      setUser({ id: clientId, name: 'Demo Client' })
      await loadGigs()
    }
    init()
  }, [])

  const loadGigs = async () => {
    const res = await fetch(`${API}/api/gigs`)
    const data = await res.json()
    setGigs(data)
  }

  const canSend = useMemo(() => selected && user?.id && message.length >= 5, [selected, user, message])

  const sendProposal = async () => {
    setNotice('')
    const payload = { gig_id: selected.id, client_id: user.id, message, offered_price: price ? parseFloat(price) : undefined }
    const res = await fetch(`${API}/api/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      setSelected(null)
      setMessage('Hi! I would love to work with you.')
      setPrice('')
      setNotice('Proposal sent!')
    } else {
      setNotice('Failed to send proposal')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Client Dashboard</h2>
      <p className="text-gray-600 mb-6">Browse gigs and send proposals.</p>

      {notice && <div className="mb-4 p-3 rounded bg-green-50 text-green-700">{notice}</div>}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          {gigs.map(g => (
            <GigCard key={g.id} gig={g} onSelect={setSelected} />
          ))}
        </div>
        <div className="bg-white border rounded-lg p-4 sticky top-4 h-fit">
          <h3 className="font-semibold mb-2">Proposal</h3>
          <div className="text-sm text-gray-600 mb-2">
            {selected ? (
              <>
                <p>To: <span className="font-medium">{selected.creator_name}</span></p>
                <p>Gig: <span className="font-medium">{selected.title}</span></p>
              </>
            ) : (
              <p>Select a gig to propose</p>
            )}
          </div>
          <textarea className="w-full border rounded p-2 mb-2" rows={4} value={message} onChange={e => setMessage(e.target.value)} />
          <input placeholder="Offer price (optional)" className="w-full border rounded p-2 mb-2" value={price} onChange={e => setPrice(e.target.value)} />
          <button disabled={!canSend} onClick={sendProposal} className="w-full bg-blue-600 disabled:bg-gray-300 text-white rounded py-2 font-semibold">Send Proposal</button>
        </div>
      </div>
    </div>
  )
}
