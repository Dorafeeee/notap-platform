import { FileText, Clock, CheckCircle, XCircle, Award, Users, Building2, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { analyticsData, submissions } from '../../data/mockData'
import { StatCard, Badge, Button, SectionHeader } from '../../components/ui'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#15803d', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7']

export default function AdminDashboard() {
  const { stats, sectorBreakdown } = analyticsData
  const recent = submissions.slice(0, 5)

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 animate-fadeInUp">
        <p className="text-xs text-brand-700 font-semibold uppercase tracking-wider mb-1">Welcome back</p>
        <h1 className="font-display font-bold text-2xl text-slate-900">Regulatory Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor compliance activity across all registered entities.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Total Submissions" value={stats.totalSubmissions} sub="FY 2025–2026" color="blue" className="animate-delay-100" />
        <StatCard icon={Clock} label="Pending Review" value={stats.pending} sub="Awaiting action" color="amber" className="animate-delay-200" />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} sub="Certified" color="brand" className="animate-delay-300" />
        <StatCard icon={Award} label="Active Certificates" value={stats.activeCertificates} sub="In force" color="brand" className="animate-delay-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Secondary stats */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-4 content-start">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-fadeInUp">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-4">Platform Registry</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Building2 size={14} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-600">Registered Local Partners</span>
                </div>
                <span className="font-display font-bold text-slate-900">{stats.registeredPartners}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Users size={14} className="text-purple-600" />
                  </div>
                  <span className="text-sm text-slate-600">Software Acquirers</span>
                </div>
                <span className="font-display font-bold text-slate-900">{stats.registeredAcquirers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <RotateCcw size={14} className="text-orange-500" />
                  </div>
                  <span className="text-sm text-slate-600">Returned for Correction</span>
                </div>
                <span className="font-display font-bold text-slate-900">{stats.returned}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <XCircle size={14} className="text-red-500" />
                  </div>
                  <span className="text-sm text-slate-600">Rejected</span>
                </div>
                <span className="font-display font-bold text-slate-900">{stats.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sector chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-fadeInUp animate-delay-200">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Transfer Activity by Sector</p>
          <p className="font-display font-semibold text-slate-900 text-sm mb-4">March 2026 — Current period</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={sectorBreakdown}
                cx="40%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="count"
                paddingAngle={3}
              >
                {sectorBreakdown.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val, name) => [val, name]} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(val) => <span className="text-xs text-slate-600">{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent submissions table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm animate-fadeInUp animate-delay-300">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-900">Recent Submissions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest activity across all Local Partners</p>
          </div>
          <Link to="/admin/review">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-6 py-3">Submission ID</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Technology</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Acquirer</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Partner</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((sub, i) => (
                <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-xs font-mono text-brand-700 font-semibold">{sub.id}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-slate-900">{sub.technology}</p>
                    <p className="text-xs text-slate-400">{sub.oemName}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{sub.acquirerName}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{sub.localPartnerName}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{sub.submittedDate}</td>
                  <td className="px-4 py-3.5"><Badge status={sub.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
