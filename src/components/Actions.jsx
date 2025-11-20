import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Actions(){
  const [campaigns, setCampaigns] = useState([])
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ campaign_id: '', title: '', owner: '', due_date: '', status: 'pendiente' })

  const load = async () => {
    const [rc, ri] = await Promise.all([
      fetch(`${API}/campaigns`).then(r=>r.json()),
      fetch(`${API}/actions`).then(r=>r.json())
    ])
    setCampaigns(rc)
    setItems(ri)
  }

  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ campaign_id: '', title: '', owner: '', due_date: '', status: 'pendiente' })
    load()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Acciones</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
        <select className="input" value={form.campaign_id} onChange={e=>setForm({...form, campaign_id:e.target.value})} required>
          <option value="">Campaña</option>
          {campaigns.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="input" placeholder="Acción" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <input className="input" placeholder="Responsable" value={form.owner} onChange={e=>setForm({...form, owner:e.target.value})} />
        <input className="input" type="date" value={form.due_date} onChange={e=>setForm({...form, due_date:e.target.value})} />
        <select className="input" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option>pendiente</option>
          <option>en progreso</option>
          <option>hecha</option>
          <option>bloqueada</option>
        </select>
        <button className="btn">Añadir</button>
      </form>

      <div className="grid gap-3">
        {items.map(i => (
          <div key={i._id} className="bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
            <p className="text-white font-medium">{i.title}</p>
            <p className="text-blue-200 text-sm">{i.owner ? `${i.owner} • `: ''}{i.status}{i.due_date ? ` • ${i.due_date}`: ''}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
