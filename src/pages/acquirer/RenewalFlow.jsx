import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, CheckCircle, Upload, AlertTriangle,
  FileText, Receipt, Percent, FileCheck, RotateCcw, X
} from 'lucide-react'
import { Button } from '../../components/ui'

const steps = [
  { id: 1, label: 'Project Fee', sub: 'Optional update' },
  { id: 2, label: 'Tax Documents', sub: 'WHT & VAT certs' },
  { id: 3, label: 'Review & Submit', sub: 'Confirm renewal' },
]

function UploadSlot({ label, description, required, icon: Icon, fileKey, files, onUpload, onRemove }) {
  const file = files[fileKey]
  return (
    <div className={`border-2 rounded-2xl p-5 transition-all ${file ? 'border-brand-300 bg-brand-50/40' : 'border-dashed border-slate-200 hover:border-brand-300'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${file ? 'bg-brand-100' : 'bg-slate-100'}`}>
          <Icon size={20} className={file ? 'text-brand-600' : 'text-slate-400'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            {required ? (
              <span className="text-xs text-red-500 font-medium">Required</span>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Optional</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3">{description}</p>
          {file ? (
            <div className="flex items-center justify-between bg-white border border-brand-200 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2 text-brand-700 text-xs font-medium min-w-0">
                <CheckCircle size={13} className="flex-shrink-0" />
                <span className="truncate">{file}</span>
              </div>
              <button
                onClick={() => onRemove(fileKey)}
                className="ml-2 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onUpload(fileKey, label)}
              className="flex items-center gap-2 text-xs font-medium text-brand-700 bg-white border border-brand-200 rounded-xl px-3 py-2 hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <Upload size={13} /> Click to upload
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RenewalFlow() {
  const navigate = useNavigate()
  const location = useLocation()
  const cert = location.state?.cert || {
    id: 'CERT-2025-0244',
    technology: 'Cisco Catalyst Network Suite',
    oemName: 'Cisco Systems',
    localPartnerName: 'Inlaks Computers Ltd',
    expiryDate: '2026-11-01',
    agreementFee: 'USD 480,000',
  }

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [editFee, setEditFee] = useState(false)
  const [newFee, setNewFee] = useState('')
  const [newFeeCurrency, setNewFeeCurrency] = useState('USD')
  const [files, setFiles] = useState({
    prevDoctorFee: null,
    withholdingTax: null,
    vatCertificate: null,
    projectFee: null,
  })

  const handleUpload = (key, label) => {
    const safeName = label.replace(/[^a-zA-Z0-9]/g, '_')
    setFiles(f => ({ ...f, [key]: `${safeName}_upload.pdf` }))
  }

  const handleRemove = (key) => {
    setFiles(f => ({ ...f, [key]: null }))
  }

  const canAdvance = () => {
    if (step === 1) return true // project fee is optional
    if (step === 2) return files.prevDoctorFee && files.withholdingTax && files.vatCertificate
    return true
  }

  const renewalRef = `RNW-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="text-center max-w-md animate-fadeInUp">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw size={36} className="text-brand-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Renewal Submitted</h2>
          <p className="text-slate-500 text-sm mb-5">
            Your renewal documents have been submitted to your Local Partner for processing.
            A new certificate will be issued once NOTAP approves the renewal.
          </p>
          <div className="bg-brand-50 border border-brand-100 rounded-2xl px-6 py-4 mb-3">
            <p className="text-xs text-brand-600 font-semibold mb-1">Renewal Reference</p>
            <p className="font-mono font-bold text-brand-800 text-xl">{renewalRef}</p>
            <p className="text-xs text-brand-500 mt-1">Certifying technology: {cert.technology}</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Your current certificate remains valid until <strong>{cert.expiryDate}</strong>.
                Ensure renewal is completed before that date to avoid compliance gaps.
              </p>
            </div>
          </div>
          <Button variant="primary" className="w-full" onClick={() => navigate('/acquirer')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-7 animate-fadeInUp">
        <button
          onClick={() => navigate('/acquirer')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-700 transition-colors mb-4 cursor-pointer"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <RotateCcw size={22} className="text-amber-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-900">Certificate Renewal</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {cert.technology} — expires <span className="text-amber-600 font-medium">{cert.expiryDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Renewal requirement notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 animate-fadeInUp animate-delay-100">
        <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Required for Renewal</p>
        <div className="space-y-1.5">
          {[
            'Previous year\'s NOTAP doctor fee payment receipt',
            'Withholding Tax (WHT) certificate from FIRS',
            'VAT certificate from FIRS',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-amber-700">
              <div className="w-4 h-4 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 text-amber-700 font-bold text-[10px]">{i + 1}</div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-7 animate-fadeInUp animate-delay-100">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step > s.id ? 'bg-brand-700 border-brand-700 text-white' :
                step === s.id ? 'bg-white border-brand-700 text-brand-700' :
                'bg-white border-slate-200 text-slate-400'
              }`}>
                {step > s.id ? <CheckCircle size={16} /> : s.id}
              </div>
              <p className={`text-xs font-medium mt-1 hidden sm:block ${step === s.id ? 'text-brand-700' : 'text-slate-400'}`}>{s.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500 ${step > s.id ? 'bg-brand-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 animate-fadeInUp animate-delay-200">

        {/* STEP 1 — Project Fee (optional) */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Project Fee Update</h3>
              <p className="text-sm text-slate-500">
                If the contract sum or project fee has changed, upload the latest project fee document. This step is optional.
              </p>
            </div>

            {/* Current fee display */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Current Agreement Fee on Record</p>
              <p className="font-display font-bold text-xl text-slate-900">{cert.agreementFee || 'USD —'}</p>
              <p className="text-xs text-slate-400 mt-0.5">Certificate: {cert.id}</p>
            </div>

            {!editFee ? (
              <button
                onClick={() => setEditFee(true)}
                className="text-sm text-brand-700 font-medium hover:underline cursor-pointer"
              >
                + Update project fee for this renewal
              </button>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-600">Updated Agreement / Project Fee</label>
                <div className="flex gap-2">
                  <select
                    value={newFeeCurrency}
                    onChange={e => setNewFeeCurrency(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option>USD</option><option>EUR</option><option>GBP</option><option>NGN</option>
                  </select>
                  <input
                    value={newFee}
                    onChange={e => setNewFee(e.target.value)}
                    placeholder="e.g. 520,000"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <UploadSlot
                  label="Latest Project Fee Document"
                  description="Upload the updated contract sum or project fee schedule"
                  required={false}
                  icon={FileText}
                  fileKey="projectFee"
                  files={files}
                  onUpload={handleUpload}
                  onRemove={handleRemove}
                />
                <button
                  onClick={() => { setEditFee(false); setNewFee(''); setFiles(f => ({ ...f, projectFee: null })) }}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel update
                </button>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500">
                If there's no change to the project fee, simply continue to the next step.
                The existing fee on record will be carried forward.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2 — Tax Documents */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Tax & Compliance Documents</h3>
              <p className="text-sm text-slate-500">
                Upload all three documents below. These are mandatory before a renewal can be processed.
              </p>
            </div>

            <UploadSlot
              label="Previous NOTAP Doctor Fee Receipt"
              description="Payment receipt for the NOTAP technology transfer fee paid when the previous certificate was issued"
              required={true}
              icon={Receipt}
              fileKey="prevDoctorFee"
              files={files}
              onUpload={handleUpload}
              onRemove={handleRemove}
            />

            <UploadSlot
              label="Withholding Tax (WHT) Certificate"
              description="WHT certificate from FIRS covering the contract sum for this software acquisition"
              required={true}
              icon={Percent}
              fileKey="withholdingTax"
              files={files}
              onUpload={handleUpload}
              onRemove={handleRemove}
            />

            <UploadSlot
              label="VAT Certificate"
              description="Value Added Tax (VAT) certificate from FIRS for this technology transaction"
              required={true}
              icon={FileCheck}
              fileKey="vatCertificate"
              files={files}
              onUpload={handleUpload}
              onRemove={handleRemove}
            />

            {!(files.prevDoctorFee && files.withholdingTax && files.vatCertificate) && (
              <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertTriangle size={14} className="flex-shrink-0" />
                All three documents must be uploaded before you can proceed.
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Review */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Review & Submit</h3>
              <p className="text-sm text-slate-500">Confirm your renewal submission details before sending.</p>
            </div>

            {/* Certificate being renewed */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Certificate Being Renewed</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {[
                  ['Certificate ID', cert.id],
                  ['Technology', cert.technology],
                  ['OEM', cert.oemName],
                  ['Current Expiry', cert.expiryDate],
                  ['Local Partner', cert.localPartnerName],
                  ['Fee on Record', newFee ? `${newFeeCurrency} ${newFee}` : cert.agreementFee || '—'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-medium text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents checklist */}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Documents Uploaded</p>
              <div className="space-y-2">
                {[
                  { key: 'prevDoctorFee', label: 'Previous NOTAP Doctor Fee Receipt', required: true },
                  { key: 'withholdingTax', label: 'WHT Certificate (FIRS)', required: true },
                  { key: 'vatCertificate', label: 'VAT Certificate (FIRS)', required: true },
                  { key: 'projectFee', label: 'Updated Project Fee Document', required: false },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${files[item.key] ? 'bg-brand-100' : item.required ? 'bg-red-100' : 'bg-slate-100'}`}>
                      {files[item.key]
                        ? <CheckCircle size={12} className="text-brand-600" />
                        : <X size={12} className={item.required ? 'text-red-400' : 'text-slate-300'} />
                      }
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs font-medium ${files[item.key] ? 'text-slate-700' : item.required ? 'text-red-500' : 'text-slate-400'}`}>
                        {item.label}
                      </p>
                      {files[item.key] && (
                        <p className="text-xs text-slate-400 font-mono">{files[item.key]}</p>
                      )}
                    </div>
                    {!item.required && !files[item.key] && (
                      <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">Skipped</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-xs text-brand-700">
              By submitting, you confirm that all documents are authentic and current. Your Local Partner —&nbsp;
              <strong>{cert.localPartnerName}</strong> — will be notified to process this renewal with NOTAP.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <Button variant="secondary" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/acquirer')}>
            <ChevronLeft size={15} /> {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}>
              Continue <ChevronRight size={15} />
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setSubmitted(true)}>
              <RotateCcw size={15} /> Submit Renewal
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
