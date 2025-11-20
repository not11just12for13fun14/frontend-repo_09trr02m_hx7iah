import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function MediaPlan(){
  const [campaigns, setCampaigns] = useState([])
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ campaign_id: '', channel: '', vendor: '', budget_allocated: 0, notes: '' })

  const load = async () => {
    const [rc, ri] = await Promise.all([
      fetch(`${API}/campaigns`).then(r=>r.json()),
      fetch(`${API}/media-plan`).then(r=>r.json())
    ])
    setCampaigns(rc)
    setItems(ri)
  }

  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API}/media-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ campaign_id: '', channel: '', vendor: '', budget_allocated: 0, notes: '' })
    load()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Plan de Medios</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
        <select className="input" value={form.campaign_id} onChange={e=>setForm({...form, campaign_id:e.target.value})} required>
          <option value="">Campaña</option>
          {campaigns.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="input" placeholder="Canal" value={form.channel} onChange={e=>setForm({...form, channel:e.target.value})} required />
        <input className="input" placeholder="Proveedor" value={form.vendor} onChange={e=>setForm({...form, vendor:e.target.value})} />
        <input className="input" type="number" step="0.01" placeholder="Presupuesto" value={form.budget_allocated} onChange={e=>setForm({...form, budget_allocated: parseFloat(e.target.value)})} />
        <input className="input" placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
        <button className="btn">Añadir</button>
      </form>

      <div className="grid gap-3">
        {items.map(i => (
          <div key={i._id} className="bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
            <p className="text-white font-medium">{i.channel} {i.vendor && `• ${i.vendor}`}</p>
            <p className="text-blue-200 text-sm">Campaña: {i.campaign_id} • Presupuesto: ${Number(i.budget_allocated||0).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
