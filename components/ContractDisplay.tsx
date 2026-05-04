'use client'

import { useState } from 'react'
import type { GenerateResponse } from '@/lib/types'

interface Props {
  data: GenerateResponse
}

// ── Score helpers ────────────────────────────────────────────────────────────

function ambiguityColor(v: number) {
  if (v < 0.25) return 'text-green-600'
  if (v < 0.5) return 'text-orange-500'
  return 'text-red-600'
}

function validationColor(v: number) {
  if (v >= 0.7) return 'text-green-600'
  if (v >= 0.4) return 'text-orange-500'
  return 'text-red-600'
}

function fmt(n: number) {
  return n.toFixed(2)
}

function ScoreRow({ label, ambiguity, validation }: { label: string; ambiguity: number; validation: number }) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="w-20 text-gray-500">{label}</span>
      <span className={`font-mono ${ambiguityColor(ambiguity)}`}>μA {fmt(ambiguity)}</span>
      <span className={`font-mono ${validationColor(validation)}`}>μV {fmt(validation)}</span>
    </div>
  )
}

// ── Statement parser ─────────────────────────────────────────────────────────

const STATEMENT_REGEX = /^(\S+)\s+(.+?)\s+so that\s+(.+?)\s+[—-]+\s+PROOF:\s+(.+)$/i

function StatementBadges({ statement }: { statement: string }) {
  const match = statement.match(STATEMENT_REGEX)
  if (!match) return <span className="text-black">{statement}</span>

  const [, verb, object, usage, proof] = match
  return (
    <span className="inline-flex flex-wrap gap-1.5 items-baseline leading-7">
      <span className="px-1.5 py-0.5 rounded text-xs font-mono font-semibold bg-blue-100 text-blue-700">{verb}</span>
      <span className="text-black">{object}</span>
      <span className="text-gray-400 text-xs">so that</span>
      <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-purple-100 text-purple-700">{usage}</span>
      <span className="text-gray-400 text-xs">PROOF:</span>
      <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-green-100 text-green-700">{proof}</span>
    </span>
  )
}

// ── Contract to copyable text ────────────────────────────────────────────────

function contractToText(data: GenerateResponse): string {
  const { contract, score } = data
  const lines: string[] = []

  lines.push(`# Sprint Contract CPE`)
  lines.push(``)
  lines.push(`## Attracteur Global (𝕋ᴳ)`)
  lines.push(contract.globalAttractor)
  lines.push(``)
  lines.push(`## Attracteur Sprint (𝕋₁)`)
  lines.push(contract.sprintAttractor)
  lines.push(``)
  lines.push(`## Goal`)
  lines.push(`Statement : ${contract.goal.statement}`)
  lines.push(`Scope     : ${contract.goal.scope}`)
  lines.push(`Timebox   : ${contract.goal.timebox}`)
  lines.push(`Non-goals : ${contract.goal.nonGoals.join(' | ')}`)
  lines.push(``)
  lines.push(`## Backlog`)
  contract.backlog.forEach(item => lines.push(`[${item.category}] ${item.description}`))
  lines.push(``)
  lines.push(`## Definition of Done`)
  contract.dod.forEach(d => lines.push(`[${d.type}] ${d.criterion} — ${d.proof}`))
  lines.push(``)
  lines.push(`## Scores`)
  lines.push(`Goal    : μA=${fmt(score.goal.ambiguity)} μV=${fmt(score.goal.validation)}`)
  lines.push(`Backlog : μA=${fmt(score.backlog.ambiguity)} μV=${fmt(score.backlog.validation)}`)
  lines.push(`DoD     : μA=${fmt(score.dod.ambiguity)} μV=${fmt(score.dod.validation)}`)
  lines.push(`Agrégat : μA=${fmt(score.aggregate.ambiguity)} μV=${fmt(score.aggregate.validation)}`)
  lines.push(`Décision: ${score.pass ? 'PASS' : 'FAIL'}`)

  return lines.join('\n')
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ContractDisplay({ data }: Props) {
  const { contract, score } = data
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(contractToText(data))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Decision banner */}
      <div className={`rounded-lg px-5 py-4 flex items-center justify-between ${score.pass ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div>
          <span className={`text-lg font-bold ${score.pass ? 'text-green-700' : 'text-red-700'}`}>
            {score.pass ? '✓ PASS' : '✗ FAIL'}
          </span>
          <span className="ml-3 text-sm text-gray-600">
            μA(C) = <span className={`font-mono ${ambiguityColor(score.aggregate.ambiguity)}`}>{fmt(score.aggregate.ambiguity)}</span>
            {' '}·{' '}
            μV(C) = <span className={`font-mono ${validationColor(score.aggregate.validation)}`}>{fmt(score.aggregate.validation)}</span>
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-sm text-gray-500 hover:text-gray-800 border border-gray-300 rounded px-3 py-1 transition-colors"
        >
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>

      {/* Attractors */}
      <section className="flex flex-col gap-2">
        <div className="flex gap-2 items-start">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 w-16 pt-0.5">𝕋ᴳ</span>
          <p className="text-sm text-black">{contract.globalAttractor}</p>
        </div>
        <div className="flex gap-2 items-start">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 w-16 pt-0.5">𝕋₁</span>
          <p className="text-sm text-black">{contract.sprintAttractor}</p>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Goal */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Goal</h2>
        <div className="flex flex-col gap-1.5 text-sm text-black">
          <div className="flex gap-3 items-start">
            <span className="text-gray-400 w-20 shrink-0">Statement</span>
            <StatementBadges statement={contract.goal.statement} />
          </div>
          <p><span className="text-gray-400 w-20 inline-block">Scope</span>{contract.goal.scope}</p>
          <p><span className="text-gray-400 w-20 inline-block">Timebox</span>{contract.goal.timebox}</p>
          <div className="flex gap-2 items-start">
            <span className="text-gray-400 w-20 inline-block shrink-0">Non-goals</span>
            <ul className="list-disc list-inside text-black">
              {contract.goal.nonGoals.map((ng, i) => <li key={i}>{ng}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Backlog */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Backlog</h2>
        <ul className="flex flex-col gap-1.5">
          {contract.backlog.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm items-baseline">
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded shrink-0 ${
                item.category === 'BUILD' ? 'bg-blue-100 text-blue-700' :
                item.category === 'INTEGRATE' ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
              }`}>{item.category}</span>
              <span className="text-black">{item.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-gray-200" />

      {/* DoD */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Definition of Done</h2>
        <ul className="flex flex-col gap-2">
          {contract.dod.map((d, i) => (
            <li key={i} className="flex gap-3 text-sm items-baseline">
              <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded shrink-0">{d.type}</span>
              <div>
                <span className="text-black">{d.criterion}</span>
                <span className="ml-2 text-gray-400 text-xs font-mono">— {d.proof}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-gray-200" />

      {/* Scores */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Scores</h2>
        <div className="flex flex-col gap-1.5">
          <ScoreRow label="Goal" ambiguity={score.goal.ambiguity} validation={score.goal.validation} />
          <ScoreRow label="Backlog" ambiguity={score.backlog.ambiguity} validation={score.backlog.validation} />
          <ScoreRow label="DoD" ambiguity={score.dod.ambiguity} validation={score.dod.validation} />
          <div className="border-t border-gray-200 pt-1.5 mt-1">
            <ScoreRow label="Agrégat" ambiguity={score.aggregate.ambiguity} validation={score.aggregate.validation} />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400">μA : ambiguïté (bas = bien) · μV : validation (haut = bien) · PASS ⟺ μA &lt; 0.5 et μV ≥ 0.4</p>
      </section>

    </div>
  )
}
