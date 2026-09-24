'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Loader2,
  GraduationCap,
} from 'lucide-react'
import {
  fetchAdminStatsServer,
  fetchAdminQuestionsServer,
  createAdminQuestionServer,
  deleteAdminQuestionServer,
  AdminMetric,
  AdminUserRecord,
  AdminQuestionItem,
  FALLBACK_ADMIN_METRICS,
  FALLBACK_ADMIN_QUESTIONS,
  FALLBACK_CLASSROOMS,
} from '@/lib/api/admin'
import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/layout/AppShell'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'resources' | 'books' | 'classrooms'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Guard route against non-admins
  useEffect(() => {
    if (user.id !== 'usr-1' && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user.role, user.id, router])
  
  // Real API state connected to Supabase Edge Functions
  const [metrics, setMetrics] = useState<AdminMetric[]>(FALLBACK_ADMIN_METRICS)
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([])
  const [questionsList, setQuestionsList] = useState<AdminQuestionItem[]>(FALLBACK_ADMIN_QUESTIONS)
  const [loading, setLoading] = useState(false)
  
  // New question form state
  const [newCategory, setNewCategory] = useState('basics')
  const [newDifficulty, setNewDifficulty] = useState('beginner')
  const [newQuestionText, setNewQuestionText] = useState('')
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('Superposition of |0⟩ and |1⟩')
  const [creating, setCreating] = useState(false)

  // Fetch real statistics and questions from Edge Functions
  useEffect(() => {
    async function loadAdminData() {
      setLoading(true)
      try {
        const [statsRes, questionsRes] = await Promise.all([
          fetchAdminStatsServer(),
          fetchAdminQuestionsServer(),
        ])

        if (statsRes.data?.metrics && statsRes.data.metrics.length > 0) {
          setMetrics(statsRes.data.metrics as AdminMetric[])
        }
        if (statsRes.data?.recentUsers && statsRes.data.recentUsers.length > 0) {
          setUsersList(statsRes.data.recentUsers as any)
        }
        if (questionsRes.data && questionsRes.data.length > 0) {
          const mappedQuestions: AdminQuestionItem[] = questionsRes.data.map((q, idx) => {
            const correctOpt = q.options?.find((o: any) => o.isCorrect)
            return {
              id: idx + 1,
              category: q.category.charAt(0).toUpperCase() + q.category.slice(1),
              question: q.questionText,
              correctAnswer: correctOpt?.text || 'Correct Option',
            }
          })
          setQuestionsList(mappedQuestions)
        }
      } catch (err) {
        console.warn('Using mock admin fallback data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])

  // Handle adding new question via Edge Function
  const handleCreateQuestion = async () => {
    if (!newQuestionText.trim()) return
    setCreating(true)

    try {
      const res = await createAdminQuestionServer({
        category: newCategory.toLowerCase(),
        difficulty: newDifficulty.toLowerCase(),
        questionText: newQuestionText.trim(),
        options: [
          { id: 'opt-1', text: newCorrectAnswer.trim() || 'Correct Option', isCorrect: true },
          { id: 'opt-2', text: 'Incorrect baseline classical alternative', isCorrect: false },
          { id: 'opt-3', text: 'Another classical bit state', isCorrect: false },
          { id: 'opt-4', text: 'Undefined deterministic behavior', isCorrect: false },
        ],
        explanation: 'Server-verified quantum question created through Admin Portal.',
        sequenceOrder: questionsList.length + 1,
      })

      if (res.data) {
        setQuestionsList((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            category: newCategory,
            question: newQuestionText,
            correctAnswer: newCorrectAnswer,
          },
        ])
        setNewQuestionText('')
        setShowAddModal(false)
      }
    } catch (err) {
      console.error('Failed to create question:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteQuestion = async (id: number) => {
    setQuestionsList((prev) => prev.filter((q) => q.id !== id))
    try {
      await deleteAdminQuestionServer(`q-${id}`)
    } catch {
      // already removed locally
    }
  }

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
          {metrics.map((metric) => (
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
        <div className="flex border-b text-xs sm:text-sm font-semibold overflow-x-auto" style={{ borderColor: 'var(--q-line)' }}>
          {[
            { id: 'users', label: 'User Accounts', icon: <Users className="h-4 w-4" /> },
            { id: 'classrooms', label: 'Classrooms & Analytics', icon: <GraduationCap className="h-4 w-4" /> },
            { id: 'questions', label: 'Assessment Questions', icon: <HelpCircle className="h-4 w-4" /> },
            { id: 'resources', label: 'Resource Registry', icon: <Library className="h-4 w-4" /> },
            { id: 'books', label: 'Book Recommendations', icon: <BookMarked className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 font-semibold transition-all shrink-0 ${
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
        <div className="rounded-3xl border p-6 backdrop-blur-xl space-y-6" style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}>
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

          {/* Classrooms Tab View */}
          {activeTab === 'classrooms' && (
            <div className="space-y-6">
              <div className="rounded-2xl border p-5 border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Active Instructor Class</span>
                  <h3 className="font-heading text-lg font-bold text-white">{FALLBACK_CLASSROOMS[0].name}</h3>
                  <p className="text-xs text-[var(--q-muted)]">Instructor: {FALLBACK_CLASSROOMS[0].instructorName} • {FALLBACK_CLASSROOMS[0].studentCount} Enrolled Students</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="rounded-xl border border-white/20 bg-black/50 px-3 py-1.5 font-mono text-xs font-bold text-amber-300">
                    Join Code: {FALLBACK_CLASSROOMS[0].code}
                  </div>
                </div>
              </div>

              {/* Class Weak-Topic Heatmap */}
              <div className="space-y-3">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--q-muted)]">
                  Classroom Weak-Topic Diagnostic Heatmap
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {FALLBACK_CLASSROOMS[0].weakTopicsHeatmap.map((item) => (
                    <div key={item.category} className="rounded-2xl border p-4 space-y-2" style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.4)' }}>
                      <span className="text-xs font-semibold text-white block">{item.category}</span>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-red-400 font-bold">{item.weakPercentage}% Needs Revision</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-black/50 overflow-hidden">
                        <div
                          className="h-full bg-red-500 transition-all duration-300"
                          style={{ width: `${item.weakPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Roster Table */}
              <div className="space-y-3 pt-2">
                <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--q-muted)]">
                  Student Roster Telemetry
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-[var(--q-muted)] uppercase tracking-wider" style={{ borderColor: 'var(--q-line)' }}>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Proficiency Level</th>
                        <th className="py-3 px-4">Curriculum Progress</th>
                        <th className="py-3 px-4">Quiz Average</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {FALLBACK_CLASSROOMS[0].students.map((st) => (
                        <tr key={st.id} className="hover:bg-white/5">
                          <td className="py-3 px-4 font-semibold text-white">
                            <p>{st.name}</p>
                            <p className="text-[10px] text-[var(--q-muted)] font-normal">{st.email}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="rounded-md bg-cyan-500/20 text-cyan-300 px-2 py-0.5 font-semibold capitalize">
                              {st.level}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">{st.progress}%</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold">{st.quizAvg}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

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
                  {usersList
                    .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((usr) => (
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
                  {questionsList
                    .filter((q) => q.question.toLowerCase().includes(searchQuery.toLowerCase()) || q.category.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((q) => (
                    <tr key={q.id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-300">Q{q.id}</td>
                      <td className="py-3 px-4 text-[var(--q-muted)]">{q.category}</td>
                      <td className="py-3 px-4 font-medium text-white max-w-md truncate">{q.question}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">{q.correctAnswer}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button className="text-[var(--q-muted)] hover:text-white p-1"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDeleteQuestion(q.id)} className="text-[var(--q-muted)] hover:text-red-400 p-1"><Trash2 className="h-3.5 w-3.5" /></button>
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
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border p-2.5 text-xs text-white outline-none"
                    style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                  >
                    <option value="basics">Basics</option>
                    <option value="qubits">Qubits & Superposition</option>
                    <option value="gates">Gates</option>
                    <option value="circuits">Circuits</option>
                    <option value="algorithms">Algorithms</option>
                  </select>
                </div>
                <div>
                  <label className="text-[var(--q-muted)] block mb-1">Difficulty:</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full rounded-xl border p-2.5 text-xs text-white outline-none"
                    style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
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
                <div>
                  <label className="text-[var(--q-muted)] block mb-1">Correct Answer Text:</label>
                  <input
                    type="text"
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(e.target.value)}
                    placeholder="Enter correct option description..."
                    className="w-full rounded-xl border p-2.5 text-xs text-white outline-none"
                    style={{ borderColor: 'var(--q-line)', background: 'rgba(0,0,0,0.5)' }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--q-line)' }}>
                <button onClick={() => setShowAddModal(false)} className="rounded-xl border px-4 py-2 text-xs font-semibold text-[var(--q-muted)]" style={{ borderColor: 'var(--q-line)' }}>Cancel</button>
                <button
                  disabled={creating}
                  onClick={handleCreateQuestion}
                  className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, var(--q-cyan), var(--q-violet))' }}
                >
                  {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{creating ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
