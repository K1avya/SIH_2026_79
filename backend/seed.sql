-- ==============================================================================
-- QUANTIFY — AI-Based Quantum Science Learning Platform (SIH 2026 - SIH26140)
-- Comprehensive PostgreSQL Seed Data Script (Auto-Converted from Mock Datasets)
-- ==============================================================================
-- Seeds all data from:
--   1. lib/mock/topics.ts (Curriculum Topics)
--   2. lib/mock/assessment.ts & lib/mock/admin.ts (Assessment Questions 1-10)
--   3. lib/mock/quiz.ts (Topic Checkpoint Quizzes: Qubits, Gates, Default)
--   4. lib/mock/books.ts (Recommended Textbooks: book-1 through book-4)
--   5. lib/mock/resources.ts (Educational Library Resources: res-1 through res-16)
--   6. lib/mock/achievements.ts (Platform Badges: badge-1 through badge-8)
--   7. lib/mock/dashboard.ts & lib/mock/admin.ts (Platform Analytics & Settings)
-- ==============================================================================

-- 1. Ensure relaxed constraints for types & categories so both lowercase and original casing work seamlessly
ALTER TABLE public.assessment_questions DROP CONSTRAINT IF EXISTS assessment_questions_category_check;
ALTER TABLE public.assessment_questions ADD CONSTRAINT assessment_questions_category_check 
    CHECK (LOWER(category) IN ('basics', 'qubits', 'qubits & superposition', 'gates', 'circuits', 'algorithms'));

ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_type_check;
ALTER TABLE public.resources ADD CONSTRAINT resources_type_check 
    CHECK (LOWER(type) IN ('video', 'notes', 'article', 'documentation', 'practice', 'paper', 'course', 'notebook'));

ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS "dashboardAnalytics" JSONB;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS "adminMetrics" JSONB;
ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS "sampleAdminUsers" JSONB;

