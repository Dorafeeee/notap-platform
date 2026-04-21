import { useState } from 'react'
import { Send, MessageSquare, CheckCircle } from 'lucide-react'
import { initialMessages } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function Messaging() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const relevantMessages = isAdmin
    ? initialMessages
    : initialMessages.filter(m => m.participants.partnerCompany === 'Inlaks Computers Ltd')

  const [messages, setMessages] = useState(relevantMessages)
  const [activeId, setActiveId] = useState(messages[0]?.id || null)
  const [draft, setDraft] = useState('')

  const active = messages.find(m => m.id === activeId)

  const sendMessage = () => {
    if (!draft.trim()) return
    setMessages(prev => prev.map(m => m.id === activeId ? {
      ...m,
      lastActivity: new Date().toISOString(),
      thread: [...m.thread, {
        id: m.thread.length + 1,
        sender: user.role === 'admin' ? 'admin' : 'partner',
        senderName: user.name,
        timestamp: new Date().toISOString(),
        text: draft.trim(),
      }]
    } : m))
    setDraft('')
  }

  const statusColors = {
    open: 'bg-brand-50 text-brand-700 border-brand-200',
    resolved: 'bg-slate-100 text-slate-600 border-slate-200',
  }

  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">
          {isAdmin ? 'Secure communication channel with Local Partners.' : 'Direct messages from NOTAP regarding your submissions.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ height: '620px' }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className="w-72 flex-shrink-0 border-r border-slate-100 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => setActiveId(msg.id)}
                  className={`px-4 py-4 cursor-pointer transition-colors ${activeId === msg.id ? 'bg-brand-50 border-l-2 border-l-brand-600' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className={`text-sm font-medium leading-tight ${activeId === msg.id ? 'text-brand-900' : 'text-slate-900'}`}>
                      {msg.participants.partnerCompany}
                    </p>
                    <span className={`text-[10px] border rounded-full px-2 py-0.5 font-medium flex-shrink-0 ml-1 ${statusColors[msg.status]}`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1 truncate">{msg.subject}</p>
                  <p className="text-xs text-slate-400">{timeAgo(msg.lastActivity)}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="py-12 text-center">
                  <MessageSquare size={22} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No messages</p>
                </div>
              )}
            </div>
          </div>

          {/* Thread */}
          {active ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between flex-shrink-0">
                <div>
                  <p className="font-display font-semibold text-slate-900">{active.subject}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-slate-400">Re: <span className="font-mono text-brand-700">{active.submissionId}</span></p>
                    <p className="text-xs text-slate-400">·</p>
                    <p className="text-xs text-slate-400">{active.participants.partnerCompany}</p>
                  </div>
                </div>
                <span className={`text-xs border rounded-full px-3 py-1 font-medium ${statusColors[active.status]}`}>
                  {active.status === 'open' ? 'Open' : 'Resolved'}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {active.thread.map(msg => {
                  const isMe = (isAdmin && msg.sender === 'admin') || (!isAdmin && msg.sender === 'partner')
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-lg ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-xs text-slate-400">{msg.senderName}</span>
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs text-slate-400">{timeAgo(msg.timestamp)}</span>
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-brand-700 text-white rounded-br-sm'
                            : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0">
                {active.status === 'resolved' ? (
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-sm py-2">
                    <CheckCircle size={15} />
                    This conversation is resolved
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!draft.trim()}
                      className="w-10 h-10 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Send size={15} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <MessageSquare size={28} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
