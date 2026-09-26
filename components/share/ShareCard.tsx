'use client'

import React from 'react'
import { Flame, Trophy, Zap, Cpu, Award, Atom, GraduationCap, MessageSquare } from 'lucide-react'
import { UserProfile } from '@/lib/auth-context'
import { Achievement } from '@/lib/api/achievements'

interface ShareCardProps {
  user: UserProfile
  badges: Achievement[]
}

function BadgeIcon({ iconName }: { iconName: string }) {
  const cls = 'h-5 w-5 text-black'
  switch (iconName) {
    case 'GraduationCap': return <GraduationCap className={cls} />
    case 'Atom':          return <Atom className={cls} />
    case 'Cpu':           return <Cpu className={cls} />
    case 'Flame':         return <Flame className={cls} />
    case 'Award':         return <Award className={cls} />
    case 'Zap':           return <Zap className={cls} />
    case 'MessageSquare': return <MessageSquare className={cls} />
    default:              return <Trophy className={cls} />
  }
}

const LEVEL_COLOR: Record<string, string> = {
  Beginner:     'rgba(16,185,129,0.25)',   // emerald tint
  Intermediate: 'rgba(6,182,212,0.25)',    // cyan tint
  Advanced:     'rgba(139,92,246,0.25)',   // violet tint
}
const LEVEL_TEXT: Record<string, string> = {
  Beginner:     '#34d399',
  Intermediate: '#22d3ee',
  Advanced:     '#a78bfa',
}

/**
 * Presentational share card — rendered off-screen so html2canvas can capture it.
 * Width/height match a landscape social card (1200×630). The parent positions
 * this with absolute/fixed + visibility:hidden (NOT display:none) so it exists
 * in the DOM for html2canvas but doesn't affect layout.
 */
export function ShareCard({ user, badges }: ShareCardProps) {
  const topBadges = badges.filter((b) => b.unlocked).slice(0, 3)
  const levelBg   = LEVEL_COLOR[user.level] ?? LEVEL_COLOR.Intermediate
  const levelText = LEVEL_TEXT[user.level]  ?? LEVEL_TEXT.Intermediate

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 50%, #0f0d24 100%)',
        borderRadius: '24px',
        padding: '56px 64px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative glow blobs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '320px', height: '320px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-60px',
        width: '280px', height: '280px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top section: avatar + name + level + streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 1 }}>
        {/* Avatar circle */}
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px', fontWeight: 800, color: '#000',
          boxShadow: '0 0 40px rgba(6,182,212,0.4)',
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {user.name}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Level badge */}
            <span style={{
              padding: '4px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
              color: levelText, background: levelBg,
              border: `1px solid ${levelText}55`,
            }}>
              Level: {user.level}
            </span>

            {/* Streak flame */}
            <span style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
              color: '#fb923c', background: 'rgba(251,146,60,0.15)',
              border: '1px solid rgba(251,146,60,0.35)',
            }}>
              🔥 {user.streak}-day streak
            </span>

            {/* Progress */}
            <span style={{
              padding: '4px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700,
              color: '#a78bfa', background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.35)',
            }}>
              {user.overallProgress}% Complete
            </span>
          </div>
        </div>
      </div>

      {/* Middle section: badges */}
      {topBadges.length > 0 && (
        <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 1 }}>
          {topBadges.map((badge) => (
            <div key={badge.id} style={{
              flex: 1, borderRadius: '16px', padding: '20px 24px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(6,182,212,0.25)',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              {/* Badge medallion */}
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BadgeIcon iconName={badge.iconName} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{badge.title}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                  {badge.unlockedAt ? `Unlocked ${badge.unlockedAt}` : 'Earned'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom: wordmark + tagline */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontSize: '22px', fontWeight: 900, letterSpacing: '0.12em',
            background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            QUANTIFY
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
            SIH 2026 · Quantum Learning Platform
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          quantify.app
        </span>
      </div>
    </div>
  )
}