-- ==============================================================================
-- 1. TOPICS (Master Curriculum Topics - needed for foreign keys)
-- ==============================================================================
INSERT INTO public.topics (id, category, name, level, "sequenceOrder", description, "theoryContent", "videoUrl", "videoDuration", "notesUrl", "practiceQuestionsCount", "keyFormulas")
VALUES
(
    'intro-quantum',
    'basics',
    'Introduction to Quantum Computing',
    'beginner',
    1,
    'Explore the fundamental principles of quantum mechanics applied to computation and classical vs quantum paradigms.',
    'Classical computers store information in bits taking values of strictly 0 or 1. Quantum computing uses quantum bits (qubits), governed by wavefunctions |Ψ⟩. The state space of N qubits spans 2^N dimensions, allowing quantum systems to process vast state spaces simultaneously.',
    'https://www.youtube.com/embed/QuR969uMICM',
    '15 mins',
    '/docs/intro-quantum-notes.pdf',
    2,
    ARRAY['|ψ⟩ = α|0⟩ + β|1⟩', '|α|² + |β|² = 1']
),
(
    'qubits',
    'qubits',
    'Qubits & The Bloch Sphere',
    'beginner',
    2,
    'Understand quantum states, wave function superposition, and 3D visualization on the geometric Bloch Sphere.',
    'A single qubit is represented on the Bloch sphere as |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩. Measurement along the computational Z-basis yields outcomes with probabilities P(0) = cos²(θ/2) and P(1) = sin²(θ/2).',
    'https://www.youtube.com/embed/F_Riqjdh2oM',
    '25 mins',
    '/docs/qubits-bloch-sphere.pdf',
    3,
    ARRAY['|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩', 'P(0) = cos²(θ/2)', 'P(1) = sin²(θ/2)']
),
(
    'superposition',
    'qubits',
    'Superposition & Interference',
    'intermediate',
    3,
    'Explore constructive and destructive quantum probability interference and continuous state superposition.',
    'Quantum interference allows probability amplitudes of computational pathways to cancel out incorrect answers while reinforcing correct solutions.',
    'https://www.youtube.com/embed/zNzzGgr2mhk',
    '20 mins',
    '/docs/superposition-interference.pdf',
    2,
    ARRAY['|+⟩ = (|0⟩ + |1⟩)/√2', '|-⟩ = (|0⟩ - |1⟩)/√2']
),
(
    'measurement',
    'basics',
    'Measurement Dynamics & Born Rule',
    'beginner',
    4,
    'Investigate quantum wavefunction collapse and probabilistic projection onto computational basis states.',
    'Measurement irreversibly projects a superposition state into one of the operator observable eigenstates with probability governed by the Born Rule: P(x) = |⟨x|ψ⟩|².',
    'https://www.youtube.com/embed/7V3PqC3Q26E',
    '18 mins',
    '/docs/measurement-born-rule.pdf',
    2,
    ARRAY['P(x) = |⟨x|ψ⟩|²', 'Σ P(x) = 1']
),
(
    'quantum-gates',
    'gates',
    'Single-Qubit Quantum Gates',
    'intermediate',
    5,
    'Learn unitary matrix transformations: Pauli-X, Y, Z, Hadamard, Phase (S), and T gates.',
    'Quantum operations must be unitary: U†U = I. Reversible unitary transformations correspond to rigid rotations of the state vector on the Bloch sphere.',
    'https://www.youtube.com/embed/aQj8nK4m54s',
    '30 mins',
    '/docs/single-qubit-gates.pdf',
    3,
    ARRAY['X = [[0,1],[1,0]]', 'Z = [[1,0],[0,-1]]', 'H = (1/√2)[[1,1],[1,-1]]', 'T = [[1,0],[0,e^(iπ/4)]]']
),
(
    'multi-qubit-circuits',
    'circuits',
    'Multi-Qubit Gates & Circuit Design',
    'intermediate',
    6,
    'Construct multi-qubit quantum circuits using CNOT, SWAP, and Toffoli gates.',
    'Entanglement across multiple qubits is produced via 2-qubit entangling gates. The canonical Controlled-NOT (CNOT) matrix performs |c, t⟩ → |c, t ⊕ c⟩.',
    'https://www.youtube.com/embed/8vK50u6T5Jg',
    '35 mins',
    '/docs/multi-qubit-circuits.pdf',
    3,
    ARRAY['CNOT|00⟩ = |00⟩', 'CNOT|10⟩ = |11⟩', 'dim(H_n) = 2^n']
),
(
    'entanglement-bell',
    'circuits',
    'Quantum Entanglement & Bell States',
    'intermediate',
    7,
    'Study the four maximally entangled 2-qubit Bell states (|Φ±⟩, |Ψ±⟩) and Einstein-Podolsky-Rosen paradox.',
    'Entangled states cannot be written as tensor products of individual subsystem states: |Φ+⟩ = (|00⟩ + |11⟩)/√2 ≠ |ψ_A⟩ ⊗ |ψ_B⟩.',
    'https://www.youtube.com/embed/1Z8r_hBfvGE',
    '28 mins',
    '/docs/bell-states.pdf',
    2,
    ARRAY['|Φ+⟩ = (|00⟩ + |11⟩)/√2', '|Φ-⟩ = (|00⟩ - |11⟩)/√2', '|Ψ+⟩ = (|01⟩ + |10⟩)/√2', '|Ψ-⟩ = (|01⟩ - |10⟩)/√2']
),
(
    'quantum-teleportation',
    'circuits',
    'Quantum Teleportation Protocol',
    'advanced',
    8,
    'Transmit unknown quantum states using an entangled EPR pair, Bell-basis measurement, and classical bits.',
    'By consuming one ebit of entanglement and sending two classical bits, Alice can faithfully teleport an arbitrary state |ψ⟩ to Bob without violating the No-Cloning Theorem.',
    'https://www.youtube.com/embed/6U_2uDug3l8',
    '32 mins',
    '/docs/quantum-teleportation.pdf',
    2,
    ARRAY['2 Classical Bits + 1 Entangled Pair = 1 Teleported Qubit']
),
(
    'deutsch-jozsa',
    'algorithms',
    'Deutsch-Jozsa Algorithm',
    'advanced',
    9,
    'Examine the foundational quantum algorithm proving exponential separation over deterministic classical query complexity.',
    'Determines whether a boolean oracle function f(x) is constant or balanced in a single quantum query, whereas classical deterministic algorithms require 2^(n-1) + 1 queries.',
    'https://www.youtube.com/embed/6wQ1k0rM9qA',
    '25 mins',
    '/docs/deutsch-jozsa.pdf',
    2,
    ARRAY['Quantum: 1 query', 'Classical worst-case: 2^(n-1) + 1 queries']
),
(
    'grover-search',
    'algorithms',
    'Grover’s Search Algorithm',
    'advanced',
    10,
    'Understand quadratic speedup for unstructured search using quantum phase oracles and amplitude amplification.',
    'Amplifies the probability amplitude of target marked states in an unsorted database of size N using O(√N) iterations of the Grover diffusion operator.',
    'https://www.youtube.com/embed/IT_4QG_L2tA',
    '40 mins',
    '/docs/grover-search.pdf',
    3,
    ARRAY['T_quantum = O(√N)', 'T_classical = O(N)', 'R ≈ (π/4)√N iterations']
),
(
    'quantum-phase-estimation',
    'algorithms',
    'Quantum Phase Estimation (QPE)',
    'advanced',
    11,
    'Extract eigenvalues of unitary operators with exponential precision using the Quantum Fourier Transform.',
    'QPE is the algorithmic backbone of Shor''s factoring algorithm and quantum chemistry ground-state energy simulation.',
    'https://www.youtube.com/embed/9B01nK5X2pM',
    '45 mins',
    '/docs/qpe-algorithm.pdf',
    2,
    ARRAY['U|u⟩ = e^(2πiθ)|u⟩', 'QFT†|2^n θ⟩ = |θ⟩']
),
(
    'shor-algorithm',
    'algorithms',
    'Shor’s Factoring Algorithm',
    'advanced',
    12,
    'Explore polynomial-time integer factorization via order-finding and quantum modular exponentiation.',
    'Breaks RSA public-key encryption in polynomial time O((log N)³) by transforming integer factorization into order finding over cyclic groups modulo N.',
    'https://www.youtube.com/embed/Lv7h9qR9N_M',
    '50 mins',
    '/docs/shor-algorithm.pdf',
    3,
    ARRAY['T_quantum = O((log N)³)', 'T_classical = exp(O((log N)^(1/3)))']
),
(
    'default',
    'basics',
    'General Quantum Science Fundamentals',
    'beginner',
    13,
    'General baseline quantum mechanics and physics principles underpinning computation.',
    'Foundational review of linear algebra, complex vector spaces, inner products, and Dirac bra-ket notation.',
    'https://www.youtube.com/embed/QuR969uMICM',
    '15 mins',
    '/docs/general-quantum.pdf',
    2,
    ARRAY['⟨ψ|φ⟩ = complex scalar', '|ψ⟩⟨φ| = projection operator']
)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    name = EXCLUDED.name,
    level = EXCLUDED.level,
    "sequenceOrder" = EXCLUDED."sequenceOrder",
    description = EXCLUDED.description,
    "theoryContent" = EXCLUDED."theoryContent",
    "videoUrl" = EXCLUDED."videoUrl",
    "videoDuration" = EXCLUDED."videoDuration",
    "notesUrl" = EXCLUDED."notesUrl",
    "practiceQuestionsCount" = EXCLUDED."practiceQuestionsCount",
    "keyFormulas" = EXCLUDED."keyFormulas";

