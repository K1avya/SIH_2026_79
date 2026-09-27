export interface Topic {
  id: string
  title: string
  category: 'Basics' | 'Qubits & Superposition' | 'Gates' | 'Circuits' | 'Algorithms'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  description: string
  status: 'Completed' | 'In Progress' | 'Available' | 'Locked'
  order: number
  prerequisites: string[]
  content: {
    overview: string
    learningObjectives: string[]
    theory: string
    visualExplanation: {
      type: 'concept' | 'diagram' | 'math'
      title: string
      details: string
    }
    videoUrl?: string
    notesUrl?: string
    practiceQuestions: {
      question: string
      hint: string
    }[]
  }
}

export const TOPICS: Topic[] = [
  {
    id: 'intro-quantum',
    title: 'Introduction to Quantum Computing',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    description: 'Explore the fundamental principles of quantum mechanics applied to computation and classical vs quantum paradigms.',
    status: 'Completed',
    order: 1,
    prerequisites: [],
    content: {
      overview: 'Quantum computing leverages quantum mechanical phenomena such as superposition, interference, and entanglement to process complex calculations exponentially faster than classical computers for specific problem domains.',
      learningObjectives: [
        'Understand the core difference between classical bits and quantum qubits.',
        'Identify key quantum phenomena: Superposition, Entanglement, and Interference.',
        'Recognize practical applications of quantum algorithms in chemistry, optimization, and cryptography.'
      ],
      theory: 'Classical computers store information in bits taking values of strictly 0 or 1. Quantum computing uses quantum bits (qubits), governed by wavefunctions |Ψ⟩. The state space of N qubits spans 2^N dimensions, allowing quantum systems to process vast state spaces simultaneously.',
      visualExplanation: {
        type: 'diagram',
        title: 'Classical Bit vs Quantum Qubit',
        details: 'Classical bit = Binary switch (0 OR 1). Qubit = Sphere surface point (α|0⟩ + β|1⟩ where |α|² + |β|² = 1).'
      },
      videoUrl: 'https://www.youtube.com/embed/QuR969uMICM',
      notesUrl: '/docs/intro-quantum-notes.pdf',
      practiceQuestions: [
        {
          question: 'What mathematical constraint must be satisfied by single qubit state amplitudes α and β?',
          hint: 'The total probability of measuring state |0⟩ or |1⟩ must equal 100%.'
        }
      ]
    }
  },
  {
    id: 'qubits',
    title: 'Qubits & Bloch Sphere',
    category: 'Qubits & Superposition',
    difficulty: 'Beginner',
    estimatedTime: '25 mins',
    description: 'Master single qubit states, bra-ket vector notation, and geometric representation on the Bloch sphere.',
    status: 'Completed',
    order: 2,
    prerequisites: ['intro-quantum'],
    content: {
      overview: 'The Bloch sphere provides a geometric visualization of pure single-qubit states as points on the surface of a unit sphere in 3D space.',
      learningObjectives: [
        'Represent qubits using Dirac bra-ket notation.',
        'Map polar spherical coordinates (θ, φ) to state vector coefficients.',
        'Identify basis states |0⟩, |1⟩, |+⟩, |-⟩, |i+⟩, and |i-⟩.'
      ],
      theory: 'A single qubit state is expressed as |Ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩. Here θ ∈ [0, π] determines latitude and φ ∈ [0, 2π) specifies relative phase longitude on the Bloch sphere.',
      visualExplanation: {
        type: 'concept',
        title: 'Bloch Sphere Geometry',
        details: 'North pole = |0⟩ state. South pole = |1⟩ state. Equator = Superposition states with relative phase angle φ.'
      },
      videoUrl: 'https://www.youtube.com/embed/g_IaVepNDT4',
      notesUrl: '/docs/qubits-bloch-sphere.pdf',
      practiceQuestions: [
        {
          question: 'Where on the Bloch sphere is the state |+⟩ = (|0⟩ + |1⟩)/√2 located?',
          hint: 'θ = π/2 and φ = 0 (positive X-axis).'
        }
      ]
    }
  },
  {
    id: 'superposition',
    title: 'Superposition & Interference',
    category: 'Qubits & Superposition',
    difficulty: 'Beginner',
    estimatedTime: '30 mins',
    description: 'Learn how quantum state amplitudes interfere constructively or destructively to guide computation toward correct answers.',
    status: 'Completed',
    order: 3,
    prerequisites: ['qubits'],
    content: {
      overview: 'Superposition enables qubits to evaluate multiple inputs simultaneously, while quantum interference amplifies valid answer amplitudes and cancels invalid ones.',
      learningObjectives: [
        'Compute probabilities from state amplitudes.',
        'Understand phase coherence and destructive interference.',
        'Formulate mathematical representations of multi-qubit superposition.'
      ],
      theory: 'When two state paths interfere, their complex probability amplitudes sum up: α_total = α_1 + α_2. If amplitudes have opposing signs (e.g. +1/√2 and -1/√2), destructive interference yields probability 0.',
      visualExplanation: {
        type: 'math',
        title: 'Constructive vs Destructive Interference',
        details: 'Constructive: α + α = 2α (Probability 4|α|²). Destructive: α - α = 0 (Probability 0).'
      },
      practiceQuestions: [
        {
          question: 'Why is constructive interference essential in quantum algorithm design?',
          hint: 'Without amplitude amplification, measurement would yield random arbitrary outcomes.'
        }
      ]
    }
  },
  {
    id: 'quantum-gates',
    title: 'Single-Qubit Quantum Gates',
    category: 'Gates',
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    description: 'Master unitary operations including Pauli-X, Y, Z, Hadamard (H), Phase (S), and T gates.',
    status: 'In Progress',
    order: 4,
    prerequisites: ['superposition'],
    content: {
      overview: 'Quantum gates are unitary matrix operations U (U†U = I) that rotate state vectors on the Bloch sphere without changing vector magnitude.',
      learningObjectives: [
        'Construct matrix representations of Pauli gates X, Y, Z and Hadamard H.',
        'Calculate output state vectors for applied single-qubit gates.',
        'Apply Phase S and T gates to induce relative phase rotation.'
      ],
      theory: 'Single qubit gates correspond to 2x2 unitary matrices. Pauli-X = [[0,1],[1,0]], Pauli-Z = [[1,0],[0,-1]], Hadamard H = 1/√2 [[1,1],[1,-1]]. Applying H creates equal-weighted superposition states from standard basis vectors.',
      visualExplanation: {
        type: 'diagram',
        title: 'Hadamard Transformation',
        details: 'H|0⟩ = |+⟩ = (|0⟩+|1⟩)/√2. H|1⟩ = |-⟩ = (|0⟩-|1⟩)/√2.'
      },
      practiceQuestions: [
        {
          question: 'What is the result of applying the Hadamard gate twice consecutively (H · H |Ψ⟩)?',
          hint: 'Hadamard is self-inverse: H = H† = H⁻¹.'
        }
      ]
    }
  },
  {
    id: 'multi-qubit-circuits',
    title: 'Multi-Qubit Gates & Circuit Design',
    category: 'Circuits',
    difficulty: 'Intermediate',
    estimatedTime: '40 mins',
    description: 'Build 2-qubit and 3-qubit circuits using CNOT, SWAP, and Toffoli (CCNOT) gates.',
    status: 'Available',
    order: 5,
    prerequisites: ['quantum-gates'],
    content: {
      overview: 'Multi-qubit gates act on tensor product state spaces (e.g. 2 qubits = 4-dimensional state vector |00⟩, |01⟩, |10⟩, |11⟩) to produce non-local quantum correlations.',
      learningObjectives: [
        'Understand tensor products for multi-qubit system state representation.',
        'Construct 2-qubit CNOT circuits to entangle qubits.',
        'Build reversible logic gates using Toffoli (CCNOT) gates.'
      ],
      theory: 'The Controlled-NOT (CNOT) gate flips target qubit 2 when control qubit 1 is in state |1⟩. CNOT matrix size is 4x4, mapping |10⟩ → |11⟩ and |11⟩ → |10⟩.',
      visualExplanation: {
        type: 'diagram',
        title: 'CNOT Gate Operation',
        details: 'Control q0 = 1 ⟹ Target q1 inverted. Control q0 = 0 ⟹ Target q1 unchanged.'
      },
      practiceQuestions: [
        {
          question: 'What is the output state of CNOT when applied to control qubit in state |+⟩ and target qubit in state |0⟩?',
          hint: 'Produces the Bell state (|00⟩ + |11⟩)/√2.'
        }
      ]
    }
  },
  {
    id: 'entanglement',
    title: 'Quantum Entanglement & Bell States',
    category: 'Circuits',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    description: 'Explore EPR pairs, non-local correlations, and quantum teleportation protocols.',
    status: 'Available',
    order: 6,
    prerequisites: ['multi-qubit-circuits'],
    content: {
      overview: 'Entanglement occurs when a multi-qubit wavefunction cannot be factored into product state vectors of individual qubits: |Ψ_AB⟩ ≠ |Ψ_A⟩ ⊗ |Ψ_B⟩.',
      learningObjectives: [
        'Differentiate separable states from entangled Bell states.',
        'Construct four fundamental Bell states: |Φ+⟩, |Φ-⟩, |Ψ+⟩, |Ψ-⟩.',
        'Analyze non-locality and entanglement-assisted protocols.'
      ],
      theory: 'Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 shows 100% measurement correlation: measuring qubit 1 as 0 instantly guarantees qubit 2 is measured as 0 regardless of distance.',
      visualExplanation: {
        type: 'concept',
        title: 'Bell States',
        details: '|Φ±⟩ = (|00⟩ ± |11⟩)/√2, |Ψ±⟩ = (|01⟩ ± |10⟩)/√2.'
      },
      practiceQuestions: [
        {
          question: 'Can faster-than-light messages be transmitted using quantum entanglement alone?',
          hint: 'No; measurement results are non-deterministic and require classical communications for decoding.'
        }
      ]
    }
  },
  {
    id: 'deutsch-jozsa',
    title: 'Deutsch-Jozsa Algorithm',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    description: 'Understand the first quantum algorithm demonstrating exponential speedup over classical black-box queries.',
    status: 'Locked',
    order: 7,
    prerequisites: ['entanglement'],
    content: {
      overview: 'Determines whether a boolean black-box oracle function f(x) is constant (same output for all inputs) or balanced (output 0 for half, 1 for half) in a single quantum query.',
      learningObjectives: [
        'Formulate phase kickback mechanism using ancillary qubits.',
        'Construct the full Deutsch-Jozsa circuit diagram.',
        'Contrast 1 quantum query vs classical 2^(n-1)+1 queries.'
      ],
      theory: 'An oracle U_f maps |x⟩|y⟩ → |x⟩|y ⊕ f(x)⟩. Setting ancilla y = |-⟩ induces phase kickback: U_f |x⟩|-⟩ = (-1)^(f(x)) |x⟩|-⟩.',
      visualExplanation: {
        type: 'diagram',
        title: 'Phase Kickback Oracle',
        details: 'Phase factors (-1)^f(x) interfere constructively for constant functions and destructively for balanced functions.'
      },
      practiceQuestions: [
        {
          question: 'How many oracle queries does the classical deterministic algorithm require for n bits in worst-case?',
          hint: 'Must evaluate half the domain + 1 = 2^(n-1) + 1.'
        }
      ]
    }
  },
  {
    id: 'grovers-algorithm',
    title: 'Grover’s Search Algorithm',
    category: 'Algorithms',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    description: 'Master amplitude amplification to achieve quadratic speedup for unstructured database search.',
    status: 'Locked',
    order: 8,
    prerequisites: ['deutsch-jozsa'],
    content: {
      overview: 'Grover’s algorithm searches N = 2^n elements for a target item using O(√N) iterations by repeatedly amplifying the probability amplitude of the marked state.',
      learningObjectives: [
        'Understand Oracle phase inversion of target element |ω⟩.',
        'Construct the Diffuser operator (Inversion about average).',
        'Calculate optimal iteration count k ≈ (π/4)√N.'
      ],
      theory: 'Each Grover step consists of: 1) Oracle phase flip |x⟩ → -|x⟩ for marked item, 2) Diffusion operator D = 2|s⟩⟨s| - I which reflects amplitudes about mean amplitude.',
      visualExplanation: {
        type: 'diagram',
        title: 'Amplitude Amplification Steps',
        details: 'Initial state: Equal small amplitudes 1/√N. Iteration: Target amplitude grows, un-marked amplitudes shrink.'
      },
      practiceQuestions: [
        {
          question: 'What happens if Grover iterations are continued past the optimal count k?',
          hint: 'The probability of measuring the target item over-rotates and begins to decrease.'
        }
      ]
    }
  }
]
