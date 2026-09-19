'use client'

import React, { useState } from 'react'
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RefreshCw,
  Plus,
  MessageSquare,
  BookOpen,
} from 'lucide-react'
import {
  SUGGESTED_QUESTIONS,
  INITIAL_CHAT_MESSAGES,
  ChatMessage,
  getMockAIResponse,
} from '@/lib/mock/tutor'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function TutorPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText
    if (!query.trim()) return

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputText('')
    setIsTyping(true)

    // Simulate AI level-aware response streaming
    setTimeout(() => {
      const aiMsg = getMockAIResponse(query, user.level)
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1100)
  }

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl py-4 space-y-6">
        {/* Tutor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--q-cyan)] border mb-2" style={{ borderColor: 'color-mix(in oklch, var(--q-cyan) 30%, transparent)' }}>
              <Bot className="h-3.5 w-3.5" />
              Level-Aware AI Tutor Active
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Quanta AI Tutor</h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-xl border px-3 py-1.5 font-semibold text-cyan-300" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
              Level Context: {user.level}
            </span>
            <span className="rounded-xl border px-3 py-1.5 font-semibold text-violet-300" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
              Focus: Single-Qubit Gates
            </span>
          </div>
        </div>

        {/* SRS Mandatory Disclaimer Banner */}
        <div className="rounded-2xl border p-4 flex items-center gap-3 text-xs text-amber-200" style={{ borderColor: 'color-mix(in oklch, #F59E0B 40%, transparent)', background: 'color-mix(in oklch, #F59E0B 8%, transparent)' }}>
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <span>
            <strong>Quanta AI Notice:</strong> AI explanations may occasionally be inaccurate. Cross-check exam-critical facts with the provided learning resources and textbook references.
          </span>
        </div>

        {/* Chat Main Layout */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Left History & Suggestions Sidebar */}
          <div className="lg:col-span-1 rounded-3xl border p-5 backdrop-blur-xl space-y-5" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            <button
              onClick={() => setMessages(INITIAL_CHAT_MESSAGES)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--q-cyan)] bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-300 transition-colors hover:bg-cyan-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat Session</span>
            </button>

            <div className="space-y-3">
              <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">Suggested Prompts</h4>
              <div className="space-y-2">
                {SUGGESTED_QUESTIONS.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => handleSend(chip.prompt)}
                    className="w-full text-left rounded-xl border p-2.5 text-xs font-medium text-[var(--q-muted)] hover:text-white hover:border-[var(--q-cyan)] hover:bg-white/5 transition-all line-clamp-2"
                    style={{ borderColor: 'var(--q-line)' }}
                  >
                    💡 {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Chat Messaging Box */}
          <div className="lg:col-span-3 flex flex-col h-[620px] rounded-3xl border backdrop-blur-xl overflow-hidden" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                        isUser
                          ? 'bg-gradient-to-r from-cyan-400 to-violet-500 text-black'
                          : 'bg-violet-600 text-white'
                      }`}
                    >
                      {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`space-y-3 max-w-xl ${isUser ? 'items-end text-right' : ''}`}>
                      <div
                        className={`rounded-3xl p-5 text-sm leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 text-white border border-cyan-500/30'
                            : 'bg-white/5 text-slate-200 border border-white/10'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      {/* Concept Card inside AI Response */}
                      {msg.conceptCard && (
                        <div className="rounded-2xl border p-4 bg-cyan-500/10 border-cyan-500/30 text-xs space-y-1">
                          <p className="font-bold text-cyan-300">💡 {msg.conceptCard.title}</p>
                          <p className="text-slate-300">{msg.conceptCard.summary}</p>
                        </div>
                      )}

                      {/* Code Snippet Box inside AI Response */}
                      {msg.codeSnippet && (
                        <div className="rounded-2xl border bg-black/60 border-white/10 overflow-hidden text-xs font-mono">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                            <span className="text-[10px] text-slate-400">Python (Qiskit)</span>
                            <button
                              onClick={() => copyCode(msg.codeSnippet!, msg.id)}
                              className="flex items-center gap-1 text-[10px] text-cyan-300 hover:underline"
                            >
                              {copiedId === msg.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-cyan-200">{msg.codeSnippet}</pre>
                        </div>
                      )}

                      {/* Feedback Buttons */}
                      {!isUser && (
                        <div className="flex items-center gap-3 text-xs text-[var(--q-muted)] pt-1">
                          <button className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                            <ThumbsUp className="h-3.5 w-3.5" /> Helpful
                          </button>
                          <button className="hover:text-red-400 transition-colors flex items-center gap-1">
                            <ThumbsDown className="h-3.5 w-3.5" /> Not helpful
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Typing Loader */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white">
                    <Bot className="h-5 w-5 animate-spin" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-semibold text-cyan-300 animate-pulse">
                    Quanta AI is formulating a response...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t p-4" style={{ borderColor: 'var(--q-line)' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Quanta AI anything about quantum mechanics, gates, circuits..."
                  className="flex-1 rounded-2xl border py-3.5 px-4 text-sm text-white outline-none transition-colors focus:border-[var(--q-cyan)] focus:ring-2 focus:ring-[var(--q-cyan)]/20"
                  style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-black transition-transform hover:scale-105 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
