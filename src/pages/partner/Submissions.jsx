import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { submissions } from '../../data/mockData'
import { Badge, Button } from '../../components/ui'

export default function PartnerSubmissions() {
  const mySubs = submissions.filter(s => s.localPartnerName === 'Inlaks Computers Ltd')
  const [filter, setFilter] = useState('All')

  const filters = ['All', 'Pending Review', 'Approved', 'Returned', 'Rejected']
  const filterMap = { 'All': null, 'Pending Review': 'pending_review', 'Approved': 'approved', 'Returned': 'returned', 'Rejected': 'rejected' }
  const filtered = filterMap[filter] ? mySubs.filter(s => s.status === filterMap[filter]) : mySubs

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">My Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">All technology transfer submissions you've filed.</p>
        </div>
        <Link to="/partner/new-submission">
          <Button variant="primary">
            <PlusCircle size={15} /> New Submission
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${filter === f ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Submission ID', 'Technology', 'Acquirer', 'Agreement Fee', 'Submitted', 'Status'].map(h => (
                <th key={h} className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sub => (
              <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3.5 text-xs font-mono text-brand-700 font-semibold">{sub.id}</td>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-slate-900">{sub.technology}</p>
                  <p className="text-xs text-slate-400">{sub.oemName}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{sub.acquirerName}</td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{sub.agreementFee}</td>
                <td className="px-5 py-3.5 text-xs text-slate-400">{sub.submittedDate}</td>
                <td className="px-5 py-3.5"><Badge status={sub.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No submissions found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.some(s => s.status === 'returned') && (
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-orange-800 text-sm">Action Required</p>
            <p className="text-orange-600 text-xs mt-0.5">You have a submission returned for correction. Review the NOTAP comment and resubmit.</p>
          </div>
          <Button variant="secondary" size="sm">View Details</Button>
        </div>
      )}
    </div>
  )
}
