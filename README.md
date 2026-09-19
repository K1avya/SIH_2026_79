# ⚛️ QUANTIFY — Adaptive Quantum Science Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](https://opensource.org/licenses/MIT)

**QUANTIFY** is a comprehensive, intelligent adaptive learning ecosystem designed for quantum computing education. Built for **Smart India Hackathon (SIH 2026)**, the platform guides learners from quantum fundamentals to state-of-the-art quantum algorithms using adaptive diagnostic assessments, a real-time quantum circuit simulator, an interactive AI tutor (*Quanta AI*), personalized learning pathways, and gamified achievement tracking.

---

## 🌟 Key Features

### 1. 🎯 Adaptive Diagnostic Assessment Engine
- Multi-concept evaluation spanning **Basics**, **Qubit Mechanics**, **Quantum Gates**, **Circuit Design**, and **Quantum Algorithms**.
- Real-time question navigation palette with category filters and live status tracking.
- Automated proficiency scoring with dynamic learning path recommendation (Foundations vs. Advanced Track).

### 2. ⚡ Full Quantum Circuit Simulator
- Multi-qubit interactive wire matrix supporting Single-Qubit Gates ($H$, $X$, $Y$, $Z$, $S$, $T$) and Two-Qubit Multi-Control Gates ($CNOT$, $CZ$, $SWAP$).
- Real-time statevector calculation, phase rotation visualization, and measurement probability bar chart displaying all $2^n$ basis states.
- 1-click preset circuits: **Bell State**, **GHZ State**, and **Quantum Superposition**.

### 3. 🤖 Quanta AI Quantum Tutor
- Conversational intelligent AI mentor specialized in quantum physics and quantum computer science.
- Interactive topic grounding, Socratic hint toggle, and quick-fire query prompts.
- Inline mathematical LaTeX rendering for quantum state equations and matrix operations.

### 4. 🗺️ Dynamic Personalized Learning Roadmaps
- Milestone-based progressive curriculum tailored to the learner's diagnostic score.
- Integrated prerequisites, key takeaways, and difficulty badges.

### 5. 📚 Quantum Resource Library & Curated Bookshelf
- Filterable learning library featuring research papers, interactive notebooks, and video lectures.
- Curated textbook recommendations with direct reading links and syllabus alignment.

### 6. 🏆 Gamified Progress & Badges Dashboard
- Real-time learner XP, streak tracking, study time telemetry, and skill mastery radar.
- Unlockable achievement badges commemorating quantum milestones.

### 7. 🔐 Authentication & Dual-Persona Access
- Seamless dual-mode authentication (Sign In & Sign Up).
- Role-based views: **Learner** (adaptive learning environment) & **Administrator** (platform telemetry, question bank curation, and diagnostic cutoffs).
- 1-Click Fast Demo Logins for instant evaluation.

### 8. 🌌 Expansive Responsive Quantum Theme
- Deep space quantum theme (`#030712`, `#06b6d4`, `#8b5cf6`) with responsive full-window expansive layout supporting laptop, desktop, and ultrawide monitors.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.17 or later)
- `npm` or `yarn` or `pnpm`

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/K1avya/SIH_2026_79.git

# 2. Navigate to the project directory
cd SIH_2026_79

# 3. Install dependencies
npm install

# 4. Launch the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Client Components, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, full type-safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom quantum color tokens and glassmorphism styling
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`QuantifyProvider`) with modular separation of concerns

---

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and layout
│   ├── globals.css       # Quantum space design system tokens & animations
│   ├── layout.tsx        # Root HTML shell and font definitions
│   ├── login/            # Dedicated /login route
│   └── page.tsx          # Main entrypoint
├── components/           # UI and module components
│   ├── modules/          # Core platform modules
│   │   ├── admin-quantify.tsx         # Platform analytics & question bank
│   │   ├── assessment-result.tsx      # Diagnostic scorecard
│   │   ├── book-recommendations.tsx   # Curated reading list
│   │   ├── circuit-simulator.tsx      # Interactive quantum circuit builder
│   │   ├── diagnostic-assessment.tsx  # Adaptive assessment exam
│   │   ├── learning-path.tsx          # Personalized curriculum roadmap
│   │   ├── onboarding-module.tsx      # First-time learner setup
│   │   ├── progress-dashboard.tsx     # XP, streak & badges
│   │   ├── quanta-ai-tutor.tsx        # Quanta AI conversational mentor
│   │   ├── quantify-auth.tsx          # Authentication & role selector
│   │   ├── quantify-overview.tsx      # Platform landing & feature cards
│   │   └── resource-library.tsx       # Filterable quantum repository
│   ├── quantify-header.tsx            # Global navigation ribbon & user account pill
│   └── quantify-view.tsx              # Dynamic module coordinator & footer
├── context/
│   └── quantify-context.tsx           # Global state management (user, assessment, circuit)
├── types/
│   └── quantify.ts                    # TypeScript interfaces & domain types
├── public/               # Static assets & illustrations
└── package.json          # Project metadata & dependencies
```

---

## 👥 Authors & Acknowledgments

- Developed for the **Smart India Hackathon (SIH 2026)**.
- Repository: [K1avya/SIH_2026_79](https://github.com/K1avya/SIH_2026_79)
