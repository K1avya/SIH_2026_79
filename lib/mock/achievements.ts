export interface Achievement {
  id: string
  title: string
  description: string
  iconName: string
  unlocked: boolean
  unlockedAt?: string
  category: 'Milestone' | 'Simulator' | 'Quiz' | 'Streak'
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'badge-1',
    title: 'First Step',
    description: 'Completed your initial quantum diagnostic assessment.',
    iconName: 'GraduationCap',
    unlocked: true,
    unlockedAt: 'Sep 12, 2026',
    category: 'Milestone',
  },
  {
    id: 'badge-2',
    title: 'Quantum Explorer',
    description: 'Mastered 3 fundamental quantum topics in the learning path.',
    iconName: 'Atom',
    unlocked: true,
    unlockedAt: 'Sep 14, 2026',
    category: 'Milestone',
  },
  {
    id: 'badge-3',
    title: 'Circuit Builder',
    description: 'Successfully created and executed a 2-qubit circuit in the Simulator.',
    iconName: 'Cpu',
    unlocked: true,
    unlockedAt: 'Sep 16, 2026',
    category: 'Simulator',
  },
  {
    id: 'badge-4',
    title: '7-Day Streak',
    description: 'Maintained a active 7-day quantum learning streak.',
    iconName: 'Flame',
    unlocked: true,
    unlockedAt: 'Sep 18, 2026',
    category: 'Streak',
  },
  {
    id: 'badge-5',
    title: 'Quiz Master',
    description: 'Scored 100% on 3 consecutive topic quizzes.',
    iconName: 'Award',
    unlocked: false,
    category: 'Quiz',
  },
  {
    id: 'badge-6',
    title: 'Algorithm Specialist',
    description: 'Constructed Grover Search or Deutsch-Jozsa quantum algorithm circuit.',
    iconName: 'Zap',
    unlocked: false,
    category: 'Simulator',
  },
  {
    id: 'badge-7',
    title: 'Quanta Scholar',
    description: 'Interacted with Quanta AI Tutor for over 10 detailed explanations.',
    iconName: 'MessageSquare',
    unlocked: false,
    category: 'Milestone',
  },
  {
    id: 'badge-8',
    title: 'Quantum Architect',
    description: 'Completed 100% of the Personalized Learning Path curriculum.',
    iconName: 'Trophy',
    unlocked: false,
    category: 'Milestone',
  },
]
