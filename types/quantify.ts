export type UserLevel = 'beginner' | 'intermediate' | 'advanced'

export type AssessmentCategory =
  | 'basics'
  | 'qubits'
  | 'gates'
  | 'circuits'
  | 'algorithms'

export interface AssessmentOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface AssessmentQuestion {
  id: string
  category: AssessmentCategory
  difficulty: UserLevel
  questionText: string
  options: AssessmentOption[]
  explanation: string
}

export interface CategoryScore {
  category: AssessmentCategory
  categoryName: string
  score: number // 0, 1, or 2
  total: number // 2
  isWeak: boolean // 0/2
  isStrong: boolean // 2/2
}

export interface AssessmentAttempt {
  id: string
  timestamp: string
  totalScore: number
  levelAssigned: UserLevel
  categoryScores: CategoryScore[]
  answers: Record<string, string> // questionId -> optionId
}

export interface Topic {
  id: string
  category: AssessmentCategory
  name: string
  level: UserLevel
  sequenceOrder: number
  description: string
  theoryContent: string
  videoUrl: string
  videoDuration: string
  notesUrl: string
  practiceQuestionsCount: number
  keyFormulas: string[]
}

export type TopicStatus = 'locked' | 'available' | 'in_progress' | 'completed'

export interface LearningPathItem {
  id: string
  topicId: string
  topic: Topic
  status: TopicStatus
  sequenceOrder: number
  isWeakPriority: boolean
}

export type GateType = 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' | 'CNOT' | 'SWAP' | 'M'

export interface PlacedGate {
  id: string
  type: GateType
  targetQubit: number // 0 to 4
  controlQubit?: number // for CNOT / SWAP
  step: number // 0 to 7
}

export interface BasisStateProbability {
  state: string // e.g. "|00>", "|01>", "|10>", "|11>"
  probability: number // 0.0 to 1.0
  percentage: number // 0 to 100
  amplitudeReal: number
  amplitudeImag: number
}

export interface SimulationResult {
  qubitCount: number
  basisStates: BasisStateProbability[]
  executionTimeMs: number
  isEntangled: boolean
  stateVector?: { state: string; amplitude: string; magnitude: number }[]
  qiskitCode?: string
  qasm?: string
}

export interface BookRecommendation {
  id: string
  title: string
  author: string
  levelTag: UserLevel
  relatedCategory: AssessmentCategory
  coverImage: string
  whyRecommended: string
  isbn: string
  bookmarked: boolean
}

export interface ResourceItem {
  id: string
  title: string
  type: 'video' | 'notes' | 'article' | 'documentation' | 'practice'
  topicId: string
  topicName: string
  level: UserLevel
  url: string
  durationOrPages: string
  description: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  isEarned: boolean
  earnedAt?: string
  progress: number // 0 to 100
}

export interface QuizQuestion {
  id: string
  questionText: string
  options: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
}

export interface TopicQuiz {
  topicId: string
  topicName: string
  questions: QuizQuestion[]
}

export interface QuantaAIMessage {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
  isHint?: boolean
  groundedTopic?: string
}

export type UserRole = 'learner' | 'admin'

export interface AuthUser {
  name: string
  email: string
  role: UserRole
  isAuthenticated: boolean
}

export type ActiveTab =
  | 'overview'
  | 'login'
  | 'assessment'
  | 'result'
  | 'learning_path'
  | 'topic_learning'
  | 'resource_library'
  | 'circuit_simulator'
  | 'ai_tutor'
  | 'books'
  | 'progress'
  | 'admin'
  | 'onboarding'
