import { useState } from 'react'
import { Megaphone, PlusCircle, Users, Building2, Globe, Send } from 'lucide-react'
import { initialAnnouncements } from '../../data/mockData'
import { Button, Modal } from '../../components/ui'

const targetConfig = {
  all: { label: 'All Users', icon: Globe, color: 'bg-brand-100 text-brand-700' },
  partners: { label: 'Local Partners', icon: Building2, color: 'bg-blue-100 text-blue-700' },
  acquirers: { label: 'Software Acquirers', icon: Users, color: 'bg-purple-100 text-purple-700' },
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [composeOpen, setComposeOpen] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', target: 'all' })
  const [toast, setToast] = useState(null)
  const [preview, setPreview] = useState(null)

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSend = () => {
    if (!form.title.trim() || !form.body.trim()) return
    const newAnn = {
      id: `ANN-${String(announcements.length + 1).padStart(3, '0')}`,
      ...form,
      sentDate: new Date().toISOString().slice(0, 10),
      sentBy: 'Emeka Okafor',
      status: 'sent',
    }
    setAnnouncements(prev => [newAnn, ...prev])
    setComposeOpen(false)
    setForm({ title: '', body: '', target: 'all' })
    setToast('Announcement sent successfully.')
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl animate-fadeInUp">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between mb-6 animate-fadeInUp">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Bulk Announcements</h1>
          <p className="text-sm text-slate-500 mt-1">Send platform-wide or targeted notices to registered users.</p>
        </div>
        <Button variant="primary" onClick={() => setComposeOpen(true)}>
          <PlusCircle size={15} /> New Announcement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 animate-fadeInUp animate-delay-100">
        {Object.entries(targetConfig).map(([key, cfg]) => (
          <div key={key} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
              <cfg.icon size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{cfg.label}</p>
              <p className="font-display font-bold text-2xl text-slate-900">
                {announcements.filter(a => a.target === key).length}
              </p>
              <p className="text-xs text-slate-400">sent</p>
            </div>
          </div>
        ))}
      </div>

      {/* Announcements list */}
      <div className="space-y-4 animate-fadeInUp animate-delay-200">
        {announcements.map(ann => {
          const cfg = targetConfig[ann.target]
          return (
            <div key={ann.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Megaphone size={18} className="text-brand-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-slate-900">{ann.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-400">Sent {ann.sentDate} · by {ann.sentBy}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPreview(ann)}>View</Button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 ml-13">{ann.body}</p>
            </div>
          )
        })}
      </div>

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Announcement" size="md">
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${targetConfig[preview.target]?.color}`}>
                {targetConfig[preview.target]?.label}
              </span>
              <span className="text-xs text-slate-400">{preview.sentDate} · {preview.sentBy}</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">{preview.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{preview.body}</p>
          </div>
        )}
      </Modal>

      {/* Compose Modal */}
      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="New Announcement" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Target Audience</label>
            <div className="flex gap-2">
              {Object.entries(targetConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => set('target', key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    form.target === key
                      ? `${cfg.color} border-current`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <cfg.icon size={13} />
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. System Maintenance — 5 April 2026"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message Body</label>
            <textarea
              value={form.body}
              onChange={e => set('body', e.target.value)}
              rows={5}
              placeholder="Write your announcement here..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {form.title && form.body && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Preview</p>
              <p className="text-sm font-semibold text-slate-900 mb-1">{form.title}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{form.body}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => setComposeOpen(false)}>Cancel</Button>
            <button
              onClick={handleSend}
              disabled={!form.title.trim() || !form.body.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send size={14} /> Send Announcement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
