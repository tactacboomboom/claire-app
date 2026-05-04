// Pure scoring function — deterministic, no LLM
// μA ∈ [0,1] (ambiguity — lower is better)
// μV ∈ [0,1] (validation — higher is better)
// PASS ⟺ μA(C) < 0.5 AND μV(C) ≥ 0.4

import type {
  SprintContract,
  SprintGoal,
  BacklogItem,
  DoDCriterion,
  ComponentScore,
  ContractScore,
} from './types'

// ── Vocabulary ──────────────────────────────────────────────────────────────

const VAGUE_WORDS = [
  'améliorer', 'optimiser', 'mieux', 'meilleur', 'bien', 'efficace',
  'performant', 'improve', 'optimize', 'better', 'good', 'nice', 'great',
  'enhance', 'boost', 'upgrade', 'rendre plus', 'simplifier', 'assurer',
  'gérer', 'traiter', 'handle',
]

const HUMAN_JUDGMENT_WORDS = [
  'review', 'relire', 'vérifier manuellement', 'lisible', 'propre', 'clean',
  'readable', 'beau', 'satisfaisant', 'qualitatif', 'cohérent',
]

// Proof = URL, backtick command, file path, or shell command
// Non-capturing groups (?:) so .match() returns only real occurrences, not capture groups
const PROOF_REGEX = /https?:\/\/\S+|`[^`]+`|\b(?:npm|yarn|git|curl|npx|grep|cat|jq|node|python|python3|ls|find|docker|make)\s+\S+|\S+\.(?:md|json|ts|tsx|js|sh|yaml|yml|html|png|pdf)\b/gi

// ── Goal ────────────────────────────────────────────────────────────────────

function scoreGoal(goal: SprintGoal): ComponentScore {
  const stmt = goal.statement.toLowerCase()
  const words = stmt.split(/\s+/)

  // μA(G) — 4 binary checks
  const A1 = VAGUE_WORDS.some(w => stmt.includes(w)) ? 1 : 0

  // A₂: multiple action verbs — proxy: multiple distinct infinitives separated by 'et'/'and'
  const verbConnectors = /\bet\b|\band\b/
  const A2 = verbConnectors.test(stmt) && words.length > 8 ? 1 : 0

  // A₃: no purpose clause → ambiguous goal
  const purposeClause = /so that|afin (que|d[e'])|pour (que|permettre)|in order to/
  const A3 = !purposeClause.test(stmt) ? 1 : 0

  // A₄: proof not named in statement
  const A4 = !stmt.includes('proof:') && !stmt.includes('preuve:') ? 1 : 0

  const ambiguity = (A1 + A2 + A3 + A4) / 4

  // μV(G) — 3 binary checks
  const proofMatch = goal.statement.match(/proof:\s*(.+)/i)
  const proofText = proofMatch ? proofMatch[1].trim() : ''

  const V1 = proofText.length > 0 ? 1 : 0
  const V2 = (proofText.match(PROOF_REGEX) ?? []).length > 0 ? 1 : 0
  // V₃: third-party verifiable in < 2 min → proof is short and of a known type
  const V3 = V2 && proofText.length <= 120 ? 1 : 0

  const validation = (V1 + V2 + V3) / 3

  return { ambiguity, validation }
}

// ── Backlog ──────────────────────────────────────────────────────────────────

function scoreBacklogItem(item: BacklogItem): number {
  const desc = item.description.toLowerCase()

  // A₁: theme not action — no clear action verb (proxy: very short or no verb-like start)
  const startsWithVerb = /^[a-zàâéèêëîïôùûç]{3,}(r|er|re|ez|ons|ent)\b/i
  const A1 = !startsWithVerb.test(desc.trim()) ? 1 : 0

  // A₂: maps to multiple phases — uses 'and/et' joining distinct actions
  const A2 = /\bet\b|\band\b/.test(desc) && desc.split(/\bet\b|\band\b/).length > 2 ? 1 : 0

  // A₃: size not bounded — words implying vagueness
  const unbounded = /plusieurs|divers|various|multiple|certain(s|es)?|some |tout(e?s)? les/
  const A3 = unbounded.test(desc) ? 1 : 0

  return (A1 + A2 + A3) / 3
}

function scoreBacklog(backlog: BacklogItem[]): ComponentScore {
  if (backlog.length === 0) return { ambiguity: 1, validation: 0 }

  // μA(B) — average per item
  const ambiguity = backlog.reduce((sum, item) => sum + scoreBacklogItem(item), 0) / backlog.length

  // μV(B) — 3 global checks
  const categories = new Set(backlog.map(i => i.category))

  // V₁: all 3 categories present
  const V1 = categories.has('BUILD') && categories.has('INTEGRATE') && categories.has('VERIFY') ? 1 : 0

  // V₂: strict order respected (no VERIFY before BUILD)
  const order = backlog.map(i => i.category)
  const firstVerify = order.indexOf('VERIFY')
  const lastBuild = order.lastIndexOf('BUILD')
  const V2 = firstVerify === -1 || lastBuild === -1 || lastBuild < firstVerify ? 1 : 0

  // V₃: enough items to cover work (≥ 3)
  const V3 = backlog.length >= 3 ? 1 : 0

  const validation = (V1 + V2 + V3) / 3

  return { ambiguity, validation }
}

// ── DoD ──────────────────────────────────────────────────────────────────────

function scoreDodItem(item: DoDCriterion): number {
  const criterion = item.criterion.toLowerCase()

  // A₁: unbounded human judgment in criterion
  const A1 = HUMAN_JUDGMENT_WORDS.some(w => criterion.includes(w)) ? 1 : 0

  // A₂: multiple proof patterns mixed (URL + command, etc.)
  // A₃: no executable proof at all
  const proofMatches = item.proof.match(PROOF_REGEX) ?? []
  const A2 = proofMatches.length > 1 ? 1 : 0
  const A3 = proofMatches.length === 0 ? 1 : 0

  return (A1 + A2 + A3) / 3
}

function scoreDod(dod: DoDCriterion[]): ComponentScore {
  if (dod.length === 0) return { ambiguity: 1, validation: 0 }

  // μA(D) — average per criterion
  const ambiguity = dod.reduce((sum, item) => sum + scoreDodItem(item), 0) / dod.length

  // μV(D) — 3 global checks
  // V₁: at least one automatic proof (URL or command)
  const V1 = dod.some(d => (d.proof.match(PROOF_REGEX) ?? []).length > 0) ? 1 : 0

  // V₂: all proofs are non-empty
  const V2 = dod.every(d => d.proof.trim().length > 0) ? 1 : 0

  // V₃: DoD spans at least 2 distinct types
  const types = new Set(dod.map(d => d.type))
  const V3 = types.size >= 2 ? 1 : 0

  const validation = (V1 + V2 + V3) / 3

  return { ambiguity, validation }
}

// ── Aggregation ───────────────────────────────────────────────────────────────

function aggregate(a: ComponentScore, b: ComponentScore, c: ComponentScore): ComponentScore {
  return {
    ambiguity: (a.ambiguity + b.ambiguity + c.ambiguity) / 3,
    validation: (a.validation + b.validation + c.validation) / 3,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function scoreContract(contract: SprintContract): ContractScore {
  const goal = scoreGoal(contract.goal)
  const backlog = scoreBacklog(contract.backlog)
  const dod = scoreDod(contract.dod)
  const agg = aggregate(goal, backlog, dod)

  return {
    goal,
    backlog,
    dod,
    aggregate: agg,
    pass: agg.ambiguity < 0.5 && agg.validation >= 0.4,
  }
}
