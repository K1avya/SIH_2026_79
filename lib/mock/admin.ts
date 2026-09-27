export interface AdminMetric {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  description: string
}

export const ADMIN_METRICS: AdminMetric[] = [
  {
    title: 'Total Platform Learners',
    value: '4,280',
    change: '+18.4%',
    trend: 'up',
    description: 'Registered students, educators & researchers',
  },
  {
    title: 'Active Daily Learners',
    value: '842',
    change: '+12.1%',
    trend: 'up',
    description: 'Active interactive session in last 24h',
  },
  {
    title: 'Avg Diagnostic Assessment Score',
    value: '6.8 / 10',
    change: '+0.4 pts',
    trend: 'up',
    description: 'Average baseline knowledge score across new registrants',
  },
  {
    title: 'Curriculum Completion Rate',
    value: '64.2%',
    change: '+5.7%',
    trend: 'up',
    description: 'Percentage of users reaching Advanced level',
  },
]

export interface AdminUserRecord {
  id: string
  name: string
  email: string
  role: string
  level: string
  progress: number
  joinedDate: string
  status: 'Active' | 'Inactive'
}

export const ADMIN_USERS: AdminUserRecord[] = [
  { id: 'usr-1', name: 'Alex Vance', email: 'alex.vance@university.edu', role: 'Student', level: 'Intermediate', progress: 68, joinedDate: 'Sep 10, 2026', status: 'Active' },
  { id: 'usr-2', name: 'Dr. Evelyn Reed', email: 'evelyn.reed@mit.edu', role: 'Educator', level: 'Advanced', progress: 100, joinedDate: 'Aug 24, 2026', status: 'Active' },
  { id: 'usr-3', name: 'Marcus Chen', email: 'marcus.c@tech.org', role: 'Researcher', level: 'Advanced', progress: 92, joinedDate: 'Sep 01, 2026', status: 'Active' },
  { id: 'usr-4', name: 'Sarah Jenkins', email: 's.jenkins@student.edu', role: 'Student', level: 'Beginner', progress: 35, joinedDate: 'Sep 15, 2026', status: 'Active' },
  { id: 'usr-5', name: 'David Miller', email: 'dmiller@quantum.io', role: 'Professional', level: 'Intermediate', progress: 74, joinedDate: 'Sep 05, 2026', status: 'Inactive' },
]

export interface AdminQuestionRecord {
  id: number
  category: string
  question: string
  correctAnswer: string
}

export const ADMIN_QUESTIONS: AdminQuestionRecord[] = [
  { id: 1, category: 'Basics', question: 'What fundamental property distinguishes a qubit from a classical bit?', correctAnswer: 'Option B' },
  { id: 2, category: 'Basics', question: 'What happens to a qubit state upon measurement?', correctAnswer: 'Option C' },
  { id: 3, category: 'Qubits & Superposition', question: 'In the Bloch sphere representation, what state is (|0⟩+|1⟩)/√2?', correctAnswer: 'Option C' },
  { id: 4, category: 'Gates', question: 'Which gate acts as a quantum NOT gate?', correctAnswer: 'Option B' },
  { id: 5, category: 'Circuits', question: 'Which circuit sequence generates the Bell state?', correctAnswer: 'Option A' },
]
