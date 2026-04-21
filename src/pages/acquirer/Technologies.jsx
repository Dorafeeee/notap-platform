import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cpu, CreditCard, Clock, CheckCircle, AlertTriangle, XCircle, Eye } from 'lucide-react'
import { submissions } from '../../data/mockData'
import { Badge, Button, Modal } from '../../components/ui'

export default function AcquirerTechnologies() {
  const navigate = useNavigate()
  const myTech = submissions.filter(s => s.acquirerName === 'Guaranty Trust Bank Plc')
  const [detail, setDetail] = useState(null)

  const statusIcon = {
    pending_review: <Clock size={16} className="text-amber-500" />,
    approved: <CheckCircle size={16} className="text-brand-600" />,
    returned: <AlertTriangle size={16} className="text-orange-500" />,
    rejected: <XCircle size={16} className="text-red-500" />,
  }

  return (
    <div>
      <div className="mb-7 animate-fadeInUp">
        <h1 className="font-display font-bold text-2xl text-slate-900">My Technologies</h1>
        <p className="text-sm text-slate-500 mt-1">All foreign technologies registered under your organisation.</p>
      </div>

      {/* Fee payment alert */}
      {myTech.some(s => s.status === 'approved' && !s.certificateId) && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl px-5 py-4 flex items-center justify-between mb-6 animate-fadeInUp">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard size={17} className="text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-brand-800 text-sm">Certificate Fee Awaiting Payment</p>
              <p className="text-xs text-brand-600 mt-0.5">
                One or more approved submissions require fee payment before a certificate can be issued.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeInUp animate-delay-100">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Submission ID', 'Technology', 'OEM · Partner', 'Agreement Fee', 'Effective Date', 'Status', ''].map(h => (
                <th key={h} className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myTech.map(tech => {
              const needsFee = tech.status === 'approved' && !tech.certificateId
              return (
                <tr key={tech.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-brand-700 font-semibold">{tech.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Cpu size={14} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{tech.technology}</p>
                        <p className="text-xs text-slate-400">{tech.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-700">{tech.oemName}</p>
                    <p className="text-xs text-slate-400">{tech.localPartnerName}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{tech.agreementFee}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{tech.effectiveDate}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {statusIcon[tech.status]}
                      <Badge status={tech.status} size="sm" />
                    </div>
                    {needsFee && (
                      <p className="text-xs text-brand-600 font-medium mt-1">⚡ Fee payment required</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {needsFee ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate('/acquirer/pay-fee', { state: { submission: tech } })}
                        >
                          <CreditCard size={12} /> Pay Fee
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => setDetail(tech)}>
                          <Eye size={12} /> View
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {myTech.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                  <Cpu size={28} className="mx-auto mb-3 text-slate-300" />
                  No technologies registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Technology Details" size="md">
        {detail && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              {[
                ['Submission ID', detail.id],
                ['Technology', detail.technology],
                ['Category', detail.category],
                ['OEM', `${detail.oemName} (${detail.oemCountry})`],
                ['Local Partner', detail.localPartnerName],
                ['Agreement Fee', detail.agreementFee],
                ['Signing Date', detail.signingDate],
                ['Effective Date', detail.effectiveDate],
                ['Expiry Date', detail.expiryDate],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800 text-right ml-4">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setDetail(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
