import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, ChevronLeft, Upload, Search, Building2 } from 'lucide-react'
import { foreignOEMs, acquirerCompanies } from '../../data/mockData'
import { Button } from '../../components/ui'

const steps = [
  { id: 1, label: 'Solution Details', sub: 'Technology & OEM info' },
  { id: 2, label: 'Agreement Info', sub: 'Dates & financials' },
  { id: 3, label: 'Software Acquirer', sub: 'Link end-user' },
  { id: 4, label: 'Documents', sub: 'Upload agreements' },
  { id: 5, label: 'Review & Submit', sub: 'Confirm and send' },
]

const categories = [
  'ERP / Enterprise Software', 'Banking Software', 'CRM / Cloud Software',
  'HR / Cloud Software', 'Database Software', 'Networking',
  'Productivity / Cloud', 'Infrastructure / AI', 'Cybersecurity', 'Other',
]

export default function NewSubmission() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [searchOEM, setSearchOEM] = useState('')
  const [searchAcquirer, setSearchAcquirer] = useState('')

  const [form, setForm] = useState({
    technologyName: '',
    category: '',
    version: '',
    oemId: '',
    oemName: '',
    oemCountry: '',
    signingDate: '',
    effectiveDate: '',
    expiryDate: '',
    agreementFee: '',
    feeCurrency: 'USD',
    acquirerId: '',
    acquirerName: '',
    acquirerSector: '',
    docs: [],
    notes: '',
  })

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const filteredOEMs = foreignOEMs.filter(o =>
    o.name.toLowerCase().includes(searchOEM.toLowerCase()) ||
    o.country.toLowerCase().includes(searchOEM.toLowerCase())
  )

  const filteredAcquirers = acquirerCompanies.filter(a =>
    a.name.toLowerCase().includes(searchAcquirer.toLowerCase()) ||
    a.sector.toLowerCase().includes(searchAcquirer.toLowerCase())
  )

  const canAdvance = () => {
    if (step === 1) return form.technologyName && form.category && form.oemId
    if (step === 2) return form.signingDate && form.effectiveDate && form.expiryDate && form.agreementFee
    if (step === 3) return form.acquirerId
    if (step === 4) return true
    return true
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    const refId = `SUB-2026-${String(Math.floor(Math.random() * 900) + 93).padStart(4, '0')}`
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md animate-fadeInUp">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={38} className="text-brand-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Submission Received</h2>
          <p className="text-slate-500 text-sm mb-4">Your technology transfer request has been submitted to NOTAP for review.</p>
          <div className="bg-brand-50 border border-brand-100 rounded-2xl px-6 py-4 mb-6">
            <p className="text-xs text-brand-600 font-semibold mb-1">Submission Reference</p>
            <p className="font-mono font-bold text-brand-800 text-xl">{refId}</p>
            <p className="text-xs text-brand-500 mt-1">Expected review: 3–5 business days</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate('/partner/submissions')}>View Submissions</Button>
            <Button variant="primary" onClick={() => { setSubmitted(false); setStep(1); setForm({ technologyName:'',category:'',version:'',oemId:'',oemName:'',oemCountry:'',signingDate:'',effectiveDate:'',expiryDate:'',agreementFee:'',feeCurrency:'USD',acquirerId:'',acquirerName:'',acquirerSector:'',docs:[],notes:'' }) }}>New Submission</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="font-display font-bold text-2xl text-slate-900">New Technology Transfer Submission</h1>
        <p className="text-sm text-slate-500 mt-1">Complete all steps to submit a certification request to NOTAP.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8 animate-fadeInUp animate-delay-100">
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

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 animate-fadeInUp animate-delay-200">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Solution Details</h3>
              <p className="text-sm text-slate-500">Describe the technology being transferred.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Technology / Software Name <span className="text-red-500">*</span></label>
                <input value={form.technologyName} onChange={e => set('technologyName', e.target.value)}
                  placeholder="e.g. SAP S/4HANA Enterprise Suite"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Version / Release</label>
                <input value={form.version} onChange={e => set('version', e.target.value)}
                  placeholder="e.g. 2024.1, v8.3"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
            </div>

            {/* OEM search */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Foreign Partner / OEM <span className="text-red-500">*</span></label>
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                <input value={searchOEM} onChange={e => setSearchOEM(e.target.value)}
                  placeholder="Search by OEM name or country..."
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="border border-slate-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                {filteredOEMs.map(oem => (
                  <div key={oem.id} onClick={() => { set('oemId', oem.id); set('oemName', oem.name); set('oemCountry', oem.country); setSearchOEM('') }}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${form.oemId === oem.id ? 'bg-brand-50 border-l-2 border-l-brand-600' : 'hover:bg-slate-50'}`}>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{oem.name}</p>
                      <p className="text-xs text-slate-400">{oem.country} · {oem.category}</p>
                    </div>
                    {form.oemId === oem.id && <CheckCircle size={16} className="text-brand-600 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Agreement Information</h3>
              <p className="text-sm text-slate-500">Capture the financial and temporal details of the technology agreement.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Agreement Signing Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.signingDate} onChange={e => set('signingDate', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Effective Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.effectiveDate} onChange={e => set('effectiveDate', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Expiry Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Agreement Fee <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select value={form.feeCurrency} onChange={e => set('feeCurrency', e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                    <option>USD</option><option>EUR</option><option>GBP</option><option>NGN</option>
                  </select>
                  <input value={form.agreementFee} onChange={e => set('agreementFee', e.target.value)}
                    placeholder="e.g. 1,200,000"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Additional Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                placeholder="Any supplementary information relevant to this agreement..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Software Acquirer Linkage</h3>
              <p className="text-sm text-slate-500">Select the organisation that will be using this technology.</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              <input value={searchAcquirer} onChange={e => setSearchAcquirer(e.target.value)}
                placeholder="Search by company name or sector..."
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 mb-3" />
            </div>
            <div className="border border-slate-100 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              {filteredAcquirers.map(acq => (
                <div key={acq.id} onClick={() => { set('acquirerId', acq.id); set('acquirerName', acq.name); set('acquirerSector', acq.sector) }}
                  className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${form.acquirerId === acq.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : 'hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Building2 size={16} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{acq.name}</p>
                      <p className="text-xs text-slate-400">{acq.sector} · TIN: {acq.tin}</p>
                    </div>
                  </div>
                  {form.acquirerId === acq.id && <CheckCircle size={16} className="text-brand-600 flex-shrink-0" />}
                </div>
              ))}
            </div>
            {form.acquirerId && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 flex items-center gap-3">
                <CheckCircle size={16} className="text-brand-600" />
                <div>
                  <p className="text-sm font-semibold text-brand-800">{form.acquirerName}</p>
                  <p className="text-xs text-brand-600">{form.acquirerSector} — selected as Software Acquirer</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Document Upload</h3>
              <p className="text-sm text-slate-500">Attach the signed technology agreement and supporting technical documents.</p>
            </div>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-brand-400 transition-colors cursor-pointer"
              onClick={() => set('docs', [...form.docs, `Agreement_Document_${form.docs.length + 1}.pdf`])}>
              <Upload size={28} className="text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">Click to simulate file upload</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX — max 25MB per file</p>
            </div>
            {form.docs.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Uploaded Files</p>
                {form.docs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2 text-brand-700 text-sm">
                      <CheckCircle size={14} />
                      {doc}
                    </div>
                    <button onClick={() => set('docs', form.docs.filter((_, j) => j !== i))}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer">Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-700 font-semibold mb-1">Required Documents</p>
              <ul className="text-xs text-amber-600 space-y-1 list-disc list-inside">
                <li>Signed Technology Agreement (full copy with all schedules)</li>
                <li>Technical Specification Sheet or Product Datasheet</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-lg mb-0.5">Review & Submit</h3>
              <p className="text-sm text-slate-500">Confirm all details before submitting to NOTAP.</p>
            </div>
            <div className="space-y-3">
              {[
                { section: 'Technology', items: [
                  ['Technology Name', form.technologyName || '—'],
                  ['Category', form.category || '—'],
                  ['Version', form.version || '—'],
                  ['Foreign OEM', form.oemName ? `${form.oemName} (${form.oemCountry})` : '—'],
                ]},
                { section: 'Agreement', items: [
                  ['Signing Date', form.signingDate || '—'],
                  ['Effective Date', form.effectiveDate || '—'],
                  ['Expiry Date', form.expiryDate || '—'],
                  ['Fee', form.agreementFee ? `${form.feeCurrency} ${form.agreementFee}` : '—'],
                ]},
                { section: 'Software Acquirer', items: [
                  ['Company', form.acquirerName || '—'],
                  ['Sector', form.acquirerSector || '—'],
                ]},
                { section: 'Documents', items: [
                  ['Files Attached', form.docs.length > 0 ? form.docs.join(', ') : 'None'],
                ]},
              ].map(({ section, items }) => (
                <div key={section} className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{section}</p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {items.map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="text-sm font-medium text-slate-900 break-words">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-xs text-brand-700">
              By submitting, you confirm that all information provided is accurate and complete. Inlaks Computers Ltd (NTP-TRF-2024-00041) takes responsibility for this submission.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <Button variant="secondary" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/partner')} disabled={false}>
            <ChevronLeft size={15} /> {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 5 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)} disabled={!canAdvance()}>
              Continue <ChevronRight size={15} />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              <CheckCircle size={15} /> Submit to NOTAP
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
