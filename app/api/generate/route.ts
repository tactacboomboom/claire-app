import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { GenerateRequest, GenerateResponse, GenerateError, SprintContract } from '@/lib/types'
import { scoreContract } from '@/lib/scoring'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  // 1. Validate input
  let body: GenerateRequest
  try {
    body = await req.json()
  } catch {
    return error('Requête JSON invalide.', 'PARSE_ERROR', 400)
  }

  const intention = body.intention?.trim()
  if (!intention) {
    return error("L'intention ne peut pas être vide.", 'EMPTY_INTENTION', 400)
  }

  // 2. Call LLM
  let rawText: string
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(intention) }],
    })
    const block = message.content[0]
    if (block.type !== 'text') throw new Error('Unexpected response type')
    rawText = block.text.trim()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue'
    return error(`Erreur LLM : ${msg}`, 'LLM_ERROR', 502)
  }

  // 3. Parse JSON — strip optional markdown fences
  let contract: SprintContract
  try {
    const json = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
    contract = JSON.parse(json)
  } catch {
    return error('Le LLM a retourné un JSON invalide.', 'PARSE_ERROR', 502)
  }

  // 4. Score (deterministic, server-side)
  const score = scoreContract(contract)

  const response: GenerateResponse = { contract, score }
  return NextResponse.json(response, { status: 200 })
}

function error(message: string, code: GenerateError['code'], status: number) {
  const body: GenerateError = { error: message, code }
  return NextResponse.json(body, { status })
}
