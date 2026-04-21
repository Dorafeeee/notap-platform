import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Building2, Cpu, ChevronRight, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const roles = [
  {
    id: 'admin',
    title: 'NOTAP Administrator',
    subtitle: 'Regulatory Affairs Officer',
    description: 'Review submissions, issue certificates, manage compliance workflows and generate regulatory reports.',
    icon: ShieldCheck,
    color: 'from-brand-700 to-brand-600',
    accent: 'brand',
    badge: 'Regulator',
    org: 'NOTAP — Federal Ministry of Science, Technology & Innovation',
  },
  {
    id: 'partner',
    title: 'Local Partner',
    subtitle: 'Compliance Manager',
    description: 'Submit technology transfer requests on behalf of Software Acquirers. Manage certifications and client portfolio.',
    icon: Building2,
    color: 'from-blue-700 to-blue-500',
    accent: 'blue',
    badge: 'Transferee',
    org: 'Inlaks Computers Ltd — NTP-TRF-2024-00041',
  },
  {
    id: 'acquirer',
    title: 'Software Acquirer',
    subtitle: 'IT Director',
    description: 'View your registered technologies, confirm transactions, and access your digital certificates of compliance.',
    icon: Cpu,
    color: 'from-purple-700 to-purple-500',
    accent: 'purple',
    badge: 'End User',
    org: 'Guaranty Trust Bank Plc',
  },
]

const accentBorder = {
  brand: 'hover:border-brand-500 hover:shadow-brand-100',
  blue: 'hover:border-blue-500 hover:shadow-blue-100',
  purple: 'hover:border-purple-500 hover:shadow-purple-100',
}

const accentBadge = {
  brand: 'bg-brand-100 text-brand-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  const handleLogin = (role) => {
    setLoading(role)
    setTimeout(() => {
      login(role)
      navigate(`/${role}`)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-700 flex flex-col">
      {/* Header bar */}
      <header className="px-8 py-5 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-display font-bold text-sm">NOTAP Compliance Platform</p>
              <p className="text-slate-400 text-xs">Federal Republic of Nigeria</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Lock size={12} />
            Secure Demo Environment
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-900/50 border border-brand-700/50 rounded-full px-4 py-1.5 text-brand-400 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Version 2.0 — Local Partner Driven
            </div>
            <h1 className="font-display font-bold text-4xl text-white mb-3">
              Select Your Portal
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
              This is an interactive demo of the NOTAP Compliance Platform. Choose a role below to explore the platform from that perspective.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`group bg-white rounded-2xl border-2 border-slate-200 p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${accentBorder[role.accent]}`}
                onClick={() => handleLogin(role.id)}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <role.icon size={22} className="text-white" />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${accentBadge[role.accent]}`}>
                    {role.badge}
                  </span>
                </div>

                {/* Text */}
                <h3 className="font-display font-bold text-slate-900 text-lg mb-0.5">{role.title}</h3>
                <p className="text-xs text-slate-400 mb-3 font-medium">{role.subtitle}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{role.description}</p>

                {/* Org */}
                <div className="bg-slate-50 rounded-xl px-3 py-2 mb-5">
                  <p className="text-xs text-slate-500 truncate">{role.org}</p>
                </div>

                {/* CTA */}
                <button
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r ${role.color} text-white shadow-sm hover:shadow-md cursor-pointer`}
                  disabled={loading === role.id}
                >
                  {loading === role.id ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      Enter as {role.title.split(' ')[0]}
                      <ChevronRight size={15} />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-slate-500 text-xs mt-10">
            Demo environment — all data is fictional. Developed for NOTAP, Federal Ministry of Science, Technology and Innovation.
          </p>
        </div>
      </div>
    </div>
  )
}
