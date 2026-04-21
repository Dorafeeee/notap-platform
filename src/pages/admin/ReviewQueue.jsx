import { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw, Eye, FileText, ChevronDown } from 'lucide-react'
import { submissions as initialSubmissions } from '../../data/mockData'
import { Badge, Button, Modal } from '../../components/ui'

const filters = ['All', 'Pending Review', 'Approved', 'Returned', 'Rejected']
const filterMap = {
  'All': null,
  'Pending Review': 'pending_review',
  'Approved': 'approved',
  'Returned': 'returned',
  'Rejected': 'rejected',
}

export default function ReviewQueue() {
  const [subs, setSubs] = useState(initialSubmissions)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [comment, setComment] = useState('')
  const [actionType, setActionType] = useState(null) // 'approve' | 'return' | 'reject'
  const [confirmModal, setConfirmModal] = useState(false)
  const [toast, setToast] = useState(null)

  const filterKey = filterMap[activeFilter]
  const filtered = filterKey ? subs.filter(s => s.status === filterKey) : subs

  const counts = {
    'All': subs.length,
    'Pending Review': subs.filter(s => s.status === 'pending_review').length,
    'Approved': subs.filter(s => s.status === 'approved').length,
    'Returned': subs.filter(s => s.status === 'returned').length,
    'Rejected': subs.filter(s => s.status === 'rejected').length,
  }

  const openReview = (sub) => {
    setSelected(sub)
    setComment('')
    setActionType(null)
  }

  const initiateAction = (type) => {
    if ((type === 'return' || type === 'reject') && !comment.trim()) {
      alert('A comment is required when returning or rejecting a submission.')
      return
    }
    setActionType(type)
    setConfirmModal(true)
  }

  const confirmAction = () => {
    const newStatus = actionType === 'approve' ? 'approved' : actionType === 'return' ? 'returned' : 'rejected'
    setSubs(prev => prev.map(s =>
      s.id === selected.id
        ? { ...s, status: newStatus, reviewComment: comment, certificateId: actionType === 'approve' ? `CERT-2026-${selected.id.slice(-4)}` : undefined }
        : s
    ))
    setConfirmModal(false)
    setSelected(null)
    const messages = {
      approve: `Submission ${selected.id} approved. Certificate of Compliance issued.`,
      return: `Submission ${selected.id} returned to partner for correction.`,
      reject: `Submission ${selected.id} has been rejected.`,
    }
    setToast(messages[actionType])
    setTimeout(() => setToast(null), 4000)
  }

  const actionColors = {
    approve: 'bg-green-600 hover:bg-green-700',
    return: 'bg-orange-500 hover:bg-orange-600',
    reject: 'bg-red-600 hover:bg-red-700',
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fadeInUp">
          <CheckCircle size={16} className="text-brand-400" />
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-slate-900">Review Queue</h1>
        <p className="text-sm text-slate-500 mt-1">Process technology transfer submissions submitted by Local Partners.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
              activeFilter === f
                ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
            }`}
          >
            {f}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-3">Submission</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Technology / OEM</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Acquirer</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Fee (USD)</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-16 text-slate-400 text-sm">No submissions in this category.</td></tr>
              )}
              {filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-brand-700 font-semibold">{sub.id}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub.submittedDate}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-900">{sub.technology}</p>
                    <p className="text-xs text-slate-400">{sub.oemName} · {sub.oemCountry}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-700">{sub.acquirerName}</p>
                    <p className="text-xs text-slate-400">{sub.localPartnerName}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{sub.agreementFee}</td>
                  <td className="px-4 py-4"><Badge status={sub.status} /></td>
                  <td className="px-4 py-4">
                    <Button
                      variant={sub.status === 'pending_review' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => openReview(sub)}
                    >
                      <Eye size={13} />
                      {sub.status === 'pending_review' ? 'Review' : 'View'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={`Submission — ${selected.id}`} size="xl">
          <div className="space-y-5">
            {/* Status */}
            <div className="flex items-center justify-between">
              <Badge status={selected.status} />
              <p className="text-xs text-slate-400">Submitted {selected.submittedDate}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Technology', value: selected.technology },
                { label: 'Version', value: selected.version },
                { label: 'Category', value: selected.category },
                { label: 'Foreign OEM', value: `${selected.oemName} (${selected.oemCountry})` },
                { label: 'Software Acquirer', value: selected.acquirerName },
                { label: 'Local Partner', value: selected.localPartnerName },
                { label: 'Agreement Fee', value: selected.agreementFee },
                { label: 'Signing Date', value: selected.signingDate },
                { label: 'Effective Date', value: selected.effectiveDate },
                { label: 'Expiry Date', value: selected.expiryDate },
              ].map(({ label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Attached Documents</p>
              <div className="flex gap-2 flex-wrap">
                {selected.documents?.map(doc => (
                  <div key={doc} className="flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs px-3 py-1.5 rounded-lg">
                    <FileText size={12} />
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            {/* Existing review comment */}
            {selected.reviewComment && selected.status !== 'pending_review' && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-xs text-amber-600 font-semibold mb-1">Review Comment</p>
                <p className="text-sm text-amber-800">{selected.reviewComment}</p>
              </div>
            )}

            {/* Certificate */}
            {selected.certificateId && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-semibold">Certificate Issued</p>
                  <p className="text-sm font-mono font-bold text-green-800">{selected.certificateId}</p>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={18} className="text-white" />
                </div>
              </div>
            )}

            {/* Action area (only for pending) */}
            {selected.status === 'pending_review' && (
              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                  Review Comment <span className="text-slate-400 font-normal">(required for Return / Reject)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  placeholder="Add your review notes here..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => initiateAction('approve')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer"
                  >
                    <CheckCircle size={15} /> Approve & Issue Certificate
                  </button>
                  <button
                    onClick={() => initiateAction('return')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer"
                  >
                    <RotateCcw size={15} /> Return
                  </button>
                  <button
                    onClick={() => initiateAction('reject')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                  >
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirm Modal */}
      <Modal open={confirmModal} onClose={() => setConfirmModal(false)} title="Confirm Action" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You are about to <strong className="text-slate-900">{actionType}</strong> submission <strong className="font-mono text-brand-700">{selected?.id}</strong>. This action will be logged and is irreversible.
          </p>
          {comment && (
            <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600 italic">"{comment}"</div>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmModal(false)} className="flex-1">Cancel</Button>
            <button
              onClick={confirmAction}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-colors cursor-pointer ${actionColors[actionType]}`}
            >
              Confirm {actionType?.charAt(0).toUpperCase() + actionType?.slice(1)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