-- ==============================================================================
-- 2. ASSESSMENT QUESTIONS (from lib/mock/assessment.ts & lib/mock/admin.ts)
-- ==============================================================================
-- Preserves IDs '1' through '10' so frontend references don't break.
INSERT INTO public.assessment_questions (id, category, difficulty, "questionText", options, explanation, "sequenceOrder")
VALUES
(
    '1',
    'basics',
    'beginner',
    'What fundamental property distinguishes a quantum bit (qubit) from a classical bit?',
    '[
        {"id": "a", "text": "A qubit can store infinite data persistently without loss.", "isCorrect": false},
        {"id": "b", "text": "A qubit can exist in a superposition of states |0⟩ and |1⟩ simultaneously.", "isCorrect": true},
        {"id": "c", "text": "A qubit transmits signals faster than the speed of light.", "isCorrect": false},
        {"id": "d", "text": "A qubit functions as a triple-state logic gate (0, 1, and 2).", "isCorrect": false}
    ]'::jsonb,
    'Unlike classical bits that are strictly 0 or 1, qubits can exist in a linear combination α|0⟩ + β|1⟩ due to quantum superposition.',
    1
),
(
    '2',
    'basics',
    'beginner',
    'What happens to a qubit state α|0⟩ + β|1⟩ upon measurement in the computational basis?',
    '[
        {"id": "a", "text": "It remains unchanged in its superposition state.", "isCorrect": false},
        {"id": "b", "text": "It collapses deterministically into both 0 and 1.", "isCorrect": false},
        {"id": "c", "text": "It collapses probabilistically into either state |0⟩ or |1⟩ with probabilities |α|² and |β|².", "isCorrect": true},
        {"id": "d", "text": "It decays into heat energy and resets to state |0⟩.", "isCorrect": false}
    ]'::jsonb,
    'Born rule dictates that measurement forces a quantum state to collapse to |0⟩ with probability |α|² or |1⟩ with probability |β|² where |α|² + |β|² = 1.',
    2
),
(
    '3',
    'qubits',
    'intermediate',
    'In the Bloch sphere representation of a single qubit, what point corresponds to the state (|0⟩ + |1⟩)/√2?',
    '[
        {"id": "a", "text": "North pole (+Z axis)", "isCorrect": false},
        {"id": "b", "text": "South pole (-Z axis)", "isCorrect": false},
        {"id": "c", "text": "Intersection with the positive X-axis (|x+⟩ state)", "isCorrect": true},
        {"id": "d", "text": "Intersection with the positive Y-axis (|y+⟩ state)", "isCorrect": false}
    ]'::jsonb,
    'The state (|0⟩ + |1⟩)/√2 lies on the equator of the Bloch sphere along the positive X-axis, produced by applying a Hadamard gate to |0⟩.',
    3
),
(
    '4',
    'qubits',
    'intermediate',
    'Given a single qubit in state ψ = (1/√3)|0⟩ + (√(2/3))|1⟩, what is the exact probability of measuring outcome 1?',
    '[
        {"id": "a", "text": "33.3% (1/3)", "isCorrect": false},
        {"id": "b", "text": "66.7% (2/3)", "isCorrect": true},
        {"id": "c", "text": "50% (1/2)", "isCorrect": false},
        {"id": "d", "text": "81.6% (√(2/3))", "isCorrect": false}
    ]'::jsonb,
    'The probability of measuring |1⟩ is the magnitude squared of its complex coefficient β. Here β = √(2/3), so |β|² = 2/3 ≈ 66.7%.',
    4
),
(
    '5',
    'gates',
    'beginner',
    'Which single-qubit quantum gate acts as a quantum NOT gate, mapping |0⟩ to |1⟩ and |1⟩ to |0⟩?',
    '[
        {"id": "a", "text": "Hadamard (H) Gate", "isCorrect": false},
        {"id": "b", "text": "Pauli-X Gate", "isCorrect": true},
        {"id": "c", "text": "Pauli-Z Gate", "isCorrect": false},
        {"id": "d", "text": "Phase (S) Gate", "isCorrect": false}
    ]'::jsonb,
    'The Pauli-X gate flips the computational basis states, converting |0⟩ to |1⟩ and vice versa.',
    5
),
(
    '6',
    'gates',
    'intermediate',
    'What is the resulting state vector when a Hadamard gate (H) is applied to the state |1⟩?',
    '[
        {"id": "a", "text": "(|0⟩ + |1⟩) / √2", "isCorrect": false},
        {"id": "b", "text": "(|0⟩ - |1⟩) / √2", "isCorrect": true},
        {"id": "c", "text": "-|1⟩", "isCorrect": false},
        {"id": "d", "text": "|0⟩", "isCorrect": false}
    ]'::jsonb,
    'Applying H to |1⟩ yields H|1⟩ = (|0⟩ - |1⟩)/√2, known as the |-⟩ state with a relative phase of π.',
    6
),
(
    '7',
    'circuits',
    'intermediate',
    'In a 2-qubit CNOT (Controlled-NOT) gate, what occurs when the control qubit is in state |1⟩?',
    '[
        {"id": "a", "text": "The target qubit remains unchanged.", "isCorrect": false},
        {"id": "b", "text": "The target qubit undergoes a bit-flip (Pauli-X).", "isCorrect": true},
        {"id": "c", "text": "The control qubit is measured and destroyed.", "isCorrect": false},
        {"id": "d", "text": "Both qubits swap their state vector coefficients.", "isCorrect": false}
    ]'::jsonb,
    'The CNOT gate applies an X-flip to the target qubit if and only if the control qubit is in state |1⟩.',
    7
),
(
    '8',
    'circuits',
    'intermediate',
    'Which circuit sequence generates the maximally entangled Bell state (|00⟩ + |11⟩)/√2 starting from |00⟩?',
    '[
        {"id": "a", "text": "Apply H to q0, then CNOT with q0 as control and q1 as target.", "isCorrect": true},
        {"id": "b", "text": "Apply X to q0, then H to q1.", "isCorrect": false},
        {"id": "c", "text": "Apply CNOT to q0 and q1, then apply H to q0.", "isCorrect": false},
        {"id": "d", "text": "Apply Z to q0, followed by X to q1.", "isCorrect": false}
    ]'::jsonb,
    'H on q0 creates (|0⟩+|1⟩)|0⟩ = (|00⟩+|10⟩)/√2. The CNOT flips q1 when q0=1, resulting in (|00⟩+|11⟩)/√2.',
    8
),
(
    '9',
    'algorithms',
    'advanced',
    'What speedup does Grover’s search algorithm achieve over classical unstructured search algorithms?',
    '[
        {"id": "a", "text": "Linear speedup O(N/2)", "isCorrect": false},
        {"id": "b", "text": "Quadratic speedup O(√N)", "isCorrect": true},
        {"id": "c", "text": "Exponential speedup O(log N)", "isCorrect": false},
        {"id": "d", "text": "Constant time speedup O(1)", "isCorrect": false}
    ]'::jsonb,
    'Grover’s algorithm searches an unsorted database of N items in O(√N) quantum oracle iterations, providing a quadratic speedup over classical O(N).',
    9
),
(
    '10',
    'algorithms',
    'advanced',
    'Which quantum algorithm solves prime factorization in polynomial time, posing a challenge to RSA cryptography?',
    '[
        {"id": "a", "text": "Deutsch-Jozsa Algorithm", "isCorrect": false},
        {"id": "b", "text": "Bernstein-Vazirani Algorithm", "isCorrect": false},
        {"id": "c", "text": "Shor’s Algorithm", "isCorrect": true},
        {"id": "d", "text": "Variational Quantum Eigensolver (VQE)", "isCorrect": false}
    ]'::jsonb,
    'Shor’s algorithm factors large integers in O((log N)³) time by utilizing Quantum Phase Estimation and Quantum Fourier Transform.',
    10
)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty,
    "questionText" = EXCLUDED."questionText",
    options = EXCLUDED.options,
    explanation = EXCLUDED.explanation,
    "sequenceOrder" = EXCLUDED."sequenceOrder";

