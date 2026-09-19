'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  ActiveTab,
  AssessmentAttempt,
  AssessmentCategory,
  AssessmentQuestion,
  BookRecommendation,
  CategoryScore,
  GateType,
  LearningPathItem,
  PlacedGate,
  QuantaAIMessage,
  SimulationResult,
  Topic,
  UserLevel,
  Achievement,
  AuthUser,
  UserRole,
} from '@/types/quantify'
import {
  ASSESSMENT_QUESTIONS,
  CURATED_BOOKS,
  CURRICULUM_TOPICS,
  INITIAL_ACHIEVEMENTS,
} from '@/lib/quantify-data'
import { simulateQuantumCircuit } from '@/lib/quantum-simulator'

interface QuantifyContextType {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  currentUser: AuthUser
  login: (email: string, role?: UserRole, name?: string) => void
  logout: () => void
  userProfile: {
    name: string
    educationLevel: string
    learningGoal: string
  }
  updateProfile: (profile: Partial<QuantifyContextType['userProfile']>) => void
  // Assessment & Level Detection
  assessmentQuestions: AssessmentQuestion[]
  assessmentAnswers: Record<string, string> // questionId -> optionId
  setAssessmentAnswer: (questionId: string, optionId: string) => void
  submitAssessment: () => void
  retakeAssessment: () => void
  assessmentAttempts: AssessmentAttempt[]
  userLevel: UserLevel
  categoryScores: CategoryScore[]
  weakCategories: AssessmentCategory[]
  strongCategories: AssessmentCategory[]
  thresholds: { beginnerMax: number; intermediateMax: number }
  updateThresholds: (t: { beginnerMax: number; intermediateMax: number }) => void
  // Learning Path
  learningPath: LearningPathItem[]
  activeTopic: Topic
  setActiveTopic: (topic: Topic) => void
  markTopicCompleted: (topicId: string) => void
  completedTopics: string[]
  // Circuit Simulator
  qubitCount: number
  setQubitCount: (n: number) => void
  placedGates: PlacedGate[]
  addGate: (type: GateType, targetQubit: number, step: number, controlQubit?: number) => void
  removeGate: (gateId: string) => void
  clearCircuit: () => void
  loadPresetCircuit: (preset: 'superposition' | 'bell_state' | 'ghz_state') => void
  simulationResult: SimulationResult
  runSimulation: () => void
  simulatorError: string | null
  // Quanta AI Tutor
  aiMessages: QuantaAIMessage[]
  askQuantaAI: (prompt: string, isHint?: boolean) => void
  isAILoading: boolean
  // Books & Gamification
  books: BookRecommendation[]
  toggleBookmarkBook: (bookId: string) => void
  achievements: Achievement[]
  streakDays: number
  quizAveragePercent: number
  recordQuizScore: (topicId: string, scorePercent: number) => void
}

const QuantifyContext = createContext<QuantifyContextType | undefined>(undefined)

