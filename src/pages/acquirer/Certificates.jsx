import { useState } from 'react'
import { Award, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { certificates } from '../../data/mockData'
import { Badge, Modal, Button } from '../../components/ui'

export default function AcquirerCertificates() {
  const [certModal, setCertModal] = useState(null)
  const myCerts = certificates.filter(c => c.acquirerName === 'Guaranty Trust Bank Plc')

  return (
    <div>
      <div className="mb-6 animate-fadeInUp">
        <h1 className="font-display font-bold text-2xl text-slate-900">Certificates of Compliance</h1>
        <p className="text-sm text-slate-500 mt-1">NOTAP-issued digital certificates for all registered technologies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeInUp animate-delay-100">
        {myCerts.map(cert => (
          <div key={cert.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 bg-brand-700 rounded-xl flex items-center justify-center shadow-sm">
                <Award size={20} className="text-white" />
              </div>
              <Badge status={cert.status} />
            </div>
            <h3 className="font-display font-semibold text-slate-900 mb-1">{cert.technology}</h3>
            <p className="text-xs font-mono text-brand-700 mb-3">{cert.id}</p>
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">OEM</span>
                <span className="text-slate-700 font-medium">{cert.oemName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Local Partner</span>
                <span className="text-slate-700 font-medium">{cert.localPartnerName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Issued</span>
                <span className="text-slate-700 font-medium">{cert.issuedDate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Expires</span>
                <span className={`font-medium ${cert.status === 'expiring_soon' ? 'text-amber-600' : 'text-slate-700'}`}>{cert.expiryDate}</span>
              </div>
            </div>
            {cert.status === 'expiring_soon' && (
              <div className="flex items-center gap-1.5 text-amber-600 text-xs bg-amber-50 rounded-xl px-3 py-2 mb-4">
                <AlertTriangle size={12} />
                Renewal required before {cert.expiryDate}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setCertModal(cert)}>
                View Certificate
              </Button>
              <Button variant="secondary" size="sm">
                <Download size={13} />
              </Button>
            </div>
          </div>
        ))}
        {myCerts.length === 0 && (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400 text-sm">
            No certificates issued yet.
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
              <div className="text-xs text-slate-600 space-y-1.5">
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