-- ==============================================================================
-- 3. QUIZ QUESTIONS (from lib/mock/quiz.ts)
-- ==============================================================================
INSERT INTO public.quiz_questions (id, "topicId", "questionText", options, explanation)
VALUES
(
    'quiz-qubits-1',
    'qubits',
    'Which Bloch sphere polar angle θ corresponds to the computational basis state |1⟩?',
    '[
        {"id": "opt-1", "text": "θ = 0 (North Pole)", "isCorrect": false},
        {"id": "opt-2", "text": "θ = π/2 (Equator)", "isCorrect": false},
        {"id": "opt-3", "text": "θ = π (South Pole)", "isCorrect": true},
        {"id": "opt-4", "text": "θ = 2π", "isCorrect": false}
    ]'::jsonb,
    'The state |1⟩ corresponds to θ = π (South pole of the Bloch sphere), where cos(π/2)|0⟩ + sin(π/2)|1⟩ = |1⟩.'
),
(
    'quiz-qubits-2',
    'qubits',
    'What is the physical meaning of the relative phase angle φ in state cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩?',
    '[
        {"id": "opt-1", "text": "It changes the total measurement probability of state |0⟩.", "isCorrect": false},
        {"id": "opt-2", "text": "It dictates the azimuthal orientation on the X-Y plane of the Bloch sphere.", "isCorrect": true},
        {"id": "opt-3", "text": "It converts a pure state into a mixed thermal state.", "isCorrect": false},
        {"id": "opt-4", "text": "It increases the energy frequency of the qubit waveform.", "isCorrect": false}
    ]'::jsonb,
    'The relative phase φ determines the rotation angle around the Z-axis in the X-Y equatorial plane, enabling quantum interference.'
),
(
    'quiz-qubits-3',
    'qubits',
    'If a qubit is in state |+⟩ = (|0⟩ + |1⟩)/√2, what is the probability of measuring outcome 0 in the computational basis?',
    '[
        {"id": "opt-1", "text": "25%", "isCorrect": false},
        {"id": "opt-2", "text": "50%", "isCorrect": true},
        {"id": "opt-3", "text": "70.7%", "isCorrect": false},
        {"id": "opt-4", "text": "100%", "isCorrect": false}
    ]'::jsonb,
    'Probability P(0) = |α|² = |1/√2|² = 1/2 = 50%.'
),
(
    'quiz-gates-1',
    'quantum-gates',
    'Which gate is its own Hermitean adjoint and inverse, transforming |0⟩ into (|0⟩+|1⟩)/√2?',
    '[
        {"id": "opt-1", "text": "Pauli-X Gate", "isCorrect": false},
        {"id": "opt-2", "text": "Pauli-Z Gate", "isCorrect": false},
        {"id": "opt-3", "text": "Hadamard Gate", "isCorrect": true},
        {"id": "opt-4", "text": "Toffoli Gate", "isCorrect": false}
    ]'::jsonb,
    'The Hadamard gate H is self-inverse (H = H†) and creates equal superposition from computational basis states.'
),
(
    'quiz-gates-2',
    'quantum-gates',
    'Applying the Pauli-Z gate to the state |1⟩ results in which output state?',
    '[
        {"id": "opt-1", "text": "|0⟩", "isCorrect": false},
        {"id": "opt-2", "text": "-|1⟩", "isCorrect": true},
        {"id": "opt-3", "text": "i|1⟩", "isCorrect": false},
        {"id": "opt-4", "text": "(|0⟩ - |1⟩)/√2", "isCorrect": false}
    ]'::jsonb,
    'Z = [[1,0],[0,-1]], so Z|1⟩ = -|1⟩ (introduces a π phase shift to state |1⟩).'
),
(
    'quiz-gates-3',
    'quantum-gates',
    'What phase angle shift does the T gate apply to the |1⟩ state component?',
    '[
        {"id": "opt-1", "text": "π (180°)", "isCorrect": false},
        {"id": "opt-2", "text": "π/2 (90°)", "isCorrect": false},
        {"id": "opt-3", "text": "π/4 (45°)", "isCorrect": true},
        {"id": "opt-4", "text": "π/8 (22.5°)", "isCorrect": false}
    ]'::jsonb,
    'The T gate is a π/4 (45°) phase gate, mapping |1⟩ → e^(iπ/4)|1⟩. Note T² = S gate.'
),
(
    'quiz-default-1',
    'default',
    'What quantum gate serves as the fundamental control-target building block for two-qubit entanglement?',
    '[
        {"id": "opt-1", "text": "Pauli-Y", "isCorrect": false},
        {"id": "opt-2", "text": "Hadamard", "isCorrect": false},
        {"id": "opt-3", "text": "CNOT", "isCorrect": true},
        {"id": "opt-4", "text": "Phase S", "isCorrect": false}
    ]'::jsonb,
    'The CNOT gate flips the target qubit conditional on the control qubit state, creating entangled Bell states.'
),
(
    'quiz-default-2',
    'default',
    'What is the mathematical condition for a quantum state vector to be normalized?',
    '[
        {"id": "opt-1", "text": "|α| + |β| = 1", "isCorrect": false},
        {"id": "opt-2", "text": "|α|² + |β|² = 1", "isCorrect": true},
        {"id": "opt-3", "text": "α · β = 0", "isCorrect": false},
        {"id": "opt-4", "text": "|α|² · |β|² = 0.5", "isCorrect": false}
    ]'::jsonb,
    'Total probability across all orthogonal measurement basis states must sum to 1.'
)
ON CONFLICT (id) DO UPDATE SET
    "topicId" = EXCLUDED."topicId",
    "questionText" = EXCLUDED."questionText",
    options = EXCLUDED.options,
    explanation = EXCLUDED.explanation;

