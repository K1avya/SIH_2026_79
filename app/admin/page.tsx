'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  Users,
  HelpCircle,
  Library,
  BookMarked,
  BarChart2,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUpRight,
  X,
  Check,
} from 'lucide-react'
import { ADMIN_METRICS, ADMIN_USERS, ADMIN_QUESTIONS } from '@/lib/mock/admin'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'resources' | 'books'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState('')

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl py-4 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" style={{ borderColor: 'var(--q-line)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 border mb-2 border-violet-500/30 bg-violet-500/10">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrator Management Portal
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Platform Administration</h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-black transition-transform hover:scale-105 shadow-xl shadow-cyan-500/20"
            style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
          >
            <Plus className="h-4 w-4" />
            <span>Add New Content Record</span>
          </button>
        </div>

        {/* Analytics Key Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADMIN_METRICS.map((metric) => (
            <div
              key={metric.title}
              className="rounded-3xl border p-5 backdrop-blur-xl space-y-2"
              style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
            >
              <div className="flex items-center justify-between text-xs text-[var(--q-muted)]">
                <span>{metric.title}</span>
                <span className="flex items-center text-emerald-400 font-bold">
                  {metric.change}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <p className="font-heading text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-[10px] text-[var(--q-muted)]">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Admin Section Tabs */}
        <div className="flex border-b text-xs sm:text-sm font-semibold" style={{ borderColor: 'var(--q-line)' }}>
          {[
            { id: 'users', label: 'User Accounts', icon: <Users className="h-4 w-4" /> },
            { id: 'questions', label: 'Assessment Questions', icon: <HelpCircle className="h-4 w-4" /> },
            { id: 'resources', label: 'Resource Registry', icon: <Library className="h-4 w-4" /> },
            { id: 'books', label: 'Book Recommendations', icon: <BookMarked className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-[var(--q-cyan)] text-[var(--q-cyan)]'
                  : 'border-transparent text-[var(--q-muted)] hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content: Search & Data Table */}
        <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--q-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search admin records..."
                className="w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs text-white outline-none"
                style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
              />
            </div>
          </div>

          {/* Table View */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[var(--q-muted)] uppercase tracking-wider" style={{ borderColor: 'var(--q-line)' }}>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ADMIN_USERS.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-semibold text-white">
                        <p>{usr.name}</p>
                        <p className="text-[10px] text-[var(--q-muted)] font-normal">{usr.email}</p>
                      </td>
                      <td className="py-3 px-4 text-[var(--q-muted)]">{usr.role}</td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-cyan-500/20 text-cyan-300 px-2 py-0.5 font-semibold">
                          {usr.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white font-bold">{usr.progress}%</td>
                      <td className="py-3 px-4 text-[var(--q-muted)]">{usr.joinedDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-[var(--q-muted)] hover:text-white p-1"><Edit2 className="h-3.5 w-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[var(--q-muted)] uppercase tracking-wider" style={{ borderColor: 'var(--q-line)' }}>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Question Prompt</th>
                    <th className="py-3 px-4">Correct Key</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ADMIN_QUESTIONS.map((q) => (
                    <tr key={q.id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-300">Q{q.id}</td>
                      <td className="py-3 px-4 text-[var(--q-muted)]">{q.category}</td>
                      <td className="py-3 px-4 font-medium text-white max-w-md truncate">{q.question}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{q.correctAnswer}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button className="text-[var(--q-muted)] hover:text-white p-1"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button className="text-[var(--q-muted)] hover:text-red-400 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Add Content Record */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowAddModal(false)}>
            <div className="w-full max-w-lg rounded-3xl border p-6 space-y-4" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--q-line)' }}>
                <h3 className="font-heading text-base font-bold text-white">Add New Assessment Question</h3>
                <button onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-slate-400" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[var(--q-muted)] block mb-1">Category:</label>
                  <select className="w-full rounded-xl border p-2.5 text-xs text-white outline-none" style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}>
                    <option value="Basics">Basics</option>
                    <option value="Qubits & Superposition">Qubits & Superposition</option>
                    <option value="Gates">Gates</option>
                    <option value="Circuits">Circuits</option>
                    <option value="Algorithms">Algorithms</option>
                  </select>
                </div>
                <div>
                  <label className="text-[var(--q-muted)] block mb-1">Question Prompt:</label>
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    rows={3}
                    placeholder="Enter realistic quantum computing diagnostic question..."
                    className="w-full rounded-xl border p-3 text-xs text-white outline-none"
                    style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
                <button onClick={() => setShowAddModal(false)} className="rounded-xl border px-4 py-2 text-xs font-semibold text-[var(--q-muted)]" style={{ borderColor: 'var(--q-line)' }}>Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="rounded-xl px-5 py-2 text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}>Save Record</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
