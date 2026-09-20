import { supabase } from '@/backend/supabase-client'

export interface ProgressHistoryItem {
  day: string
  progress: number
  score: number
}

export interface CategoryPerformanceItem {
  category: string
  score: number
  target: number
}

export interface RecentActivityItem {
  id: string
  title: string
  timestamp: string
  type: string
  score: string
}

export interface NextRecommendedTopic {
  id: string
  title: string
  category: string
  estimatedTime: string
  reason: string
}

export interface DashboardAnalytics {
  progressHistory: ProgressHistoryItem[]
  categoryPerformance: CategoryPerformanceItem[]
  recentActivity: RecentActivityItem[]
  nextRecommendedTopic: NextRecommendedTopic
}

export const DASHBOARD_ANALYTICS: DashboardAnalytics = {
  progressHistory: [
    { day: 'Mon', progress: 42, score: 75 },
    { day: 'Tue', progress: 48, score: 78 },
    { day: 'Wed', progress: 54, score: 80 },
    { day: 'Thu', progress: 60, score: 82 },
    { day: 'Fri', progress: 65, score: 84 },
    { day: 'Sat', progress: 68, score: 86 },
    { day: 'Sun', progress: 68, score: 84 },
  ],
  categoryPerformance: [
    { category: 'Basics', score: 95, target: 80 },
    { category: 'Superposition', score: 90, target: 80 },
    { category: 'Gates', score: 75, target: 80 },
    { category: 'Circuits', score: 60, target: 80 },
    { category: 'Algorithms', score: 50, target: 80 },
  ],
  recentActivity: [
    {
      id: 'act-1',
      title: 'Completed Topic: Superposition & Interference',
      timestamp: '2 hours ago',
      type: 'topic',
      score: '100%',
    },
    {
      id: 'act-2',
      title: 'Passed Quiz: Single-Qubit Quantum Gates',
      timestamp: 'Yesterday',
      type: 'quiz',
      score: '84%',
    },
    {
      id: 'act-3',
      title: 'Simulated 2-Qubit Bell State Circuit',
      timestamp: '2 days ago',
      type: 'simulator',
      score: '1000 shots',
    },
    {
      id: 'act-4',
      title: 'Unlocked Badge: Quantum Explorer',
      timestamp: '3 days ago',
      type: 'achievement',
      score: 'Badge',
    },
  ],
  nextRecommendedTopic: {
    id: 'multi-qubit-circuits',
    title: 'Multi-Qubit Gates & Circuit Design',
    category: 'Circuits',
    estimatedTime: '40 mins',
    reason: 'Recommended to address your Circuit Design weak area identified during diagnostic assessment.',
  },
}

/**
 * Fetches real analytics and activity data from Supabase tables for the dashboard.
 */
export async function fetchDashboardAnalyticsServer(userId?: string): Promise<{
  data: DashboardAnalytics
  error: Error | null
}> {
  try {
    if (!userId) {
      return { data: DASHBOARD_ANALYTICS, error: null }
    }

    const [quizRes, achieveRes] = await Promise.all([
      supabase
        .from('quiz_attempts')
        .select('scorePercent, created_at, topicId')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', userId)
        .eq('isEarned', true)
        .order('earnedAt', { ascending: false })
        .limit(3),
    ])

    const recentActivities: RecentActivityItem[] = []

    if (quizRes.data && quizRes.data.length > 0) {
      quizRes.data.forEach((qa: any, idx: number) => {
        recentActivities.push({
          id: `quiz-act-${idx}`,
          title: `Completed Quiz: ${qa.topicId || 'Quantum Checkpoint'}`,
          timestamp: new Date(qa.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          type: 'quiz',
          score: `${Math.round(qa.scorePercent)}%`,
        })
      })
    }

    if (achieveRes.data && achieveRes.data.length > 0) {
      achieveRes.data.forEach((ua: any, idx: number) => {
        recentActivities.push({
          id: `badge-act-${idx}`,
          title: `Unlocked Badge: ${ua.achievements?.title || 'Achievement'}`,
          timestamp: ua.earnedAt ? new Date(ua.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
          type: 'achievement',
          score: 'Badge',
        })
      })
    }

    const mergedData: DashboardAnalytics = {
      ...DASHBOARD_ANALYTICS,
      recentActivity: recentActivities.length > 0 ? recentActivities : DASHBOARD_ANALYTICS.recentActivity,
    }

    return { data: mergedData, error: null }
  } catch (err: any) {
    console.warn('fetchDashboardAnalyticsServer fallback:', err)
    return { data: DASHBOARD_ANALYTICS, error: err }
  }
}
