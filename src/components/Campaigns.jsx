import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Campaigns() {
  const [clients, setClients] = useState([])
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ client_id: '', name: '', start_date: '', end_date: '', budget_total: 0 })

  const load = async () => {
    const [rc, ri] = await Promise.all([
      fetch(`${API}/clients`).then(r=>r.json()),
      fetch(`${API}/campaigns`).then(r=>r.json())
    ])
    setClients(rc)
    setItems(ri)
  }

  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ client_id: '', name: '', start_date: '', end_date: '', budget_total: 0 })
    load()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Campañas</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
        <select className="input" value={form.client_id} onChange={e=>setForm({...form, client_id:e.target.value})} required>
          <option value="">Cliente</option>
          {clients.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="input" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="input" type="date" value={form.start_date} onChange={e=>setForm({...form, start_date:e.target.value})} />
        <input className="input" type="date" value={form.end_date} onChange={e=>setForm({...form, end_date:e.target.value})} />
        <input className="input" type="number" step="0.01" placeholder="Presupuesto total" value={form.budget_total} onChange={e=>setForm({...form, budget_total: parseFloat(e.target.value)})} />
        <button className="btn">Crear</button>
      </form>
      <div className="grid gap-3">
        {items.map((c)=> (
          <CampaignCard key={c._id} item={c} />
        ))}
      </div>
    </div>
  )
}

function CampaignCard({ item }){
  const [budget, setBudget] = useState(null)
  useEffect(()=>{
    fetch(`${API}/campaigns/${item._id}/budget`).then(r=>r.json()).then(setBudget)
  }, [item._id])

  return (
    <div className="bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-medium">{item.name}</p>
          <p className="text-blue-200 text-sm">{item.status}</p>
        </div>
        {budget && (
          <div className="text-right">
            <p className="text-white text-sm">Total: ${budget.budget_total?.toFixed(2)}</p>
            <p className="text-blue-200 text-sm">Asignado: ${budget.allocated?.toFixed(2)}</p>
            <p className="text-emerald-300 text-sm">Restante: ${budget.remaining?.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
