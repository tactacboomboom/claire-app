'use client'

interface Props {
  onSubmit: (intention: string) => void
  loading: boolean
}

export default function IntentionForm({ onSubmit, loading }: Props) {
  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const intention = (fd.get('intention') as string).trim()
    if (intention) onSubmit(intention)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="intention" className="text-sm font-medium text-gray-700">
        Intention brute (𝕀₀)
      </label>
      <textarea
        id="intention"
        name="intention"
        rows={5}
        required
        disabled={loading}
        placeholder="Ex : Je veux construire une app qui aide les PO à rédiger leurs sprints..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        suppressHydrationWarning
      />
      <button
        type="submit"
        disabled={loading}
        className="self-end rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Génération…' : 'Générer'}
      </button>
    </form>
  )
}
