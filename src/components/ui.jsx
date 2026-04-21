import { X } from 'lucide-react'

export const statusConfig = {
  pending_review: { label: 'Pending Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  approved: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
  returned: { label: 'Returned', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-400' },
  active: { label: 'Active', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  expiring_soon: { label: 'Expiring Soon', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  expired: { label: 'Expired', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
}

export function Badge({ status, size = 'md' }) {
  const config = statusConfig[status] || statusConfig['pending_review']
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}

export function StatCard({ icon: Icon, label, value, sub, color = 'brand', className = '' }) {
  const colors = {
    brand: 'bg-brand-600 text-white',
    amber: 'bg-amber-500 text-white',
    blue: 'bg-blue-600 text-white',
    slate: 'bg-slate-600 text-white',
    red: 'bg-red-500 text-white',
    orange: 'bg-orange-500 text-white',
  }
  return (
    <div className={`stat-card animate-fadeInUp ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
          <p className="text-3xl font-display font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]} shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button' }) {
  const variants = {
    primary: 'bg-brand-700 hover:bg-brand-800 text-white shadow-sm',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'hover:bg-slate-100 text-slate-600',
    outline: 'border border-brand-700 text-brand-700 hover:bg-brand-50',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-white rounded-2xl shadow-2xl overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-display font-semibold text-slate-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="font-display font-bold text-xl text-slate-900">{title}</h2>
        {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-400" />
      </div>
      <p className="font-display font-semibold text-slate-700">{title}</p>
      <p className="text-sm text-slate-400 mt-1">{sub}</p>
    </div>
  )
}
