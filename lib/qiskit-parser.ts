import { PlacedGate } from '@/lib/api/circuits'

export interface ParsedCircuit {
  qubitCount: number
  placedGates: PlacedGate[]
  error?: string
}

/**
 * Safely parses a whitelisted subset of Qiskit Python or OpenQASM 2.0 code into PlacedGates.
 * Prevents execution of arbitrary code by using a deterministic AST/RegEx parser.
 */
export function parseQiskitOrQasmToCircuit(codeText: string): ParsedCircuit {
  const lines = codeText.split('\n').map((l) => l.trim())
  let qubitCount = 2
  const gates: PlacedGate[] = []
  let stepCounter: Record<number, number> = {}

  function getNextStep(q: number): number {
    const current = stepCounter[q] ?? 0
    stepCounter[q] = current + 1
    return current
  }

  try {
    for (const line of lines) {
      if (!line || line.startsWith('#') || line.startsWith('//')) continue

      // Match Qiskit initialization: qc = QuantumCircuit(2, 2) or QuantumCircuit(3)
      const qiskitInitMatch = line.match(/QuantumCircuit\s*\(\s*(\d+)/i)
      if (qiskitInitMatch) {
        qubitCount = Math.min(5, Math.max(1, parseInt(qiskitInitMatch[1], 10)))
        continue
      }

      // Match QASM qreg: qreg q[3];
      const qasmQregMatch = line.match(/qreg\s+q\s*\[\s*(\d+)\s*\]/i)
      if (qasmQregMatch) {
        qubitCount = Math.min(5, Math.max(1, parseInt(qasmQregMatch[1], 10)))
        continue
      }

      // 1-Qubit Qiskit gate: qc.h(0), qc.x(1), etc.
      const qiskit1QMatch = line.match(/qc\.(h|x|y|z|s|t|m)\s*\(\s*(\d+)\s*\)/i)
      if (qiskit1QMatch) {
        const typeStr = qiskit1QMatch[1].toUpperCase()
        const qIdx = parseInt(qiskit1QMatch[2], 10)
        if (qIdx < qubitCount) {
          const step = getNextStep(qIdx)
          gates.push({
            id: `gate-code-${Date.now()}-${Math.random()}`,
            type: typeStr === 'M' ? 'M' : typeStr,
            qubitIndex: qIdx,
            stepIndex: Math.min(7, step),
          })
        }
        continue
      }

      // 2-Qubit Qiskit CNOT: qc.cx(0, 1) or qc.cnot(0, 1)
      const qiskitCnotMatch = line.match(/qc\.(?:cx|cnot)\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i)
      if (qiskitCnotMatch) {
        const cIdx = parseInt(qiskitCnotMatch[1], 10)
        const tIdx = parseInt(qiskitCnotMatch[2], 10)
        if (cIdx < qubitCount && tIdx < qubitCount) {
          const step = Math.max(getNextStep(cIdx), getNextStep(tIdx))
          stepCounter[cIdx] = step + 1
          stepCounter[tIdx] = step + 1

          gates.push({
            id: `gate-code-${Date.now()}-${Math.random()}`,
            type: 'CNOT',
            qubitIndex: cIdx,
            controlQubitIndex: cIdx,
            targetQubitIndex: tIdx,
            stepIndex: Math.min(7, step),
          })
        }
        continue
      }

      // 2-Qubit Qiskit SWAP: qc.swap(0, 1)
      const qiskitSwapMatch = line.match(/qc\.swap\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/i)
      if (qiskitSwapMatch) {
        const cIdx = parseInt(qiskitSwapMatch[1], 10)
        const tIdx = parseInt(qiskitSwapMatch[2], 10)
        if (cIdx < qubitCount && tIdx < qubitCount) {
          const step = Math.max(getNextStep(cIdx), getNextStep(tIdx))
          stepCounter[cIdx] = step + 1
          stepCounter[tIdx] = step + 1

          gates.push({
            id: `gate-code-${Date.now()}-${Math.random()}`,
            type: 'SWAP',
            qubitIndex: cIdx,
            controlQubitIndex: cIdx,
            targetQubitIndex: tIdx,
            stepIndex: Math.min(7, step),
          })
        }
        continue
      }

      // 1-Qubit QASM gate: h q[0]; x q[1];
      const qasm1QMatch = line.match(/^(h|x|y|z|s|t)\s+q\s*\[\s*(\d+)\s*\]\s*;/i)
      if (qasm1QMatch) {
        const typeStr = qasm1QMatch[1].toUpperCase()
        const qIdx = parseInt(qasm1QMatch[2], 10)
        if (qIdx < qubitCount) {
          const step = getNextStep(qIdx)
          gates.push({
            id: `gate-code-${Date.now()}-${Math.random()}`,
            type: typeStr,
            qubitIndex: qIdx,
            stepIndex: Math.min(7, step),
          })
        }
        continue
      }

      // 2-Qubit QASM cx: cx q[0],q[1];
      const qasmCxMatch = line.match(/^cx\s+q\s*\[\s*(\d+)\s*\]\s*,\s*q\s*\[\s*(\d+)\s*\]\s*;/i)
      if (qasmCxMatch) {
        const cIdx = parseInt(qasmCxMatch[1], 10)
        const tIdx = parseInt(qasmCxMatch[2], 10)
        if (cIdx < qubitCount && tIdx < qubitCount) {
          const step = Math.max(getNextStep(cIdx), getNextStep(tIdx))
          stepCounter[cIdx] = step + 1
          stepCounter[tIdx] = step + 1

          gates.push({
            id: `gate-code-${Date.now()}-${Math.random()}`,
            type: 'CNOT',
            qubitIndex: cIdx,
            controlQubitIndex: cIdx,
            targetQubitIndex: tIdx,
            stepIndex: Math.min(7, step),
          })
        }
        continue
      }
    }

    return { qubitCount, placedGates: gates }
  } catch (err: any) {
    return { qubitCount, placedGates: gates, error: err?.message || 'Failed to parse code snippet.' }
  }
}

/**
 * Generates Qiskit Python & OpenQASM 2.0 text representations from PlacedGates.
 */
export function generateQiskitAndQasmCode(qubitCount: number, gates: PlacedGate[]): { qiskit: string; qasm: string } {
  const sorted = [...gates].sort((a, b) => a.stepIndex - b.stepIndex)

  const qiskitLines = [
    '# QUANTIFY — Qiskit Python Circuit',
    'from qiskit import QuantumCircuit, transpile',
    'from qiskit_aer import AerSimulator',
    '',
    `qc = QuantumCircuit(${qubitCount}, ${qubitCount})`,
  ]

  const qasmLines = [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    `qreg q[${qubitCount}];`,
    `creg c[${qubitCount}];`,
  ]

  for (const g of sorted) {
    const t = g.targetQubitIndex !== undefined ? g.targetQubitIndex : g.qubitIndex
    const c = g.controlQubitIndex !== undefined ? g.controlQubitIndex : g.qubitIndex

    switch (g.type) {
      case 'H':
        qiskitLines.push(`qc.h(${g.qubitIndex})`)
        qasmLines.push(`h q[${g.qubitIndex}];`)
        break
      case 'X':
        qiskitLines.push(`qc.x(${g.qubitIndex})`)
        qasmLines.push(`x q[${g.qubitIndex}];`)
        break
      case 'Y':
        qiskitLines.push(`qc.y(${g.qubitIndex})`)
        qasmLines.push(`y q[${g.qubitIndex}];`)
        break
      case 'Z':
        qiskitLines.push(`qc.z(${g.qubitIndex})`)
        qasmLines.push(`z q[${g.qubitIndex}];`)
        break
      case 'S':
        qiskitLines.push(`qc.s(${g.qubitIndex})`)
        qasmLines.push(`s q[${g.qubitIndex}];`)
        break
      case 'T':
        qiskitLines.push(`qc.t(${g.qubitIndex})`)
        qasmLines.push(`t q[${g.qubitIndex}];`)
        break
      case 'CNOT':
        qiskitLines.push(`qc.cx(${c}, ${t})`)
        qasmLines.push(`cx q[${c}],q[${t}];`)
        break
      case 'SWAP':
        qiskitLines.push(`qc.swap(${c}, ${t})`)
        qasmLines.push(`swap q[${c}],q[${t}];`)
        break
      case 'M':
        qiskitLines.push(`qc.measure(${g.qubitIndex}, ${g.qubitIndex})`)
        qasmLines.push(`measure q[${g.qubitIndex}] -> c[${g.qubitIndex}];`)
        break
    }
  }

  qiskitLines.push(
    '',
    `qc.measure(range(${qubitCount}), range(${qubitCount}))`,
    'simulator = AerSimulator()',
    'compiled_circuit = transpile(qc, simulator)',
    'result = simulator.run(compiled_circuit, shots=1000).result()',
    'print("Measurement Counts:", result.get_counts())'
  )

  return {
    qiskit: qiskitLines.join('\n'),
    qasm: qasmLines.join('\n'),
  }
}
