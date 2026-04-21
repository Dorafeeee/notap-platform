import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { analyticsData } from '../../data/mockData'
import { TrendingUp, Download } from 'lucide-react'
import { Button } from '../../components/ui'

const SECTOR_COLORS = ['#15803d', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#e2e8f0']

export default function Analytics() {
  const { monthly, sectorBreakdown, oemBreakdown, stats } = analyticsData

  return (
    <div>
      <div className="flex items-start justify-between mb-8 animate-fadeInUp">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Analytics & Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">Data-driven insights on technology transfer activity in Nigeria.</p>
        </div>
        <Button variant="secondary" size="sm">
          <Download size={14} />
          Export Report
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeInUp animate-delay-100">
        {[
          { label: 'Approval Rate', value: `${Math.round((stats.approved / stats.totalSubmissions) * 100)}%`, color: 'text-brand-700' },
          { label: 'Avg. Processing Days', value: '3.8', color: 'text-blue-700' },
          { label: 'Return Rate', value: `${Math.round((stats.returned / stats.totalSubmissions) * 100)}%`, color: 'text-orange-600' },
          { label: 'Rejection Rate', value: `${Math.round((stats.rejected / stats.totalSubmissions) * 100)}%`, color: 'text-red-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs text-slate-500 font-medium mb-2">{kpi.label}</p>
            <p className={`font-display font-bold text-3xl ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly trend bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fadeInUp animate-delay-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900">Monthly Submission Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Oct 2025 — Mar 2026</p>
            </div>
            <TrendingUp size={18} className="text-brand-600" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} barSize={14} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="submitted" name="Submitted" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="approved" name="Approved" fill="#15803d" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returned" name="Returned" fill="#fb923c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sector breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fadeInUp animate-delay-300">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-slate-900">Transfers by Sector</h3>
            <p className="text-xs text-slate-400 mt-0.5">Industry distribution of technology transfers</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sectorBreakdown} dataKey="count" nameKey="sector" cx="45%" cy="50%" outerRadius={85} paddingAngle={2}>
                {sectorBreakdown.map((_, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              <Legend layout="vertical" align="right" verticalAlign="middle" formatter={v => <span style={{ fontSize: '11px', color: '#64748b' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* OEM breakdown table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fadeInUp animate-delay-400">
        <div className="mb-5">
          <h3 className="font-display font-semibold text-slate-900">Top Foreign OEM Partners</h3>
          <p className="text-xs text-slate-400 mt-0.5">Technology sources by submission volume</p>
        </div>
        <div className="space-y-3">
          {oemBreakdown.map((oem, i) => {
            const pct = Math.round((oem.value / 124) * 100)
            return (
              <div key={oem.name} className="flex items-center gap-4">
                <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="w-28 text-sm font-medium text-slate-700 flex-shrink-0">{oem.name}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-bold text-slate-900">{oem.value}</span>
                  <span className="text-xs text-slate-400 ml-1">({pct}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
