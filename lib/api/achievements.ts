import { supabase } from '@/backend/supabase-client'

export interface Achievement {
  id: string
  title: string
  description: string
  iconName: string
  unlocked: boolean
  unlockedAt?: string
  category: 'Milestone' | 'Simulator' | 'Quiz' | 'Streak'
}

export const FALLBACK_ACHIEVEMENTS: Achievement[] = [
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
    description: 'Maintained an active 7-day quantum learning streak.',
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
    title: 'Socratic Scholar',
    description: 'Engaged in 5 conceptual discussions with the Quanta AI Tutor.',
    iconName: 'MessageSquare',
    unlocked: false,
    category: 'Milestone',
  },
  {
    id: 'badge-8',
    title: 'Quantum Pioneer',
    description: 'Completed the entire core Quantum Foundations curriculum.',
    iconName: 'Trophy',
    unlocked: false,
    category: 'Milestone',
  },
]

/**
 * Fetches real achievements joined with the learner's unlock state from Supabase.
 */
export async function fetchAchievementsServer(
  userId?: string,
  userUnlockedBadges: string[] = []
): Promise<{ data: Achievement[]; error: Error | null }> {
  try {
    const [achieveRes, userAchieveRes] = await Promise.all([
      supabase.from('achievements').select('*'),
      userId ? supabase.from('user_achievements').select('*').eq('user_id', userId) : Promise.resolve({ data: [] as any[], error: null }),
    ])

    if (!achieveRes.error && achieveRes.data && achieveRes.data.length > 0) {
      const userEarnedMap = new Map<string, { isEarned: boolean; earnedAt?: string; progress?: number }>()
      if (userAchieveRes.data) {
        userAchieveRes.data.forEach((ua: any) => {
          userEarnedMap.set(ua.achievementId, {
            isEarned: ua.isEarned,
            earnedAt: ua.earnedAt
              ? new Date(ua.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : undefined,
            progress: ua.progress,
          })
        })
      }

      const mapped: Achievement[] = achieveRes.data.map((b: any) => {
        const userEarned = userEarnedMap.get(b.id)
        const isUnlocked = userEarned?.isEarned || userUnlockedBadges.includes(b.id)
        return {
          id: b.id,
          title: b.title,
          description: b.description,
          iconName: b.icon,
          unlocked: isUnlocked,
          unlockedAt: userEarned?.earnedAt || (isUnlocked ? 'Earned' : undefined),
          category: (b.category || 'Milestone') as any,
        }
      })

      return { data: mapped, error: null }
    }

    return { data: FALLBACK_ACHIEVEMENTS, error: null }
  } catch (err: any) {
    console.warn('fetchAchievementsServer error, returning fallback:', err)
    return { data: FALLBACK_ACHIEVEMENTS, error: err }
  }
}