export function QuantifyProvider({ children, initialTab = 'overview' }: { children: React.ReactNode; initialTab?: ActiveTab }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab)
  const [currentUser, setCurrentUser] = useState<AuthUser>({
    name: 'Ada Lovelace',
    email: 'learner@quantify.edu',
    role: 'learner',
    isAuthenticated: true,
  })

  function login(email: string, role: UserRole = 'learner', name?: string) {
    const defaultName = role === 'admin' ? 'System Administrator' : 'Quantum Scholar'
    const displayName = name || (email.split('@')[0] ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : defaultName)
    setCurrentUser({
      name: displayName,
      email,
      role,
      isAuthenticated: true,
    })
    setUserProfile((prev) => ({ ...prev, name: displayName }))
    if (role === 'admin') {
      setActiveTab('admin')
    } else {
      setActiveTab('overview')
    }
  }

  function logout() {
    setCurrentUser({
      name: 'Guest Learner',
      email: '',
      role: 'learner',
      isAuthenticated: false,
    })
    setActiveTab('login')
  }

  const [userProfile, setUserProfile] = useState({
    name: 'Ada Lovelace',
    educationLevel: 'Undergraduate Computer Science',
    learningGoal: 'Master Quantum Circuit Design & Quantum Algorithms',
  })

  // Level thresholds (FR-LEVEL-001 & FR-LEVEL-005)
  const [thresholds, setThresholds] = useState({
    beginnerMax: 3,
    intermediateMax: 7,
  })

  // Assessment State
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({})
  const [assessmentAttempts, setAssessmentAttempts] = useState<AssessmentAttempt[]>([])
  const [userLevel, setUserLevel] = useState<UserLevel>('intermediate')
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([
    { category: 'basics', categoryName: 'Basics & Postulates', score: 2, total: 2, isWeak: false, isStrong: true },
    { category: 'qubits', categoryName: 'Qubits & Superposition', score: 2, total: 2, isWeak: false, isStrong: true },
    { category: 'gates', categoryName: 'Quantum Gates (X, H, T)', score: 0, total: 2, isWeak: true, isStrong: false },
    { category: 'circuits', categoryName: 'Circuits & Entanglement', score: 1, total: 2, isWeak: false, isStrong: false },
    { category: 'algorithms', categoryName: 'Quantum Algorithms', score: 1, total: 2, isWeak: false, isStrong: false },
  ])

  // Completed Topics & Active Topic
  const [completedTopics, setCompletedTopics] = useState<string[]>(['topic-intro'])
  const [activeTopic, setActiveTopic] = useState<Topic>(CURRICULUM_TOPICS[0])

  // Circuit Simulator State
  const [qubitCount, setQubitCount] = useState<number>(2)
  const [placedGates, setPlacedGates] = useState<PlacedGate[]>([
    { id: 'gate-init-h', type: 'H', targetQubit: 0, step: 0 },
    { id: 'gate-init-cnot', type: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
  ])
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() =>
    simulateQuantumCircuit(2, [
      { id: 'gate-init-h', type: 'H', targetQubit: 0, step: 0 },
      { id: 'gate-init-cnot', type: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
    ])
  )
  const [simulatorError, setSimulatorError] = useState<string | null>(null)

  // AI Tutor Messages
  const [aiMessages, setAiMessages] = useState<QuantaAIMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content:
        'Hello! I am Quanta AI, your personalized quantum computing mentor. I adjust my explanations to your current level (Intermediate). How can I assist with qubits, gates, or circuit mechanics today?',
      timestamp: 'Just now',
      isHint: false,
    },
  ])
  const [isAILoading, setIsAILoading] = useState(false)

  // Books & Gamification
  const [books, setBooks] = useState<BookRecommendation[]>(CURATED_BOOKS)
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS)
  const [streakDays, setStreakDays] = useState(5)
  const [quizScores, setQuizScores] = useState<number[]>([85, 90])

  const weakCategories = categoryScores.filter((c) => c.isWeak).map((c) => c.category)
  const strongCategories = categoryScores.filter((c) => c.isStrong).map((c) => c.category)

  // Adaptive Learning Path Generator (FR-PATH-001 & FR-PATH-002)
  const learningPath: LearningPathItem[] = CURRICULUM_TOPICS.map((topic, index) => {
    const isCompleted = completedTopics.includes(topic.id)
    const isWeak = weakCategories.includes(topic.category)
    let status: 'locked' | 'available' | 'in_progress' | 'completed' = 'available'

    if (isCompleted) {
      status = 'completed'
    } else if (topic.id === activeTopic.id) {
      status = 'in_progress'
    } else if (index > 4 && !isCompleted) {
      status = 'available'
    }

    return {
      id: `path-item-${topic.id}`,
      topicId: topic.id,
      topic,
      status,
      sequenceOrder: isWeak ? index - 10 : index, // Re-order / prioritize weak topics to front!
      isWeakPriority: isWeak,
    }
  }).sort((a, b) => a.sequenceOrder - b.sequenceOrder)

  function updateProfile(newProfile: Partial<QuantifyContextType['userProfile']>) {
    setUserProfile((prev) => ({ ...prev, ...newProfile }))
  }

  function setAssessmentAnswer(questionId: string, optionId: string) {
    setAssessmentAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  function submitAssessment() {
    let scoreTotal = 0
    const catMap: Record<AssessmentCategory, { correct: number; total: number }> = {
      basics: { correct: 0, total: 2 },
      qubits: { correct: 0, total: 2 },
      gates: { correct: 0, total: 2 },
      circuits: { correct: 0, total: 2 },
      algorithms: { correct: 0, total: 2 },
    }

    ASSESSMENT_QUESTIONS.forEach((q) => {
      const selected = assessmentAnswers[q.id]
      const correctOpt = q.options.find((o) => o.isCorrect)?.id
      if (selected && selected === correctOpt) {
        scoreTotal += 1
        catMap[q.category].correct += 1
      }
    })

    // Assign Level according to thresholds (FR-LEVEL-001)
    let assigned: UserLevel = 'beginner'
    if (scoreTotal <= thresholds.beginnerMax) {
      assigned = 'beginner'
    } else if (scoreTotal <= thresholds.intermediateMax) {
      assigned = 'intermediate'
    } else {
      assigned = 'advanced'
    }

    const catScoreList: CategoryScore[] = [
      {
        category: 'basics',
        categoryName: 'Basics & Postulates',
        score: catMap.basics.correct,
        total: 2,
        isWeak: catMap.basics.correct === 0,
        isStrong: catMap.basics.correct === 2,
      },
      {
        category: 'qubits',
        categoryName: 'Qubits & Superposition',
        score: catMap.qubits.correct,
        total: 2,
        isWeak: catMap.qubits.correct === 0,
        isStrong: catMap.qubits.correct === 2,
      },
      {
        category: 'gates',
        categoryName: 'Quantum Gates (X, H, T)',
        score: catMap.gates.correct,
        total: 2,
        isWeak: catMap.gates.correct === 0,
        isStrong: catMap.gates.correct === 2,
      },
      {
        category: 'circuits',
        categoryName: 'Circuits & Entanglement',
        score: catMap.circuits.correct,
        total: 2,
        isWeak: catMap.circuits.correct === 0,
        isStrong: catMap.circuits.correct === 2,
      },
      {
        category: 'algorithms',
        categoryName: 'Quantum Algorithms',
        score: catMap.algorithms.correct,
        total: 2,
        isWeak: catMap.algorithms.correct === 0,
        isStrong: catMap.algorithms.correct === 2,
      },
    ]

    setUserLevel(assigned)
    setCategoryScores(catScoreList)

    const newAttempt: AssessmentAttempt = {
      id: `attempt-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      totalScore: scoreTotal,
      levelAssigned: assigned,
      categoryScores: catScoreList,
      answers: assessmentAnswers,
    }

    setAssessmentAttempts((prev) => [newAttempt, ...prev])
    setActiveTab('result')
  }

  function retakeAssessment() {
    setAssessmentAnswers({})
    setActiveTab('assessment')
  }

  function markTopicCompleted(topicId: string) {
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics((prev) => [...prev, topicId])
    }
  }

  function updateThresholds(newT: { beginnerMax: number; intermediateMax: number }) {
    setThresholds(newT)
  }

  // Simulator methods
  function addGate(type: GateType, targetQubit: number, step: number, controlQubit?: number) {
    setSimulatorError(null)
    if (type === 'CNOT') {
      if (controlQubit === undefined || controlQubit === targetQubit) {
        setSimulatorError('CNOT Error: Control qubit and target qubit must be distinct wires!')
        return
      }
    }
    const newGate: PlacedGate = {
      id: `gate-${Date.now()}-${Math.random()}`,
      type,
      targetQubit,
      controlQubit,
      step,
    }
    setPlacedGates((prev) => {
      // replace if slot is occupied
      const filtered = prev.filter((g) => !(g.targetQubit === targetQubit && g.step === step))
      return [...filtered, newGate]
    })
  }

  function removeGate(gateId: string) {
    setPlacedGates((prev) => prev.filter((g) => g.id !== gateId))
  }

  function clearCircuit() {
    setPlacedGates([])
    setSimulatorError(null)
    const result = simulateQuantumCircuit(qubitCount, [])
    setSimulationResult(result)
  }

  function loadPresetCircuit(preset: 'superposition' | 'bell_state' | 'ghz_state') {
    setSimulatorError(null)
    if (preset === 'superposition') {
      setQubitCount(1)
      const gates: PlacedGate[] = [{ id: 'p-1', type: 'H', targetQubit: 0, step: 0 }]
      setPlacedGates(gates)
      setSimulationResult(simulateQuantumCircuit(1, gates))
    } else if (preset === 'bell_state') {
      setQubitCount(2)
      const gates: PlacedGate[] = [
        { id: 'p-1', type: 'H', targetQubit: 0, step: 0 },
        { id: 'p-2', type: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
      ]
      setPlacedGates(gates)
      setSimulationResult(simulateQuantumCircuit(2, gates))
    } else if (preset === 'ghz_state') {
      setQubitCount(3)
      const gates: PlacedGate[] = [
        { id: 'p-1', type: 'H', targetQubit: 0, step: 0 },
        { id: 'p-2', type: 'CNOT', targetQubit: 1, controlQubit: 0, step: 1 },
        { id: 'p-3', type: 'CNOT', targetQubit: 2, controlQubit: 1, step: 2 },
      ]
      setPlacedGates(gates)
      setSimulationResult(simulateQuantumCircuit(3, gates))
    }
  }

  function runSimulation() {
    try {
      const res = simulateQuantumCircuit(qubitCount, placedGates)
      setSimulationResult(res)
      setSimulatorError(null)
    } catch (err: any) {
      setSimulatorError(`Simulation Failed: ${err.message || 'Unknown error'}`)
    }
  }

  // Quanta AI Tutor logic (FR-AI-001..005)
  function askQuantaAI(prompt: string, isHint = false) {
    const userMsg: QuantaAIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: 'Just now',
      isHint,
    }
    setAiMessages((prev) => [...prev, userMsg])
    setIsAILoading(true)

    // Context-grounded response simulator based on user level & topic
    setTimeout(() => {
      let reply = ''
      const promptLower = prompt.toLowerCase()

      if (promptLower.includes('superposition')) {
        reply =
          userLevel === 'beginner'
            ? 'Think of a classical coin resting flat on a table as either Heads (|0⟩) or Tails (|1⟩). Superposition is like spinning that coin on the table—until you slap your hand down to measure it, it exists in a balanced combination of both possibilities!'
            : 'Mathematically, superposition represents a state vector in a 2-dimensional complex Hilbert space: |ψ⟩ = α|0⟩ + β|1⟩, constrained by the normalization condition |α|² + |β|² = 1. Applying the Hadamard gate maps the basis state |0⟩ to the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2.'
      } else if (promptLower.includes('bell') || promptLower.includes('entangle')) {
        reply =
          'To generate the maximally entangled Bell state |Φ+⟩, we take two qubits initialized to |00⟩. First, apply a Hadamard (H) gate to qubit 0 to create (|0⟩ + |1⟩)/√2. Next, apply a CNOT gate with qubit 0 as control and qubit 1 as target. This yields (|00⟩ + |11⟩)/√2—measuring one qubit instantly determines the other with 100% correlation!'
      } else if (promptLower.includes('cnot')) {
        reply =
          'The Controlled-NOT (CNOT) gate is a 2-qubit entangling gate. If the control qubit is in state |1⟩, it flips the target qubit (|0⟩ ↔ |1⟩). If the control qubit is |0⟩, the target qubit remains completely unchanged.'
      } else {
        reply = `Great question! Since you are currently at the ${userLevel.toUpperCase()} level and studying ${activeTopic.name}, remember that unitary operators preserve vector norms. Would you like to experiment with this directly on the Quantum Circuit Simulator or explore the theoretical derivation?`
      }

      if (isHint) {
        reply = `💡 Quanta AI Hint: Consider how the Born rule connects complex probability amplitudes to real measurement probabilities. Look at the formula |α|² + |β|² = 1!`
      }

      const assistantMsg: QuantaAIMessage = {
        id: `msg-rep-${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: 'Just now',
        isHint,
        groundedTopic: activeTopic.name,
      }

      setAiMessages((prev) => [...prev, assistantMsg])
      setIsAILoading(false)
    }, 800)
  }

  function toggleBookmarkBook(bookId: string) {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, bookmarked: !b.bookmarked } : b))
    )
  }

  function recordQuizScore(topicId: string, scorePercent: number) {
    setQuizScores((prev) => [...prev, scorePercent])
    markTopicCompleted(topicId)
  }

  const quizAveragePercent =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0

  return (
    <QuantifyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        login,
        logout,
        userProfile,
        updateProfile,
        assessmentQuestions: ASSESSMENT_QUESTIONS,
        assessmentAnswers,
        setAssessmentAnswer,
        submitAssessment,
        retakeAssessment,
        assessmentAttempts,
        userLevel,
        categoryScores,
        weakCategories,
        strongCategories,
        thresholds,
        updateThresholds,
        learningPath,
        activeTopic,
        setActiveTopic,
        markTopicCompleted,
        completedTopics,
        qubitCount,
        setQubitCount,
        placedGates,
        addGate,
        removeGate,
        clearCircuit,
        loadPresetCircuit,
        simulationResult,
        runSimulation,
        simulatorError,
        aiMessages,
        askQuantaAI,
        isAILoading,
        books,
        toggleBookmarkBook,
        achievements,
        streakDays,
        quizAveragePercent,
        recordQuizScore,
      }}
    >
      {children}
    </QuantifyContext.Provider>
  )
}

export function useQuantify() {
  const ctx = useContext(QuantifyContext)
  if (!ctx) {
    throw new Error('useQuantify must be used within a QuantifyProvider')
  }
  return ctx
}
