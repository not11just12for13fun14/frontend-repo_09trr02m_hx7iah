import { useState } from 'react'
import Clients from './components/Clients'
import Campaigns from './components/Campaigns'
import MediaPlan from './components/MediaPlan'
import Actions from './components/Actions'

function App() {
  const [tab, setTab] = useState('resumen')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08),transparent_40%)]"></div>

      <header className="relative z-10 border-b border-white/10 bg-slate-900/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src="/flame-icon.svg" className="w-8 h-8" />
          <h1 className="text-white font-semibold text-lg">Gestor de Campañas</h1>
          <nav className="ml-auto flex gap-2">
            {[
              {k:'resumen', t:'Resumen'},
              {k:'clientes', t:'Clientes'},
              {k:'campanas', t:'Campañas'},
              {k:'medios', t:'Plan de Medios'},
              {k:'acciones', t:'Acciones'},
            ].map(x => (
              <button key={x.k} onClick={()=>setTab(x.k)} className={`px-3 py-1.5 rounded-lg text-sm transition ${tab===x.k ? 'bg-blue-500 text-white' : 'text-blue-200 hover:bg-white/5'}`}>
                {x.t}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {tab==='resumen' && (
          <div className="grid md:grid-cols-3 gap-4">
            <StatCard title="Clientes" endpoint="/clients" />
            <StatCard title="Campañas" endpoint="/campaigns" />
            <StatCard title="Medios" endpoint="/media-plan" />
          </div>
        )}
        {tab==='clientes' && <Clients />}
        {tab==='campanas' && <Campaigns />}
        {tab==='medios' && <MediaPlan />}
        {tab==='acciones' && <Actions />}
      </main>
    </div>
  )
}

const API = import.meta.env.VITE_BACKEND_URL
function StatCard({ title, endpoint }){
  const [count, setCount] = useState(0)
  useState(()=>{ // run once
    fetch(`${API}${endpoint}`).then(r=>r.json()).then(d=>setCount(d.length||0))
  }, [])
  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
      <p className="text-blue-200 text-sm">{title}</p>
      <p className="text-3xl font-semibold text-white mt-1">{count}</p>
    </div>
  )
}

export default App
