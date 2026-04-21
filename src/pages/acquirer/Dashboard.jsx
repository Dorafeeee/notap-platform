import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Cpu, AlertTriangle, CheckCircle, Clock, Download, Eye, RotateCcw, CreditCard } from 'lucide-react'
import { certificates, submissions, acquirerStats } from '../../data/mockData'
import { StatCard, Badge, Button, Modal } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'

export default function AcquirerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [certModal, setCertModal] = useState(null)

  const myCerts = certificates.filter(c => c.acquirerName === 'Guaranty Trust Bank Plc')
  const myTech = submissions.filter(s => s.acquirerName === 'Guaranty Trust Bank Plc')
  const pending = myTech.filter(s => s.status === 'pending_review')
  // Simulate: one approved submission is awaiting fee payment (first-time cert)
  const pendingFeeSub = myTech.find(s => s.status === 'approved' && !s.certificateId) || null

  return (
    <div>
      <div className="mb-8 animate-fadeInUp">
        <p className="text-xs text-purple-700 font-semibold uppercase tracking-wider mb-1">Software Acquirer Portal</p>
        <h1 className="font-display font-bold text-2xl text-slate-900">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500 mt-1">{user?.company} — Technology Compliance Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Cpu} label="Active Technologies" value={acquirerStats.activeTechnologies} color="blue" className="animate-delay-100" />
        <StatCard icon={Award} label="Active Certificates" value={acquirerStats.activeCertificates} color="brand" className="animate-delay-200" />
        <StatCard icon={AlertTriangle} label="Expiring Soon" value={acquirerStats.expiringSoon} sub="Within 90 days" color="amber" className="animate-delay-300" />
        <StatCard icon={Clock} label="Pending Confirmation" value={acquirerStats.pendingConfirmation} color="slate" className="animate-delay-400" />
      </div>

      {/* Fee payment required banner */}
      {pendingFeeSub && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between animate-fadeInUp">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-brand-600" />
            </div>
            <div>
              <p className="font-semibold text-brand-800 text-sm">Certificate Fee Payment Required</p>
              <p className="text-brand-600 text-xs mt-0.5">
                Your submission for <strong>{pendingFeeSub.technology}</strong> has been approved by NOTAP.
                Pay the compliance fee to receive your certificate.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/acquirer/pay-fee', { state: { submission: pendingFeeSub } })}>
            <CreditCard size={13} /> Pay Fee
          </Button>
        </div>
      )}

      {/* Pending action banner */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between animate-fadeInUp">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Pending Submissions</p>
              <p className="text-amber-600 text-xs mt-0.5">
                {pending.length} submission{pending.length > 1 ? 's' : ''} filed by your Local Partner are under NOTAP review.
              </p>
            </div>
          </div>
          <Badge status="pending_review" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Technologies in use */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-display font-semibold text-slate-900">Technologies in Use</h3>
            <p className="text-xs text-slate-400 mt-0.5">All registered foreign technologies across your organisation</p>
          </div>
          <div className="divide-y divide-slate-50">
            {myTech.map(tech => (
              <div key={tech.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cpu size={15} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tech.technology}</p>
                    <p className="text-xs text-slate-400">{tech.oemName} · {tech.localPartnerName}</p>
                  </div>
                </div>
                <Badge status={tech.status} size="sm" />
              </div>
            ))}
            {myTech.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-400 text-sm">No technologies registered.</div>
            )}
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp animate-delay-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-display font-semibold text-slate-900">Certificates of Compliance</h3>
            <p className="text-xs text-slate-400 mt-0.5">NOTAP-issued digital certificates</p>
          </div>
          <div className="divide-y divide-slate-50">
            {myCerts.map(cert => (
              <div key={cert.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cert.technology}</p>
                    <p className="text-xs font-mono text-brand-700 mt-0.5">{cert.id}</p>
                  </div>
                  <Badge status={cert.status} size="sm" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">Expires {cert.expiryDate}</p>
                  <Button variant="ghost" size="sm" onClick={() => setCertModal(cert)}>
                    <Eye size={12} /> View
                  </Button>
                </div>
                {cert.status === 'expiring_soon' && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-600 text-xs">
                      <AlertTriangle size={11} /> Renewal required before {cert.expiryDate}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/acquirer/renew', { state: { cert } })}
                    >
                      <RotateCcw size={12} /> Renew
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {myCerts.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-400 text-sm">No certificates issued yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Compliance summary */}
      <div className="bg-gradient-to-br from-dark-900 to-dark-700 rounded-2xl p-6 animate-fadeInUp animate-delay-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-1">Compliance Status</p>
            <h3 className="font-display font-bold text-white text-lg">Guaranty Trust Bank Plc</h3>
          </div>
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={18} className="text-white" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Certified Technologies', value: '3', ok: true },
            { label: 'Compliance Score', value: '94%', ok: true },
            { label: 'Expiring ≤ 90 days', value: '1', ok: false },
          ].map(item => (
            <div key={item.label} className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">{item.label}</p>
              <p className={`font-display font-bold text-2xl ${item.ok ? 'text-white' : 'text-amber-400'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate modal */}
      <Modal open={!!certModal} onClose={() => setCertModal(null)} title="Certificate of Compliance" size="md">
        {certModal && (
          <div className="space-y-4">
            {/* Certificate visual */}
            <div className="border-2 border-brand-200 rounded-2xl p-6 bg-gradient-to-br from-brand-50 to-white text-center">
              <div className="w-14 h-14 bg-brand-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Award size={26} className="text-white" />
              </div>
              <p className="text-xs text-brand-600 font-semibold uppercase tracking-widest mb-1">Federal Republic of Nigeria</p>
              <p className="text-xs text-slate-500 mb-3">National Office for Technology Acquisition and Promotion</p>
              <p className="font-display font-bold text-xl text-slate-900 mb-1">Certificate of Compliance</p>
              <p className="font-mono font-bold text-brand-700 text-sm mb-4">{certModal.id}</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Technology:</strong> {certModal.technology}</p>
                <p><strong>Acquirer:</strong> {certModal.acquirerName}</p>
                <p><strong>OEM:</strong> {certModal.oemName}</p>
                <p><strong>Local Partner:</strong> {certModal.localPartnerName}</p>
              </div>
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-brand-100">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Issued</p>
                  <p className="text-xs font-semibold text-slate-700">{certModal.issuedDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Expires</p>
                  <p className="text-xs font-semibold text-slate-700">{certModal.expiryDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Status</p>
                  <Badge status={certModal.status} size="sm" />
                </div>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setCertModal(null)}>
              <Download size={14} /> Download Certificate (PDF)
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
