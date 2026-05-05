# CONTRACTS — Claire App

Constitution TypeScript. Ces interfaces définissent le contrat de données.
Elles ne changent pas sans révision explicite. Le code les respecte.

## Entrée utilisateur

```typescript
interface GenerateRequest {
  intention: string  // 𝕀₀ — intention brute, non vide
}
```

## Objets CPE

```typescript
type BacklogCategory = 'BUILD' | 'INTEGRATE' | 'VERIFY'
type DoDType = 'D1' | 'D2' | 'D3' | 'D4' | 'D5'

interface SprintGoal {
  statement: string    // [VERB] [OBJECT] so that [USE] — PROOF: [proof]
  scope: string        // max 1 screen | 1 endpoint | 1 script
  timebox: string      // <= 1 sprint
  nonGoals: string[]   // 2 bullets max
}

interface BacklogItem {
  category: BacklogCategory
  description: string  // verbe + objet précis
}

interface DoDCriterion {
  type: DoDType
  criterion: string   // critère binaire
  proof: string       // URL | commande | fichier | commit
}

interface SprintContract {
  globalAttractor: string   // 𝕋ᴳ — vision globale du projet
  sprintAttractor: string   // 𝕋₁ — vision locale du sprint
  goal: SprintGoal
  backlog: BacklogItem[]
  dod: DoDCriterion[]
}
```

## Scoring (μA / μV)

```typescript
interface ComponentScore {
  ambiguity: number    // μA ∈ [0,1] — plus bas = mieux
  validation: number   // μV ∈ [0,1] — plus haut = mieux
}

interface ContractScore {
  goal: ComponentScore
  backlog: ComponentScore
  dod: ComponentScore
  aggregate: ComponentScore
  pass: boolean        // μA(C) < 0.5 AND μV(C) >= 0.4
}
```

## Réponse API

```typescript
interface GenerateResponse {
  contract: SprintContract
  score: ContractScore
}

interface GenerateError {
  error: string
  code: 'EMPTY_INTENTION' | 'LLM_ERROR' | 'PARSE_ERROR'
}
```

## Invariant de l'API

- POST /api/generate : GenerateRequest → GenerateResponse | GenerateError
- Le scoring est calculé dans lib/scoring.ts, pas par le LLM
- Le LLM retourne uniquement le contrat (pas les scores)
- Les scores sont déterministes (même contrat = même score)

## Périmètre CPE

Claire implémente les étapes φ₀ + 𝕍 du pipeline CPE.
Les étapes ε₀ → τ₀ → κ₀ → 𝕮₁ (raffinement) sont prévues en Sprint 2.
𝕊₀ (sprint execution) est hors scope — Claire produit le contrat, pas le sprint.

## Notation μ

- `μA` / `μV` : métriques de scoring propres à Claire (ambiguïté / validation). ∈ [0,1].
- Ces symboles sont distincts de `μₙ` dans la spec CPE canonique, où μₙ désigne le morphisme d'instanciation du sprint (μₙ : 𝕮ₙ → 𝕊ₙ).
- PASS ⟺ μA(C) < 0.5 AND μV(C) ≥ 0.4
