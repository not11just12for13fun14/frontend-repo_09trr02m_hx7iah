import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function Clients() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', contact_name: '', email: '', phone: '', notes: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch(`${API}/clients`)
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await fetch(`${API}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setForm({ name: '', contact_name: '', email: '', phone: '', notes: '' })
    load()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Clientes</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
        <input className="input" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="input" placeholder="Contacto" value={form.contact_name} onChange={e=>setForm({...form, contact_name:e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" placeholder="Teléfono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <input className="input md:col-span-2" placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
        <button className="btn">Añadir</button>
      </form>
      <div className="grid gap-3">
        {loading ? <p className="text-blue-200">Cargando...</p> : items.map((c)=> (
          <div key={c._id} className="bg-slate-800/60 p-4 rounded-xl border border-blue-500/20">
            <p className="text-white font-medium">{c.name}</p>
            <p className="text-blue-200 text-sm">{c.contact_name} {c.email ? `• ${c.email}`: ''}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
