// Constitution — interfaces from CONTRACTS.md
// Do not modify without explicit contract revision

export interface GenerateRequest {
  intention: string
}

export type BacklogCategory = 'BUILD' | 'INTEGRATE' | 'VERIFY'
export type DoDType = 'D1' | 'D2' | 'D3' | 'D4' | 'D5'

export interface SprintGoal {
  statement: string
  scope: string
  timebox: string
  nonGoals: string[]
}

export interface BacklogItem {
  category: BacklogCategory
  description: string
}

export interface DoDCriterion {
  type: DoDType
  criterion: string
  proof: string
}

export interface SprintContract {
  globalAttractor: string
  sprintAttractor: string
  goal: SprintGoal
  backlog: BacklogItem[]
  dod: DoDCriterion[]
}

export interface ComponentScore {
  ambiguity: number    // μA ∈ [0,1] — lower is better
  validation: number   // μV ∈ [0,1] — higher is better
}

export interface ContractScore {
  goal: ComponentScore
  backlog: ComponentScore
  dod: ComponentScore
  aggregate: ComponentScore
  pass: boolean
}

export interface GenerateResponse {
  contract: SprintContract
  score: ContractScore
}

export interface GenerateError {
  error: string
  code: 'EMPTY_INTENTION' | 'LLM_ERROR' | 'PARSE_ERROR'
}
