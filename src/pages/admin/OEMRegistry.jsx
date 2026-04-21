import { useState } from 'react'
import { Globe, Search, PlusCircle, Eye } from 'lucide-react'
import { oemRegistry } from '../../data/mockData'
import { Badge, Button, Modal, SectionHeader } from '../../components/ui'

const statusConfig = {
  active: { label: 'Active', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  under_review: { label: 'Under Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  suspended: { label: 'Suspended', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
}

function OEMBadge({ status }) {
  const c = statusConfig[status] || statusConfig.active
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium border px-3 py-1 ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

const countryFlags = {
  'United States': '🇺🇸', 'Germany': '🇩🇪', 'United Kingdom': '🇬🇧',
  'Switzerland': '🇨🇭', 'China': '🇨🇳', 'Sweden': '🇸🇪',
}

export default function OEMRegistry() {
  const [oems, setOems] = useState(oemRegistry)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [newOEM, setNewOEM] = useState({ name: '', country: '', category: '', website: '', contactEmail: '' })
  const [toast, setToast] = useState(null)

  const filtered = oems.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.country.toLowerCase().includes(search.toLowerCase()) ||
    o.category.toLowerCase().includes(search.toLowerCase())
  )

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500) }

  const handleAdd = () => {
    if (!newOEM.name || !newOEM.country || !newOEM.category) return
    const id = `OEM${String(oems.length + 1).padStart(3, '0')}`
    setOems(prev => [...prev, { ...newOEM, id, registeredDate: new Date().toISOString().slice(0, 10), submissions: 0, status: 'under_review' }])
    setAddModal(false)
    setNewOEM({ name: '', country: '', category: '', website: '', contactEmail: '' })
    showToast(`${newOEM.name} added to registry. Status: Under Review.`)
  }

  const set = (f, v) => setNewOEM(p => ({ ...p, [f]: v }))

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-fadeInUp">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between mb-6 animate-fadeInUp">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Foreign Partner / OEM Registry</h1>
          <p className="text-sm text-slate-500 mt-1">Centralised database of all registered technology source organisations.</p>
        </div>
        <Button variant="primary" onClick={() => setAddModal(true)}>
          <PlusCircle size={15} /> Add OEM
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6 animate-fadeInUp animate-delay-100">
        {[
          { label: 'Total Registered', value: oems.length },
          { label: 'Active', value: oems.filter(o => o.status === 'active').length },
          { label: 'Under Review', value: oems.filter(o => o.status === 'under_review').length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
            <p className="font-display font-bold text-3xl text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 animate-fadeInUp animate-delay-200">
        <Search size={15} className="absolute left-4 top-3.5 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, country, or category..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeInUp animate-delay-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['OEM / Organisation', 'Country', 'Category', 'Registered', 'Submissions', 'Status', ''].map(h => (
                <th key={h} className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(oem => (
              <tr key={oem.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      {countryFlags[oem.country] || '🌐'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{oem.name}</p>
                      <p className="text-xs font-mono text-slate-400">{oem.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{oem.country}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{oem.category}</td>
                <td className="px-5 py-4 text-xs text-slate-400">{oem.registeredDate}</td>
                <td className="px-5 py-4">
                  <span className="font-display font-bold text-slate-900">{oem.submissions}</span>
                  <span className="text-xs text-slate-400 ml-1">filed</span>
                </td>
                <td className="px-5 py-4"><OEMBadge status={oem.status} /></td>
                <td className="px-5 py-4">
                  <Button variant="ghost" size="sm" onClick={() => setSelected(oem)}>
                    <Eye size={13} /> View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View OEM Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="OEM Profile" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">
                {countryFlags[selected.country] || '🌐'}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">{selected.name}</h3>
                <p className="text-xs font-mono text-brand-700">{selected.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Country', value: selected.country },
                { label: 'Category', value: selected.category },
                { label: 'Website', value: selected.website },
                { label: 'Contact Email', value: selected.contactEmail },
                { label: 'Registered', value: selected.registeredDate },
                { label: 'Total Submissions', value: `${selected.submissions} filed` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-900 break-all">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <OEMBadge status={selected.status} />
              {selected.status === 'under_review' && (
                <Button variant="primary" size="sm" onClick={() => {
                  setOems(prev => prev.map(o => o.id === selected.id ? { ...o, status: 'active' } : o))
                  setSelected(null)
                  showToast(`${selected.name} has been activated.`)
                }}>
                  Activate OEM
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add OEM Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New OEM to Registry" size="md">
        <div className="space-y-4">
          {[
            { label: 'Organisation Name', field: 'name', placeholder: 'e.g. SAP SE' },
            { label: 'Country of Origin', field: 'country', placeholder: 'e.g. Germany' },
            { label: 'Technology Category', field: 'category', placeholder: 'e.g. ERP / Enterprise Software' },
            { label: 'Website', field: 'website', placeholder: 'e.g. www.sap.com' },
            { label: 'Compliance Contact Email', field: 'contactEmail', placeholder: 'e.g. compliance@sap.com' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <input
                value={newOEM[field]}
                onChange={e => set(field, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1" onClick={handleAdd} disabled={!newOEM.name || !newOEM.country || !newOEM.category}>
              Add to Registry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
