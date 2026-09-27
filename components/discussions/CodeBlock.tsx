'use client'

import React from 'react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="relative my-3 rounded-2xl border overflow-hidden text-xs"
      style={{ borderColor: 'var(--q-line)', background: 'var(--q-bg-deep)' }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: 'var(--q-line)', background: 'rgba(255,255,255,0.03)' }}
      >
        <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--q-muted)' }}>
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium transition-colors hover:bg-white/10"
          style={{ color: 'var(--q-muted)' }}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre
        className="overflow-x-auto p-4 leading-relaxed font-mono"
        style={{ color: 'var(--q-cyan)', fontSize: '11px' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Renders content that may contain fenced code blocks (```lang\n...\n```)
 * into styled CodeBlock components. All other text is rendered as
 * plain paragraphs.
 */
export function RenderedContent({ content }: { content: string }) {
  const parts = content.split(/(```[\w]*\n[\s\S]*?```)/g)

  return (
    <div className="space-y-2 text-sm leading-relaxed" style={{ color: 'var(--q-text)' }}>
      {parts.map((part, i) => {
        const codeMatch = part.match(/^```([\w]*)\n([\s\S]*?)```$/)
        if (codeMatch) {
          return <CodeBlock key={i} language={codeMatch[1]} code={codeMatch[2]} />
        }
        if (!part.trim()) return null
        return (
          <p key={i} className="whitespace-pre-wrap break-words">
            {part}
          </p>
        )
      })}
    </div>
  )
}
