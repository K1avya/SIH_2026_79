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

export const RESOURCES: LearningResource[] = [
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
]
