import { Cpu } from 'lucide-react'
import { submissions } from '../../data/mockData'
import { Badge } from '../../components/ui'

export default function AcquirerTechnologies() {
  const myTech = submissions.filter(s => s.acquirerName === 'Guaranty Trust Bank Plc')

  return (
    <div>
      <div className="mb-6 animate-fadeInUp">
        <h1 className="font-display font-bold text-2xl text-slate-900">My Technologies</h1>
        <p className="text-sm text-slate-500 mt-1">All foreign technologies registered under Guaranty Trust Bank Plc.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeInUp animate-delay-100">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Technology', 'Foreign OEM', 'Local Partner', 'Agreement Fee', 'Effective', 'Expiry', 'Status'].map(h => (
                <th key={h} className="text-left text-xs text-slate-400 font-semibold uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myTech.map(tech => (
              <tr key={tech.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Cpu size={15} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tech.technology}</p>
                      <p className="text-xs font-mono text-brand-700">{tech.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-slate-700">{tech.oemName}</p>
                  <p className="text-xs text-slate-400">{tech.oemCountry}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{tech.localPartnerName}</td>
                <td className="px-5 py-4 text-sm font-medium text-slate-900">{tech.agreementFee}</td>
                <td className="px-5 py-4 text-xs text-slate-500">{tech.effectiveDate}</td>
                <td className="px-5 py-4 text-xs text-slate-500">{tech.expiryDate}</td>
                <td className="px-5 py-4"><Badge status={tech.status} /></td>
              </tr>
            ))}
            {myTech.length === 0 && (
              <tr><td colSpan={7} className="text-center py-16 text-slate-400 text-sm">No technologies registered.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