-- ==============================================================================
-- 4. RECOMMENDED BOOKS (from lib/mock/books.ts)
-- ==============================================================================
INSERT INTO public.books (id, title, author, "levelTag", "relatedCategory", "coverImage", "whyRecommended", isbn, bookmarked, "previewUrl", pages, rating, description)
VALUES
(
    'book-1',
    'Quantum Computation and Quantum Information',
    'Michael A. Nielsen & Isaac L. Chuang',
    'intermediate',
    'gates',
    'linear-gradient(135deg, #4C1D95, #7C3AED)',
    'Recommended because your diagnostic assessment identified Quantum Gates and Circuit Design as key focus areas.',
    '978-1107002173',
    false,
    'https://www.cambridge.org',
    706,
    4.90,
    'Known universally as "Mike & Ike", this is the definitive standard textbook for quantum computing, quantum mechanics, and quantum algorithm theory.'
),
(
    'book-2',
    'Quantum Computing for Computer Scientists',
    'Noson S. Yanofsky & Mirco A. Mannucci',
    'beginner',
    'qubits',
    'linear-gradient(135deg, #06B6D4, #3B82F6)',
    'Recommended for your Intermediate starting level to bridge classical computer science knowledge with quantum linear algebra.',
    '978-0521879965',
    false,
    'https://www.cambridge.org',
    328,
    4.80,
    'Takes computer science students through complex vector spaces, quantum gates, entanglement, and algorithms without requiring prior physics degrees.'
),
(
    'book-3',
    'Learn Quantum Computing with Python and Qiskit',
    'Loredo & IBM Quantum Team',
    'intermediate',
    'circuits',
    'linear-gradient(135deg, #10B981, #06B6D4)',
    'Recommended because you are currently building and testing circuits in the interactive Quantum Simulator.',
    '978-1838827786',
    false,
    'https://qiskit.org',
    412,
    4.70,
    'Hands-on developer guide focused on practical Qiskit code examples, executing quantum programs on IBM Quantum cloud hardware.'
),
(
    'book-4',
    'Quantum Algorithms via Linear Algebra',
    'Richard J. Lipton & Robert V. Regan',
    'advanced',
    'algorithms',
    'linear-gradient(135deg, #F59E0B, #EF4444)',
    'Recommended because your progress path is heading towards Advanced Quantum Algorithms.',
    '978-0262028394',
    false,
    'https://mitpress.mit.edu',
    280,
    4.90,
    'Focuses entirely on the algorithmic core of quantum speedups using clean matrix multiplication and operator math.'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    "levelTag" = EXCLUDED."levelTag",
    "relatedCategory" = EXCLUDED."relatedCategory",
    "coverImage" = EXCLUDED."coverImage",
    "whyRecommended" = EXCLUDED."whyRecommended",
    isbn = EXCLUDED.isbn,
    bookmarked = EXCLUDED.bookmarked,
    "previewUrl" = EXCLUDED."previewUrl",
    pages = EXCLUDED.pages,
    rating = EXCLUDED.rating,
    description = EXCLUDED.description;

-- ==============================================================================
-- 5. EDUCATIONAL RESOURCES (from lib/mock/resources.ts)
-- ==============================================================================
INSERT INTO public.resources (id, title, type, "topicId", "topicName", level, url, "durationOrPages", description)
VALUES
(
    'res-1',
    'Visualizing Quantum Circuits with Qiskit',
    'video',
    'multi-qubit-circuits',
    'Circuits',
    'beginner',
    'https://qiskit.org/learn',
    '18 mins',
    'Learn how to construct, visualize, and simulate single and multi-qubit quantum circuits step by step.'
),
(
    'res-2',
    'Quantum Computation & Quantum Information (Nielsen & Chuang Guide)',
    'documentation',
    'intro-quantum',
    'Basics',
    'intermediate',
    'https://quantum-computing.ibm.com/docs',
    '45 mins read',
    'Essential primer on quantum mechanics, bra-ket algebra, measurement dynamics, and density matrices.'
),
(
    'res-3',
    'Grover’s Search Algorithm: Circuit Breakdown & Proof',
    'practice',
    'grover-search',
    'Algorithms',
    'advanced',
    'https://github.com/quantify-edu/grover-demo',
    '30 mins lab',
    'Interactive Jupyter Notebook implementing Grover search with 3-qubit oracle and diffusion operators.'
),
(
    'res-4',
    'Quantum Teleportation & Superdense Coding Explored',
    'article',
    'entanglement-bell',
    'Entanglement',
    'intermediate',
    'https://arxiv.org/abs/quant-ph/9303001',
    '25 mins read',
    'Comprehensive breakdown of EPR pairs, Bell measurement protocols, and experimental validation.'
),
(
    'res-5',
    'Introduction to Variational Quantum Eigensolver (VQE)',
    'documentation',
    'deutsch-jozsa',
    'Algorithms',
    'advanced',
    'https://pennylane.ai/qml/demos/tutorial_vqe',
    '2 hours',
    'Hands-on hybrid quantum-classical algorithms for molecular energy calculation and chemistry simulation.'
),
(
    'res-6',
    'Pauli Matrices and Single Qubit Transformations',
    'video',
    'quantum-gates',
    'Gates',
    'beginner',
    'https://ocw.mit.edu',
    '32 mins',
    'In-depth lecture explaining Pauli X, Y, Z operators and Bloch sphere rotations.'
),
(
    'res-7',
    'Qiskit — From Zero to Quantum',
    'video',
    'intro-quantum',
    'Basics',
    'beginner',
    'https://www.youtube.com/playlist?list=PLOFEBzvs-VvrXTMy5Y2IqmSaUjfnhvBHR',
    'Video Playlist',
    'Complete video tutorial series covering quantum computing principles and programming with Qiskit.'
),
(
    'res-8',
    'NPTEL - IITM Quantum Computing Series',
    'video',
    'shor-algorithm',
    'Algorithms',
    'intermediate',
    'https://www.youtube.com/playlist?list=PLuBwWyD3M82x9PfxeF7oxb0E122mQAWh6',
    'Video Playlist',
    'Comprehensive academic lecture series on quantum algorithms and quantum information from IIT Madras.'
),
(
    'res-9',
    'IBM Technology Quantum Series',
    'video',
    'intro-quantum',
    'Basics',
    'beginner',
    'https://www.youtube.com/playlist?list=PLOspHqNVtKADPNAxbcP2u6CPzD1g_bBhe',
    'Video Playlist',
    'Bite-sized explanatory videos on quantum computing fundamentals, hardware, and applications.'
),
(
    'res-10',
    'MIT OpenCourseWare Quantum Lectures',
    'video',
    'qubits',
    'Quantum Information',
    'intermediate',
    'https://www.youtube.com/playlist?list=PLUl4u3cNGP61-9PEhRognw5vryrSEVLPr',
    'Video Playlist',
    'Lecture video series on quantum computation and quantum mechanics principles from MIT.'
),
(
    'res-11',
    'Lecture Notes for Physics 219: Quantum Computation',
    'article',
    'intro-quantum',
    'Quantum Computation',
    'advanced',
    'https://www.researchgate.net/publication/238451035_Lecture_Notes_for_Physics_219_Quantum_Computation',
    'Reference Notes',
    'Foundational lecture notes covering quantum states, entanglements, quantum channels, and quantum error correction.'
),
(
    'res-12',
    'MIT Quantum Computation Course Notes',
    'documentation',
    'deutsch-jozsa',
    'Algorithms',
    'intermediate',
    'https://ocw.mit.edu/courses/18-435j-quantum-computation-fall-2003/pages/lecture-notes/',
    'Course / Notes',
    'Lecture notes, assignments, and reference materials for MIT 18.435J / 2.111J Quantum Computation.'
),
(
    'res-13',
    'MIT — Quantum Information Science I',
    'documentation',
    'qubits',
    'Quantum Information',
    'intermediate',
    'https://ocw.mit.edu/courses/8-370x-quantum-information-science-i-spring-2018/?utm_source=chatgpt.com',
    'Course Series',
    'Online course materials for MIT 8.370x covering quantum circuits, algorithms, and quantum information processing.'
),
(
    'res-14',
    'IBM Quantum — Complete Quantum Information Course Series',
    'documentation',
    'qubits',
    'Quantum Information',
    'beginner',
    'https://quantum.cloud.ibm.com/learning/en/courses?utm_source=chatgpt.com',
    'Course Series',
    'Interactive educational modules and full course series on quantum information science hosted by IBM Quantum.'
),
(
    'res-15',
    'TU Delft — Quantum Computing & Information Resources',
    'documentation',
    'shor-algorithm',
    'Quantum Cryptography',
    'intermediate',
    'https://ocw.tudelft.nl/courses/quantum-cryptography/?view=course-materials',
    'Course Materials',
    'Open course materials and notes on quantum cryptography, key distribution, and quantum communications from TU Delft.'
),
(
    'res-16',
    'University of Tennessee — Quantum Information Resources',
    'documentation',
    'intro-quantum',
    'Quantum Information',
    'beginner',
    'https://quantum.utk.edu/courses/introduction-to-quantum-information/resources',
    'Course Resources',
    'Curated course syllabus, reading lists, and lecture resources for Introduction to Quantum Information.'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    type = EXCLUDED.type,
    "topicId" = EXCLUDED."topicId",
    "topicName" = EXCLUDED."topicName",
    level = EXCLUDED.level,
    url = EXCLUDED.url,
    "durationOrPages" = EXCLUDED."durationOrPages",
    description = EXCLUDED.description;

-- ==============================================================================
-- 6. ACHIEVEMENTS & BADGES (from lib/mock/achievements.ts)
-- ==============================================================================
INSERT INTO public.achievements (id, title, description, icon, category)
VALUES
(
    'badge-1',
    'First Step',
    'Completed your initial quantum diagnostic assessment.',
    'GraduationCap',
    'Milestone'
),
(
    'badge-2',
    'Quantum Explorer',
    'Mastered 3 fundamental quantum topics in the learning path.',
    'Atom',
    'Milestone'
),
(
    'badge-3',
    'Circuit Builder',
    'Successfully created and executed a 2-qubit circuit in the Simulator.',
    'Cpu',
    'Simulator'
),
(
    'badge-4',
    '7-Day Streak',
    'Maintained a active 7-day quantum learning streak.',
    'Flame',
    'Streak'
),
(
    'badge-5',
    'Quiz Master',
    'Scored 100% on 3 consecutive topic quizzes.',
    'Award',
    'Quiz'
),
(
    'badge-6',
    'Algorithm Specialist',
    'Constructed Grover Search or Deutsch-Jozsa quantum algorithm circuit.',
    'Zap',
    'Simulator'
),
(
    'badge-7',
    'Quanta Scholar',
    'Interacted with Quanta AI Tutor for over 10 detailed explanations.',
    'MessageSquare',
    'Milestone'
),
(
    'badge-8',
    'Quantum Architect',
    'Completed 100% of the Personalized Learning Path curriculum.',
    'Trophy',
    'Milestone'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category;

-- ==============================================================================
-- 7. PLATFORM SETTINGS & ANALYTICS (from lib/mock/dashboard.ts & lib/mock/admin.ts)
-- ==============================================================================
INSERT INTO public.platform_settings (
    id,
    "beginnerMax",
    "intermediateMax",
    "dashboardAnalytics",
    "adminMetrics",
    "sampleAdminUsers",
    updated_at
)
VALUES (
    'default',
    3,
    7,
    '{
        "progressHistory": [
            {"day": "Mon", "progress": 42, "score": 75},
            {"day": "Tue", "progress": 48, "score": 78},
            {"day": "Wed", "progress": 54, "score": 80},
            {"day": "Thu", "progress": 60, "score": 82},
            {"day": "Fri", "progress": 65, "score": 84},
            {"day": "Sat", "progress": 68, "score": 86},
            {"day": "Sun", "progress": 68, "score": 84}
        ],
        "categoryPerformance": [
            {"category": "Basics", "score": 95, "target": 80},
            {"category": "Superposition", "score": 90, "target": 80},
            {"category": "Gates", "score": 75, "target": 80},
            {"category": "Circuits", "score": 60, "target": 80},
            {"category": "Algorithms", "score": 50, "target": 80}
        ],
        "recentActivity": [
            {"id": "act-1", "title": "Completed Topic: Superposition & Interference", "timestamp": "2 hours ago", "type": "topic", "score": "100%"},
            {"id": "act-2", "title": "Passed Quiz: Single-Qubit Quantum Gates", "timestamp": "Yesterday", "type": "quiz", "score": "84%"},
            {"id": "act-3", "title": "Simulated 2-Qubit Bell State Circuit", "timestamp": "2 days ago", "type": "simulator", "score": "1000 shots"},
            {"id": "act-4", "title": "Unlocked Badge: Quantum Explorer", "timestamp": "3 days ago", "type": "achievement", "score": "Badge"}
        ],
        "nextRecommendedTopic": {
            "id": "multi-qubit-circuits",
            "title": "Multi-Qubit Gates & Circuit Design",
            "category": "Circuits",
            "estimatedTime": "40 mins",
            "reason": "Recommended to address your Circuit Design weak area identified during diagnostic assessment."
        }
    }'::jsonb,
    '[
        {"title": "Total Platform Learners", "value": "4,280", "change": "+18.4%", "trend": "up", "description": "Registered students, educators & researchers"},
        {"title": "Active Daily Learners", "value": "842", "change": "+12.1%", "trend": "up", "description": "Active interactive session in last 24h"},
        {"title": "Avg Diagnostic Assessment Score", "value": "6.8 / 10", "change": "+0.4 pts", "trend": "up", "description": "Average baseline knowledge score across new registrants"},
        {"title": "Curriculum Completion Rate", "value": "64.2%", "change": "+5.7%", "trend": "up", "description": "Percentage of users reaching Advanced level"}
    ]'::jsonb,
    '[
        {"id": "usr-1", "name": "Alex Vance", "email": "alex.vance@university.edu", "role": "Student", "level": "Intermediate", "progress": 68, "joinedDate": "Sep 10, 2026", "status": "Active"},
        {"id": "usr-2", "name": "Dr. Evelyn Reed", "email": "evelyn.reed@mit.edu", "role": "Educator", "level": "Advanced", "progress": 100, "joinedDate": "Aug 24, 2026", "status": "Active"},
        {"id": "usr-3", "name": "Marcus Chen", "email": "marcus.c@tech.org", "role": "Researcher", "level": "Advanced", "progress": 92, "joinedDate": "Sep 01, 2026", "status": "Active"},
        {"id": "usr-4", "name": "Sarah Jenkins", "email": "s.jenkins@student.edu", "role": "Student", "level": "Beginner", "progress": 35, "joinedDate": "Sep 15, 2026", "status": "Active"},
        {"id": "usr-5", "name": "David Miller", "email": "dmiller@quantum.io", "role": "Professional", "level": "Intermediate", "progress": 74, "joinedDate": "Sep 05, 2026", "status": "Inactive"}
    ]'::jsonb,
    timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE SET
    "dashboardAnalytics" = EXCLUDED."dashboardAnalytics",
    "adminMetrics" = EXCLUDED."adminMetrics",
    "sampleAdminUsers" = EXCLUDED."sampleAdminUsers",
    updated_at = EXCLUDED.updated_at;
