import { supabase } from '@/backend/supabase-client'

export interface LearningResource {
  id: string
  title: string
  type: 'Video' | 'Paper' | 'Course' | 'Documentation' | 'Notebook'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  topic: string
  author: string
  duration: string
  description: string
  url: string
}

export const FALLBACK_RESOURCES: LearningResource[] = [
  {
    id: 'res-1',
    title: 'Visualizing Quantum Circuits with Qiskit',
    type: 'Video',
    level: 'Beginner',
    topic: 'Circuits',
    author: 'IBM Quantum Learning',
    duration: '18 mins',
    description: 'Learn how to construct, visualize, and simulate single and multi-qubit quantum circuits step by step.',
    url: 'https://qiskit.org/learn',
  },
  {
    id: 'res-2',
    title: 'Quantum Computation & Quantum Information (Nielsen & Chuang Guide)',
    type: 'Documentation',
    level: 'Intermediate',
    topic: 'Basics',
    author: 'Michael A. Nielsen & Isaac L. Chuang',
    duration: '45 mins read',
    description: 'Essential primer on quantum mechanics, bra-ket algebra, measurement dynamics, and density matrices.',
    url: 'https://quantum-computing.ibm.com/docs',
  },
  {
    id: 'res-3',
    title: 'Grover’s Search Algorithm: Circuit Breakdown & Proof',
    type: 'Notebook',
    level: 'Advanced',
    topic: 'Algorithms',
    author: 'Quantify Open Lab',
    duration: '30 mins lab',
    description: 'Interactive Jupyter Notebook implementing Grover search with 3-qubit oracle and diffusion operators.',
    url: 'https://github.com/quantify-edu/grover-demo',
  },
  {
    id: 'res-4',
    title: 'Quantum Teleportation & Superdense Coding Explored',
    type: 'Paper',
    level: 'Intermediate',
    topic: 'Entanglement',
    author: 'Physical Review Letters / arXiv',
    duration: '25 mins read',
    description: 'Comprehensive breakdown of EPR pairs, Bell measurement protocols, and experimental validation.',
    url: 'https://arxiv.org/abs/quant-ph/9303001',
  },
  {
    id: 'res-5',
    title: 'Introduction to Variational Quantum Eigensolver (VQE)',
    type: 'Course',
    level: 'Advanced',
    topic: 'Algorithms',
    author: 'PennyLane AI',
    duration: '2 hours',
    description: 'Hands-on hybrid quantum-classical algorithms for molecular energy calculation and chemistry simulation.',
    url: 'https://pennylane.ai/qml/demos/tutorial_vqe',
  },
  {
    id: 'res-6',
    title: 'Pauli Matrices and Single Qubit Transformations',
    type: 'Video',
    level: 'Beginner',
    topic: 'Gates',
    author: 'MIT OpenCourseWare',
    duration: '32 mins',
    description: 'In-depth lecture explaining Pauli X, Y, Z operators and Bloch sphere rotations.',
    url: 'https://ocw.mit.edu',
  },
  {
    id: 'res-7',
    title: 'Qiskit — From Zero to Quantum',
    type: 'Video',
    level: 'Beginner',
    topic: 'Basics',
    author: 'Qiskit',
    duration: 'Video Playlist',
    description: 'Complete video tutorial series covering quantum computing principles and programming with Qiskit.',
    url: 'https://www.youtube.com/playlist?list=PLOFEBzvs-VvrXTMy5Y2IqmSaUjfnhvBHR',
  },
  {
    id: 'res-8',
    title: 'NPTEL - IITM Quantum Computing Series',
    type: 'Video',
    level: 'Intermediate',
    topic: 'Algorithms',
    author: 'NPTEL - IITM',
    duration: 'Video Playlist',
    description: 'Comprehensive academic lecture series on quantum algorithms and quantum information from IIT Madras.',
    url: 'https://www.youtube.com/playlist?list=PLuBwWyD3M82x9PfxeF7oxb0E122mQAWh6',
  },
  {
    id: 'res-9',
    title: 'IBM Technology Quantum Series',
    type: 'Video',
    level: 'Beginner',
    topic: 'Basics',
    author: 'IBM Technology',
    duration: 'Video Playlist',
    description: 'Bite-sized explanatory videos on quantum computing fundamentals, hardware, and applications.',
    url: 'https://www.youtube.com/playlist?list=PLOspHqNVtKADPNAxbcP2u6CPzD1g_bBhe',
  },
  {
    id: 'res-10',
    title: 'MIT OpenCourseWare Quantum Lectures',
    type: 'Video',
    level: 'Intermediate',
    topic: 'Quantum Information',
    author: 'MIT OpenCourseWare',
    duration: 'Video Playlist',
    description: 'Lecture video series on quantum computation and quantum mechanics principles from MIT.',
    url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP61-9PEhRognw5vryrSEVLPr',
  },
  {
    id: 'res-11',
    title: 'Lecture Notes for Physics 219: Quantum Computation',
    type: 'Paper',
    level: 'Advanced',
    topic: 'Quantum Computation',
    author: 'John Preskill (Caltech)',
    duration: 'Course Notes',
    description: 'Renowned comprehensive lecture notes covering quantum error correction, fault tolerance, and algorithms.',
    url: 'http://theory.caltech.edu/~preskill/ph219/index.html#lecture',
  },
]

/**
 * Fetches real educational resources from Supabase database table `resources` with fallback.
 */
export async function fetchResourcesServer(): Promise<{ data: LearningResource[]; error: Error | null }> {
  try {
    const { data, error } = await supabase.from('resources').select('*')

    if (!error && data && data.length > 0) {
      const mapped: LearningResource[] = data.map((r: any) => ({
        id: r.id,
        title: r.title,
        type: (r.type.charAt(0).toUpperCase() + r.type.slice(1)) as any,
        topic: r.topicName || 'Quantum Basics',
        level: (r.level.charAt(0).toUpperCase() + r.level.slice(1)) as any,
        url: r.url,
        duration: r.durationOrPages || '20 mins',
        description: r.description,
        author: 'Quantum Science Institute',
      }))
      return { data: mapped, error: null }
    }

    return { data: FALLBACK_RESOURCES, error: null }
  } catch (err: any) {
    console.warn('fetchResourcesServer error, returning fallback:', err)
    return { data: FALLBACK_RESOURCES, error: err }
  }
}
