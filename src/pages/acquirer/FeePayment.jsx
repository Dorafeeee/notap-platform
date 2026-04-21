import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Award, CreditCard, CheckCircle, Lock, AlertCircle, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui'

// NOTAP fee schedule (simplified)
function calculateFee(agreementFeeStr) {
  if (!agreementFeeStr) return { amount: 'NGN 150,000', base: 150000 }
  const num = parseFloat(String(agreementFeeStr).replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return { amount: 'NGN 150,000', base: 150000 }
  // Simplified: 0.5% of agreement fee converted at ~1600 NGN/USD, min 150k NGN
  const naira = Math.max(150000, Math.round(num * 1600 * 0.005))
  return {
    amount: `NGN ${naira.toLocaleString()}`,
    base: naira,
  }
}

export default function FeePayment() {
  const navigate = useNavigate()
  const location = useLocation()
  const submission = location.state?.submission || {
    id: 'SUB-2026-0088',
    technology: 'Microsoft 365 Enterprise E5',
    oemName: 'Microsoft Corporation',
    acquirerName: 'Access Bank Plc',
    agreementFee: 'USD 1,200,000',
    localPartnerName: 'Inlaks Computers Ltd',
  }

  const fee = calculateFee(submission.agreementFee)
  const [payMethod, setPayMethod] = useState('remita')
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)
  const certId = `CERT-2026-${String(Math.floor(Math.random() * 900) + 90).padStart(4, '0')}`

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
    }, 2200)
  }

  if (paid) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="text-center max-w-md animate-fadeInUp">
          {/* Certificate visual */}
          <div className="border-2 border-brand-200 rounded-3xl p-8 bg-gradient-to-br from-brand-50 to-white text-center mb-6 shadow-lg">
            <div className="w-16 h-16 bg-brand-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Award size={30} className="text-white" />
            </div>
            <p className="text-xs text-brand-600 font-bold uppercase tracking-widest mb-1">
              Federal Republic of Nigeria
            </p>
            <p className="text-xs text-slate-400 mb-3">
              National Office for Technology Acquisition and Promotion
            </p>
            <p className="font-display font-bold text-xl text-slate-900 mb-1">
              Certificate of Compliance
            </p>
            <p className="font-mono font-bold text-brand-700 text-base mb-5">{certId}</p>
            <div className="text-xs text-slate-600 space-y-1.5 text-left bg-brand-50 rounded-xl px-4 py-3">
              <p><span className="text-slate-400">Technology:</span> <strong>{submission.technology}</strong></p>
              <p><span className="text-slate-400">Acquirer:</span> <strong>{submission.acquirerName}</strong></p>
              <p><span className="text-slate-400">OEM:</span> <strong>{submission.oemName}</strong></p>
              <p><span className="text-slate-400">Partner:</span> <strong>{submission.localPartnerName}</strong></p>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-brand-600 font-medium">
              <CheckCircle size={13} />
              Certificate Issued Successfully
            </div>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Payment Complete</h2>
          <p className="text-slate-500 text-sm mb-2">
            Your NOTAP compliance certificate has been issued and is now available in your portal.
          </p>
          <p className="text-xs text-slate-400 mb-6">
            Payment reference: <span className="font-mono text-slate-600">RMT-{certId}-FEE</span>
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate('/acquirer')}>
              Go to Dashboard
            </Button>
            <Button variant="primary" onClick={() => navigate('/acquirer')}>
              <Award size={14} /> View Certificate
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-7 animate-fadeInUp">
        <p className="text-xs text-brand-700 font-semibold uppercase tracking-wider mb-1">Final Step</p>
        <h1 className="font-display font-bold text-2xl text-slate-900">NOTAP Compliance Fee</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your submission has been approved. Pay the compliance fee to receive your certificate.
        </p>
      </div>

      {/* Approval notice */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl px-5 py-4 flex items-start gap-3 mb-6 animate-fadeInUp animate-delay-100">
        <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <CheckCircle size={18} className="text-brand-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-800">Submission Approved by NOTAP</p>
          <p className="text-xs text-brand-600 mt-0.5">
            {submission.id} · {submission.technology}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeInUp animate-delay-200">
        {/* Fee breakdown */}
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Fee Breakdown</p>
          <div className="space-y-3">
            {[
              { label: 'Technology Transfer (Doctor) Fee', value: fee.amount },
              { label: 'Agreement Value', value: submission.agreementFee || '—' },
              { label: 'Technology', value: submission.technology },
              { label: 'Certificate Reference', value: `Will be: ${certId}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-xs font-semibold text-slate-800 text-right ml-4">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-700">Total Due</p>
            <p className="font-display font-bold text-xl text-brand-700">{fee.amount}</p>
          </div>
        </div>

        {/* Payment method */}
        <div className="px-6 py-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Payment Method</p>
          <div className="space-y-2">
            {[
              { id: 'remita', label: 'Remita', sub: 'Official FGN payment gateway' },
              { id: 'bank', label: 'Bank Transfer', sub: 'NOTAP designated account' },
            ].map(method => (
              <label
                key={method.id}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === method.id ? 'border-brand-600 bg-brand-50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  value={method.id}
                  checked={payMethod === method.id}
                  onChange={() => setPayMethod(method.id)}
                  className="accent-brand-700"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{method.label}</p>
                  <p className="text-xs text-slate-500">{method.sub}</p>
                </div>
              </label>
            ))}
          </div>

          {payMethod === 'bank' && (
            <div className="mt-3 bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1">
              <p><span className="text-slate-400">Bank:</span> <strong>First Bank of Nigeria</strong></p>
              <p><span className="text-slate-400">Account Name:</span> <strong>NOTAP Revenue Account</strong></p>
              <p><span className="text-slate-400">Account No:</span> <strong>2012345678</strong></p>
              <p className="text-amber-600 mt-2 flex items-start gap-1.5">
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                Use your submission ID <strong>{submission.id}</strong> as the payment narration.
              </p>
            </div>
          )}
        </div>

        {/* Pay button */}
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
            <Lock size={11} /> Payments are processed securely via the Federal Government payment infrastructure
          </div>
          <Button
            variant="primary"
            className="w-full justify-center"
            onClick={handlePay}
            disabled={paying}
          >
            {paying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing Payment…
              </>
            ) : (
              <>
                <CreditCard size={15} />
                Pay {fee.amount} via {payMethod === 'remita' ? 'Remita' : 'Bank Transfer'}
                <ChevronRight size={15} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
