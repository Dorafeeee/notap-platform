import { FileText, Clock, CheckCircle, RotateCcw, Award, Users, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { submissions, partnerStats, certificates } from '../../data/mockData'
import { StatCard, Badge, Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'

export default function PartnerDashboard() {
  const { user } = useAuth()
  const mySubs = submissions.filter(s => s.localPartnerName === 'Inlaks Computers Ltd')
  const myCerts = certificates.filter(c => c.localPartnerName === 'Inlaks Computers Ltd')

  return (
    <div>
      <div className="mb-8 animate-fadeInUp">
        <p className="text-xs text-brand-700 font-semibold uppercase tracking-wider mb-1">Local Partner Portal</p>
        <h1 className="font-display font-bold text-2xl text-slate-900">Welcome, {user?.name?.split(' ')[0]}</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-100 rounded-full px-3 py-1 text-xs text-brand-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            NOTAP Transferee ID: {user?.transfereeId}
          </div>
          <div className="text-xs text-slate-400">{user?.company}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Total Submissions" value={partnerStats.totalSubmissions} sub="All time" color="blue" className="animate-delay-100" />
        <StatCard icon={Clock} label="Pending Review" value={partnerStats.pending} sub="Awaiting NOTAP" color="amber" className="animate-delay-200" />
        <StatCard icon={CheckCircle} label="Approved" value={partnerStats.approved} color="brand" className="animate-delay-300" />
        <StatCard icon={Award} label="Active Certificates" value={partnerStats.activeCertificates} color="brand" className="animate-delay-400" />
      </div>

      {/* Quick action */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-600 rounded-2xl p-6 mb-6 flex items-center justify-between animate-fadeInUp">
        <div>
          <h3 className="font-display font-bold text-white text-lg">Submit a New Technology Transfer</h3>
          <p className="text-brand-100 text-sm mt-1">Register a technology solution on behalf of a Software Acquirer client.</p>
        </div>
        <Link to="/partner/new-submission">
          <button className="flex items-center gap-2 bg-white text-brand-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-50 transition-colors cursor-pointer shadow-sm">
            <PlusCircle size={16} />
            New Submission
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent submissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-display font-semibold text-slate-900">Recent Submissions</h3>
            <Link to="/partner/submissions"><Button variant="ghost" size="sm">View all</Button></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {mySubs.map(sub => (
              <div key={sub.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-900">{sub.technology}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub.acquirerName} · {sub.submittedDate}</p>
                </div>
                <Badge status={sub.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Active certificates */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp animate-delay-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-display font-semibold text-slate-900">Active Certificates</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {myCerts.map(cert => (
              <div key={cert.id} className="px-6 py-4">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-slate-900 leading-tight">{cert.technology}</p>
                  <Badge status={cert.status} size="sm" />
                </div>
                <p className="text-xs text-slate-400">{cert.acquirerName}</p>
                <p className="text-xs font-mono text-brand-700 mt-1">{cert.id}</p>
                <p className="text-xs text-slate-400">Expires {cert.expiryDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
