'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface UserProfile {
  name: string
  email: string
  role: 'student' | 'admin' | 'educator' | 'researcher'
  educationLevel: string
  quantumExperience: string
  learningGoals: string[]
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  overallProgress: number // 0 - 100
  streak: number
  quizAverage: number
  weakTopics: string[]
  strongTopics: string[]
  completedTopics: string[]
  assessmentCompleted: boolean
  onboardingCompleted: boolean
  bookmarkedResources: string[]
  bookmarkedBooks: string[]
  unlockedBadges: string[]
}

const DEFAULT_USER: UserProfile = {
  name: 'Alex Vance',
  email: 'alex.vance@university.edu',
  role: 'student',
  educationLevel: 'Undergraduate',
  quantumExperience: 'Some basic knowledge',
  learningGoals: ['Learn quantum algorithms', 'Build quantum circuits', 'Quantum programming'],
  level: 'Intermediate',
  overallProgress: 68,
  streak: 7,
  quizAverage: 84,
  weakTopics: ['Quantum Algorithms', 'Circuit Design'],
  strongTopics: ['Qubits & Superposition', 'Pauli Gates'],
  completedTopics: ['intro-quantum', 'qubits', 'superposition', 'measurement'],
  assessmentCompleted: true,
  onboardingCompleted: true,
  bookmarkedResources: ['res-1', 'res-3'],
  bookmarkedBooks: ['book-1'],
  unlockedBadges: ['badge-1', 'badge-2', 'badge-3', 'badge-4'],
}

interface AuthContextType {
  user: UserProfile
  updateUser: (fields: Partial<UserProfile>) => void
  toggleBookmarkResource: (id: string) => void
  toggleBookmarkBook: (id: string) => void
  markTopicCompleted: (topicId: string) => void
  setAssessmentResults: (score: number, level: 'Beginner' | 'Intermediate' | 'Advanced', weak: string[], strong: string[]) => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER)

  useEffect(() => {
    const saved = localStorage.getItem('quantify_user_profile')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved profile', e)
      }
    }
  }, [])

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields }
      if (typeof window !== 'undefined') {
        localStorage.setItem('quantify_user_profile', JSON.stringify(updated))
      }
      return updated
    })
  }

  const toggleBookmarkResource = (id: string) => {
    setUser((prev) => {
      const exists = prev.bookmarkedResources.includes(id)
      const updated = exists
        ? prev.bookmarkedResources.filter((item) => item !== id)
        : [...prev.bookmarkedResources, id]
      const newUser = { ...prev, bookmarkedResources: updated }
      if (typeof window !== 'undefined') {
        localStorage.setItem('quantify_user_profile', JSON.stringify(newUser))
      }
      return newUser
    })
  }

  const toggleBookmarkBook = (id: string) => {
    setUser((prev) => {
      const exists = prev.bookmarkedBooks.includes(id)
      const updated = exists
        ? prev.bookmarkedBooks.filter((item) => item !== id)
        : [...prev.bookmarkedBooks, id]
      const newUser = { ...prev, bookmarkedBooks: updated }
      if (typeof window !== 'undefined') {
        localStorage.setItem('quantify_user_profile', JSON.stringify(newUser))
      }
      return newUser
    })
  }

  const markTopicCompleted = (topicId: string) => {
    setUser((prev) => {
      if (prev.completedTopics.includes(topicId)) return prev
      const updatedTopics = [...prev.completedTopics, topicId]
      const newProgress = Math.min(100, Math.round((updatedTopics.length / 12) * 100))
      const newUser = {
        ...prev,
        completedTopics: updatedTopics,
        overallProgress: newProgress,
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('quantify_user_profile', JSON.stringify(newUser))
      }
      return newUser
    })
  }

  const setAssessmentResults = (
    score: number,
    level: 'Beginner' | 'Intermediate' | 'Advanced',
    weak: string[],
    strong: string[]
  ) => {
    setUser((prev) => {
      const newUser: UserProfile = {
        ...prev,
        level,
        weakTopics: weak,
        strongTopics: strong,
        assessmentCompleted: true,
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('quantify_user_profile', JSON.stringify(newUser))
      }
      return newUser
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        toggleBookmarkResource,
        toggleBookmarkBook,
        markTopicCompleted,
        setAssessmentResults,
        isAdmin: user.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
