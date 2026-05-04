'use client'

import { useState } from 'react'
import IntentionForm from '@/components/IntentionForm'
import ContractDisplay from '@/components/ContractDisplay'
import type { GenerateResponse, GenerateError } from '@/lib/types'

export default function Home() {
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(intention: string) {
    setLoading(true)
    setResult(null)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intention }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg((data as GenerateError).error)
      } else {
        setResult(data as GenerateResponse)
      }
    } catch {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">

        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-900">Claire</h1>
          <p className="mt-1 text-sm text-gray-500">
            Intention brute → Sprint Contract CPE scoré
          </p>
        </header>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <IntentionForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700 mb-6">
            {errorMsg}
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <ContractDisplay data={result} />
          </div>
        )}

      </div>
    </main>
  )
}
