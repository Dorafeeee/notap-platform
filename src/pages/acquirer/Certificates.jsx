import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, RotateCcw, Download, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { certificates } from '../../data/mockData'
import { Badge, Button, Modal } from '../../components/ui'

export default function AcquirerCertificates() {
  const navigate = useNavigate()
  const myCerts = certificates.filter(c => c.acquirerName === 'Guaranty Trust Bank Plc')
  const [certModal, setCertModal] = useState(null)

  const statusIcon = {
    active: <CheckCircle size={15} className="text-brand-600" />,
    expiring_soon: <AlertTriangle size={15} className="text-amber-500" />,
    expired: <Clock size={15} className="text-slate-400" />,
  }

  const expiringSoon = myCerts.filter(c => c.status === 'expiring_soon')

  return (
    <div>
      <div className="mb-7 animate-fadeInUp">
        <h1 className="font-display font-bold text-2xl text-slate-900">Certificates of Compliance</h1>
        <p className="text-sm text-slate-500 mt-1">NOTAP-issued compliance certificates for your registered technologies.</p>
      </div>

      {/* Expiry alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 animate-fadeInUp">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm mb-1">
                {expiringSoon.length} certificate{expiringSoon.length > 1 ? 's' : ''} expiring soon
              </p>
              {expiringSoon.map(cert => (
                <div key={cert.id} className="flex items-center justify-between mt-2">
                  <p className="text-xs text-amber-700">
                    <strong>{cert.technology}</strong> — expires {cert.expiryDate}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/acquirer/renew', { state: { cert } })}
                  >
                    <RotateCcw size={12} /> Renew Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificates grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeInUp animate-delay-100">
        {myCerts.map(cert => (
          <div
            key={cert.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
              cert.status === 'expiring_soon' ? 'border-amber-200' : 'border-slate-100'
            }`}
          >
            {/* Certificate card header */}
            <div className={`px-5 py-4 border-b ${cert.status === 'expiring_soon' ? 'bg-amber-50 border-amber-100' : 'bg-brand-50 border-brand-100'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cert.status === 'expiring_soon' ? 'bg-amber-100' : 'bg-brand-100'}`}>
                    <Award size={18} className={cert.status === 'expiring_soon' ? 'text-amber-600' : 'text-brand-600'} />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-slate-900 text-sm">{cert.technology}</p>
                    <p className="font-mono text-xs text-brand-700 mt-0.5">{cert.id}</p>
                  </div>
                </div>
                <Badge status={cert.status} size="sm" />
              </div>
            </div>

            {/* Certificate details */}
            <div className="px-5 py-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  ['OEM', cert.oemName],
                  ['Local Partner', cert.localPartnerName],
                  ['Issued', cert.issuedDate],
                  ['Expires', cert.expiryDate],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Status indicator */}
              <div className={`flex items-center gap-2 text-xs mb-4 rounded-lg px-3 py-2 ${
                cert.status === 'expiring_soon'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-brand-50 text-brand-700'
              }`}>
                {statusIcon[cert.status]}
                {cert.status === 'active' && 'Certificate is valid and active'}
                {cert.status === 'expiring_soon' && `Expires on ${cert.expiryDate} — renewal recommended`}
                {cert.status === 'expired' && 'This certificate has expired'}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setCertModal(cert)}>
                  <Eye size={12} /> View Certificate
                </Button>
                <Button variant="ghost" size="sm">
                  <Download size={12} /> Download
                </Button>
                {(cert.status === 'expiring_soon' || cert.status === 'expired') && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="ml-auto"
                    onClick={() => navigate('/acquirer/renew', { state: { cert } })}
                  >
                    <RotateCcw size={12} /> Renew
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {myCerts.length === 0 && (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <Award size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-500 font-medium">No certificates issued yet</p>
            <p className="text-xs text-slate-400 mt-1">Certificates appear here once NOTAP approves your submissions.</p>
          </div>
        )}
      </div>

      {/* Certificate modal */}
      <Modal open={!!certModal} onClose={() => setCertModal(null)} title="Certificate of Compliance" size="md">
        {certModal && (
          <div className="space-y-4">
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
                {[
                  ['Issued', certModal.issuedDate],
                  ['Expires', certModal.expiryDate],
                ].map(([label, value]) => (
                  <div key={label} className="text-center">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-xs font-semibold text-slate-700">{value}</p>
                  </div>
                ))}
                <div className="text-center">
                  <p className="text-xs text-slate-400">Status</p>
                  <Badge status={certModal.status} size="sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setCertModal(null)}>
                <Download size={14} /> Download PDF
              </Button>
              {(certModal.status === 'expiring_soon' || certModal.status === 'expired') && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => { setCertModal(null); navigate('/acquirer/renew', { state: { cert: certModal } }) }}
                >
                  <RotateCcw size={14} /> Start Renewal
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
