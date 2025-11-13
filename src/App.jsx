import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'

function Home() {
  return (
    <div>
      <Navbar />
      <header className="bg-gradient-to-br from-blue-50 to-purple-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">GIGS Marketplace</h1>
          <p className="mt-4 text-gray-700 max-w-2xl">A modern two-sided talent marketplace. Creators post gigs. Clients discover, connect, and collaborate. Minimal demo with persistent storage.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/creator" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Creator Dashboard</Link>
            <Link to="/client" className="bg-gray-900 text-white px-4 py-2 rounded font-semibold">Client Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">How it works</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Creators publish gigs with pricing and categories.</li>
            <li>Clients browse gigs and send proposals.</li>
            <li>Everything is stored in a database for persistence.</li>
          </ol>
        </div>
        <aside className="bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-blue-700">
            <li><Link to="/creator" className="hover:underline">Open Creator Dashboard</Link></li>
            <li><Link to="/client" className="hover:underline">Open Client Dashboard</Link></li>
            <li><a href="/test" className="hover:underline">System Status</a></li>
          </ul>
        </aside>
      </main>
    </div>
  )
}

export default Home
