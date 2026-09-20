import { supabase } from '@/backend/supabase-client'
import { apiPost } from '@/lib/api/client'

export interface SuggestedChip {
  id: string
  label: string
  prompt: string
}

export const SUGGESTED_QUESTIONS: SuggestedChip[] = [
  { id: 'q1', label: 'What is a qubit?', prompt: 'What is a qubit and how is it different from a classical bit?' },
  { id: 'q2', label: 'Explain superposition simply', prompt: 'Explain superposition simply with a real-world analogy.' },
  { id: 'q3', label: 'Why Hadamard gate?', prompt: 'Why is the Hadamard gate important in quantum circuits?' },
  { id: 'q4', label: 'Explain CNOT gate', prompt: 'How does a CNOT gate entangle two qubits?' },
  { id: 'q5', label: 'Grover’s algorithm', prompt: 'Help me understand Grover’s algorithm and amplitude amplification.' },
]

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text?: string
  content?: string
  timestamp: string
  isHint?: boolean
  groundedTopic?: string
  codeSnippet?: string
  conceptCard?: {
    title: string
    summary: string
    relatedFormula?: string
  }
  feedback?: 'like' | 'dislike'
}

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Greetings Alex! I am **Quanta AI**, your quantum computing learning companion. I notice you are currently working on **Single-Qubit Quantum Gates** at the **Intermediate** level. How can I assist your quantum journey today?',
    timestamp: 'Just now',
    conceptCard: {
      title: 'Current Focus: Single-Qubit Quantum Gates',
      summary: 'Explore unitary matrix transformations, Pauli X/Y/Z matrices, and Hadamard superposition gates.',
    },
  },
]

export function getFallbackTutorResponse(prompt: string, level: string): ChatMessage {
  const lower = prompt.toLowerCase()
  let text = ''
  let codeSnippet: string | undefined = undefined
  let conceptCard: { title: string; summary: string } | undefined = undefined

  if (lower.includes('qubit')) {
    text = `At your **${level}** level, a **Qubit** (quantum bit) is the basic unit of quantum information. Unlike a classical bit which is strictly binary ($0$ or $1$), a qubit exists in a linear combination of states:

$$\\lvert \\psi \\rangle = \\alpha \\lvert 0 \\rangle + \\beta \\lvert 1 \\rangle$$

Where $\\alpha$ and $\\beta$ are complex probability amplitudes satisfying $\\lvert \\alpha \\rvert^2 + \\lvert \\beta \\rvert^2 = 1$.`
    codeSnippet = `# Qiskit single qubit state initialization
from qiskit import QuantumCircuit

qc = QuantumCircuit(1)
qc.h(0) # Put qubit 0 into equal superposition (|0> + |1>)/sqrt(2)
qc.draw('text')`
    conceptCard = {
      title: 'Qubit State Formula',
      summary: 'Probability P(0) = |α|² and P(1) = |β|². Measurement collapses state.',
    }
  } else if (lower.includes('superposition')) {
    text = `**Superposition** allows a quantum system to exist in multiple state basis combinations at once until measured.

Think of a spinning coin: while airborne, it is neither purely heads nor tails, but a dynamic combination of both. Measurement acts like stopping the coin on the table, forcing it to collapse into a definite result.`
    codeSnippet = `# Creating superposition with Hadamard gate in Qiskit
qc = QuantumCircuit(1)
qc.h(0) # Hadamard gate`
  } else if (lower.includes('hadamard')) {
    text = `The **Hadamard (H) Gate** is the gateway to quantum speedup. It maps standard computational basis states into equal superposition:

$$H \\lvert 0 \\rangle = \\frac{\\lvert 0 \\rangle + \\lvert 1 \\rangle}{\\sqrt{2}} = \\lvert + \\rangle$$
$$H \\lvert 1 \\rangle = \\frac{\\lvert 0 \\rangle - \\lvert 1 \\rangle}{\\sqrt{2}} = \\lvert - \\rangle$$

In matrix form:
$$H = \\frac{1}{\\sqrt{2}} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$`
  } else if (lower.includes('cnot')) {
    text = `The **CNOT (Controlled-NOT)** gate is a 2-qubit entangling operation. It flips the target qubit if and only if the control qubit is in state $\\lvert 1 \\rangle$.

$$CNOT \\lvert 00 \\rangle = \\lvert 00 \\rangle$$
$$CNOT \\lvert 10 \\rangle = \\lvert 11 \\rangle$$`
    codeSnippet = `# Creating Bell State with H + CNOT
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1) # CNOT with control=0, target=1`
  } else {
    text = `Great question! In quantum computing, we process information using linear operators on Hilbert space vectors.

Since you are at the **${level}** level, I recommend testing this concept directly in our **Quantum Circuit Simulator** or checking out the recommended readings in the Resource Library.`
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text,
    content: text,
    timestamp: 'Just now',
    codeSnippet,
    conceptCard,
  }
}

export const getMockAIResponse = getFallbackTutorResponse

/**
 * Sends a message to the Quanta AI Tutor Edge Function ('tutor-chat').
 * Invokes Gemini API directly with student level, current topic, and conversation history.
 */
export async function sendTutorChatMessage(
  userId: string,
  message: string,
  currentTopic: string = 'General Quantum Computing',
  currentLevel: string = 'Intermediate',
  conversationId?: string
): Promise<{ data: ChatMessage | null; error: Error | null }> {
  try {
    const res = await apiPost<ChatMessage>('tutor-chat', {
      userId,
      conversationId,
      message,
      currentTopic,
      currentLevel,
    })

    if (res.status === 'error' || !res.data) {
      throw new Error(res.error || 'Failed to get response from AI tutor.')
    }

    return { data: res.data, error: null }
  } catch (err: any) {
    console.error('Failed to send tutor chat message to Edge Function:', err)
    return { data: null, error: err }
  }
}

/**
 * Loads historical messages for a given tutor conversation.
 */
export async function fetchTutorHistoryServer(
  conversationId: string
): Promise<{ data: ChatMessage[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('tutor_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}
