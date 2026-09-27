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

export const RECOMMENDED_BOOKS: RecommendedBook[] = [
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
    whyRecommended: 'Recommended for your Intermediate starting level to bridge classical computer science knowledge with quantum linear algebra.',
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
    whyRecommended: 'Recommended because your progress path is heading towards Advanced Quantum Algorithms.',
    coverGradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    rating: 4.9,
    pages: 280,
    description: 'Focuses entirely on the algorithmic core of quantum speedups using clean matrix multiplication and operator math.',
    previewUrl: 'https://mitpress.mit.edu',
  },
]
