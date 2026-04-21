import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, BarChart3, ShieldCheck, Bell,
  LogOut, Menu, Award, PlusCircle, ClipboardList, Cpu,
  CheckCircle, AlertTriangle, Clock, X, Globe, UserCheck,
  MessageSquare, Megaphone
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const notificationsByRole = {
  admin: [
    { id: 1, icon: Clock, color: 'text-amber-500 bg-amber-50', title: 'New submission pending', sub: 'SUB-2026-0092 from SystemSpecs Ltd', time: '10 min ago', read: false },
    { id: 2, icon: Clock, color: 'text-amber-500 bg-amber-50', title: 'New submission pending', sub: 'SUB-2026-0091 from Inlaks Computers', time: '1 hr ago', read: false },
    { id: 3, icon: CheckCircle, color: 'text-brand-600 bg-brand-50', title: 'Certificate issued', sub: 'CERT-2026-0088 — Access Bank Plc', time: '2 days ago', read: true },
    { id: 4, icon: AlertTriangle, color: 'text-orange-500 bg-orange-50', title: 'Submission returned', sub: 'SUB-2026-0079 sent back to MainOne', time: '5 days ago', read: true },
  ],
  partner: [
    { id: 1, icon: CheckCircle, color: 'text-brand-600 bg-brand-50', title: 'Submission approved', sub: 'SUB-2026-0088 — Microsoft 365', time: '2 days ago', read: false },
    { id: 2, icon: AlertTriangle, color: 'text-amber-500 bg-amber-50', title: 'Certificate expiring soon', sub: 'CERT-2025-0244 — expires Nov 2026', time: '1 week ago', read: true },
    { id: 3, icon: Clock, color: 'text-blue-500 bg-blue-50', title: 'Submission under review', sub: 'SUB-2026-0091 — SAP S/4HANA', time: '5 days ago', read: true },
  ],
  acquirer: [
    { id: 1, icon: AlertTriangle, color: 'text-amber-500 bg-amber-50', title: 'Certificate expiring soon', sub: 'Cisco Catalyst — expires Nov 2026', time: '3 days ago', read: false },
    { id: 2, icon: CheckCircle, color: 'text-brand-600 bg-brand-50', title: 'New certificate issued', sub: 'CERT-2026-0088 — Microsoft 365', time: '1 week ago', read: true },
    { id: 3, icon: Clock, color: 'text-blue-500 bg-blue-50', title: 'Submission in review', sub: 'SAP S/4HANA — pending NOTAP approval', time: '5 days ago', read: true },
  ],
}

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/review', label: 'Review Queue', icon: ClipboardList },
  { to: '/admin/registrations', label: 'Registrations', icon: UserCheck },
  { to: '/admin/oem-registry', label: 'OEM Registry', icon: Globe },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

const partnerNav = [
  { to: '/partner', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/partner/submissions', label: 'My Submissions', icon: FileText },
  { to: '/partner/new-submission', label: 'New Submission', icon: PlusCircle },
  { to: '/partner/messages', label: 'Messages', icon: MessageSquare },
]

const acquirerNav = [
  { to: '/acquirer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/acquirer/technologies', label: 'My Technologies', icon: Cpu },
  { to: '/acquirer/certificates', label: 'Certificates', icon: Award },
]

const navByRole = { admin: adminNav, partner: partnerNav, acquirer: acquirerNav }

const roleMeta = {
  admin: { label: 'NOTAP Regulator', color: 'bg-brand-700' },
  partner: { label: 'Local Partner', color: 'bg-blue-700' },
  acquirer: { label: 'Software Acquirer', color: 'bg-purple-700' },
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(notificationsByRole[user?.role] || [])
  const notifRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const dismiss = (id, e) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const nav = navByRole[user?.role] || []
  const meta = roleMeta[user?.role] || {}

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-tight">NOTAP</p>
            <p className="text-slate-400 text-xs">Compliance Platform</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className={`${meta.color} rounded-xl px-3 py-2`}>
          <p className="text-white/70 text-xs">Logged in as</p>
          <p className="text-white font-semibold text-sm font-display">{meta.label}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : 'inactive'}`}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm cursor-pointer"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className="hidden lg:flex flex-col w-60 bg-dark-900 flex-shrink-0">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-60 bg-dark-900">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Federal Republic of Nigeria</p>
              <p className="text-sm font-display font-semibold text-slate-900">National Office for Technology Acquisition and Promotion</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Bell size={18} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-semibold text-slate-900 text-sm">Notifications</p>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-brand-600 hover:text-brand-800 font-medium cursor-pointer transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 && (
                      <div className="py-10 text-center">
                        <Bell size={22} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No notifications</p>
                      </div>
                    )}
                    {notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${!notif.read ? 'bg-brand-50/40' : 'hover:bg-slate-50'}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${notif.color}`}>
                          <notif.icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-tight ${!notif.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{notif.sub}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                        <button
                          onClick={(e) => dismiss(notif.id, e)}
                          className="p-1 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer flex-shrink-0 mt-0.5"
                        >
                          <X size={12} className="text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm font-medium text-slate-700">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
