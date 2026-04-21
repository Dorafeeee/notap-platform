import { useState } from 'react'
import { Building2, CheckCircle, XCircle, Eye } from 'lucide-react'
import { pendingRegistrations } from '../../data/mockData'
import { Badge, Button, Modal } from '../../components/ui'

const statusConfig = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  approved: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
}

function RegBadge({ status }) {
  const c = statusConfig[status] || statusConfig.pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium border px-3 py-1 ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

export default function Registrations() {
  const [activeTab, setActiveTab] = useState('partners')
  const [partners, setPartners] = useState(pendingRegistrations.partners)
  const [acquirers, setAcquirers] = useState(pendingRegistrations.acquirers)
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [toast, setToast] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500) }

  const records = activeTab === 'partners' ? partners : acquirers
  const setRecords = activeTab === 'partners' ? setPartners : setAcquirers

  const counts = {
    partners: { pending: partners.filter(r => r.status === 'pending').length, total: partners.length },
    acquirers: { pending: acquirers.filter(r => r.status === 'pending').length, total: acquirers.length },
  }

  const handleDecision = (decision) => {
    setRecords(prev => prev.map(r =>
      r.id === selected.id ? { ...r, status: decision, reviewComment: comment } : r
    ))
    const msg = decision === 'approved'
      ? `${selected.company} registration approved. NOTAP Transferee ID issued.`
      : `${selected.company} registration rejected.`
    showToast(msg)
    setSelected(null)
    setComment('')
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-fadeInUp">
          {toast}
        </div>
      )}

      <div className="mb-6 animate-fadeInUp">
        <h1 className="font-display font-bold text-2xl text-slate-900">Registration Management</h1>
        <p className="text-sm text-slate-500 mt-1">Review and approve onboarding requests from Local Partners and Software Acquirers.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 animate-fadeInUp animate-delay-100">
        {[
          { key: 'partners', label: 'Local Partners' },
          { key: 'acquirers', label: 'Software Acquirers' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
            }`}
          >
            {tab.label}
            {counts[tab.key].pending > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                {counts[tab.key].pending} pending
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeInUp animate-delay-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Organisation', 'Contact', activeTab === 'partners' ? 'CAC Number' : 'TIN', 'Sector', 'Submitted', 'Status', ''].map(h => (
                <th key={h} className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(reg => (
              <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 size={15} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{reg.company}</p>
                      <p className="text-xs font-mono text-slate-400">{reg.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700">{reg.contact}</p>
                  <p className="text-xs text-slate-400">{reg.email}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 font-mono">
                  {activeTab === 'partners' ? reg.cacNumber : reg.tin}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{reg.sector}</td>
                <td className="px-5 py-4 text-xs text-slate-400">{reg.submittedDate}</td>
                <td className="px-5 py-4"><RegBadge status={reg.status} /></td>
                <td className="px-5 py-4">
                  <Button
                    variant={reg.status === 'pending' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => { setSelected(reg); setComment('') }}
                  >
                    <Eye size={13} /> {reg.status === 'pending' ? 'Review' : 'View'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Registration Review" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <RegBadge status={selected.status} />
              <p className="text-xs text-slate-400 font-mono">{selected.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Organisation', value: selected.company },
                { label: 'Contact Person', value: selected.contact },
                { label: 'Email Address', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'CAC / TIN', value: selected.cacNumber || selected.tin },
                { label: 'Sector', value: selected.sector },
                { label: 'Address', value: selected.address },
                { label: 'Submitted', value: selected.submittedDate },
              ].filter(i => i.value).map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {selected.reviewComment && selected.status !== 'pending' && (
              <div className={`rounded-xl p-4 ${selected.status === 'rejected' ? 'bg-red-50 border border-red-100' : 'bg-brand-50 border border-brand-100'}`}>
                <p className={`text-xs font-semibold mb-1 ${selected.status === 'rejected' ? 'text-red-600' : 'text-brand-600'}`}>Review Comment</p>
                <p className={`text-sm ${selected.status === 'rejected' ? 'text-red-800' : 'text-brand-800'}`}>{selected.reviewComment}</p>
              </div>
            )}

            {selected.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-semibold">NOTAP Transferee ID Issued</p>
                  <p className="font-mono font-bold text-green-800">NTP-TRF-2026-{selected.id.slice(-4)}</p>
                </div>
                <CheckCircle size={20} className="text-green-600" />
              </div>
            )}

            {selected.status === 'pending' && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Comment <span className="text-slate-400 font-normal">(required for rejection)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    placeholder="Add notes or reason for decision..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecision('approved')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer"
                  >
                    <CheckCircle size={15} /> Approve & Issue Transferee ID
                  </button>
                  <button
                    onClick={() => { if (!comment.trim()) { alert('A comment is required to reject.'); return } handleDecision('rejected') }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                  >
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
