import { supabase } from '@/backend/supabase-client'

export interface RecommendedBook {
  id: string
  title: string
  author: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  relatedTopic: string
  whyRecommended: string
  coverGradient: string
  rating: number
  pages: number
  description: string
  previewUrl: string
}

export const FALLBACK_BOOKS: RecommendedBook[] = [
  {
    id: 'book-1',
    title: 'Quantum Computation and Quantum Information',
    author: 'Michael A. Nielsen & Isaac L. Chuang',
    level: 'Intermediate',
    relatedTopic: 'Gates & Circuits',
    whyRecommended: 'Recommended because your diagnostic assessment identified Quantum Gates and Circuit Design as key focus areas.',
    coverGradient: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
    rating: 4.9,
    pages: 706,
    description: 'Known universally as "Mike & Ike", this is the definitive standard textbook for quantum computing, quantum mechanics, and quantum algorithm theory.',
    previewUrl: 'https://www.cambridge.org',
  },
  {
    id: 'book-2',
    title: 'Quantum Computing for Computer Scientists',
    author: 'Noson S. Yanofsky & Mirco A. Mannucci',
    level: 'Beginner',
    relatedTopic: 'Qubits & Linear Algebra',
    whyRecommended: 'Recommended for your starting level to bridge classical computer science knowledge with quantum linear algebra.',
    coverGradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    rating: 4.8,
    pages: 328,
    description: 'Takes computer science students through complex vector spaces, quantum gates, entanglement, and algorithms without requiring prior physics degrees.',
    previewUrl: 'https://www.cambridge.org',
  },
  {
    id: 'book-3',
    title: 'Learn Quantum Computing with Python and Qiskit',
    author: 'Loredo & IBM Quantum Team',
    level: 'Intermediate',
    relatedTopic: 'Quantum Circuit Simulator',
    whyRecommended: 'Recommended because you are currently building and testing circuits in the interactive Quantum Simulator.',
    coverGradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    rating: 4.7,
    pages: 412,
    description: 'Hands-on developer guide focused on practical Qiskit code examples, executing quantum programs on IBM Quantum cloud hardware.',
    previewUrl: 'https://qiskit.org',
  },
  {
    id: 'book-4',
    title: 'Quantum Algorithms via Linear Algebra',
    author: 'Richard J. Lipton & Robert V. Regan',
    level: 'Advanced',
    relatedTopic: 'Shor & Grover Algorithms',
    whyRecommended: 'Recommended to expand mathematical mastery into algorithmic complexity, phase estimation, and quantum factoring.',
    coverGradient: 'linear-gradient(135deg, #F59E0B, #DC2626)',
    rating: 4.6,
    pages: 280,
    description: 'A mathematical introduction to quantum computing that develops the theory of quantum algorithms through the lens of matrices and finite-dimensional linear algebra.',
    previewUrl: 'https://mitpress.mit.edu',
  },
]

const GRADIENTS = [
  'linear-gradient(135deg, #0284C7, #0F172A)',
  'linear-gradient(135deg, #7C3AED, #1E1B4B)',
  'linear-gradient(135deg, #059669, #064E3B)',
  'linear-gradient(135deg, #D97706, #451A03)',
]

/**
 * Fetches curated books from Supabase database table `books` with fallback.
 */
export async function fetchBooksServer(): Promise<{ data: RecommendedBook[]; error: Error | null }> {
  try {
    const { data, error } = await supabase.from('books').select('*')

    if (!error && data && data.length > 0) {
      const mapped: RecommendedBook[] = data.map((b: any, idx: number) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        level: (b.levelTag.charAt(0).toUpperCase() + b.levelTag.slice(1)) as any,
        relatedTopic: b.relatedCategory
          ? (b.relatedCategory.charAt(0).toUpperCase() + b.relatedCategory.slice(1))
          : 'Quantum Computing',
        whyRecommended: b.whyRecommended,
        rating: Number(b.rating) || 4.8,
        pages: b.pages || 450,
        previewUrl: b.previewUrl || 'https://www.cambridge.org',
        coverGradient: GRADIENTS[idx % GRADIENTS.length],
        description: b.description || 'Comprehensive quantum mechanics textbook.',
      }))
      return { data: mapped, error: null }
    }

    return { data: FALLBACK_BOOKS, error: null }
  } catch (err: any) {
    console.warn('fetchBooksServer error, returning fallback:', err)
    return { data: FALLBACK_BOOKS, error: err }
  }
}
