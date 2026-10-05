import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addIngredientFn, getIngredientsFn, removeIngredientFn } from '~/server/functions/pantry'
import { generateSuggestionsFn } from '~/server/functions/suggestions'
import type { GenerateSuggestionsResult } from '~/server/functions/suggestions'
import { Pantry } from '~/components/Pantry'
import { AddIngredientForm } from '~/components/AddIngredientForm'
import { MealCard } from '~/components/MealCard'

const ingredientsQueryOptions = queryOptions({
  queryKey: ['ingredients'],
  queryFn: () => getIngredientsFn(),
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(ingredientsQueryOptions)
  },
  errorComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">
          We couldn't load your fridge right now. Please refresh the page.
        </p>
      </div>
    </main>
  ),
})

function Home() {
  const queryClient = useQueryClient()
  const ingredientsQuery = useQuery(ingredientsQueryOptions)
  const ingredients = ingredientsQuery.data ?? []

  const [constraint, setConstraint] = useState('')
  const [removingId, setRemovingId] = useState<string | null>(null)

  const addMutation = useMutation({
    mutationFn: (input: { name: string; quantity: number | null; unit: string | null }) =>
      addIngredientFn({ data: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeIngredientFn({ data: { id } }),
    onMutate: (id) => setRemovingId(id),
    onSettled: () => setRemovingId(null),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredients'] }),
  })

  const generateMutation = useMutation<GenerateSuggestionsResult, Error, string | undefined>({
    mutationFn: (constraintValue) => generateSuggestionsFn({ data: { constraint: constraintValue } }),
  })

  const result = generateMutation.data

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-stone-900">What's in My Fridge?</h1>
        <p className="mt-2 text-stone-600">
          Tell us what you have. We'll figure out what you can cook.
        </p>
      </header>

      <section className="mt-8">
        <AddIngredientForm
          onAdd={(input) => addMutation.mutateAsync(input)}
          isAdding={addMutation.isPending}
        />
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Your ingredients
        </h2>
        <Pantry
          ingredients={ingredients}
          onRemove={(id) => removeMutation.mutate(id)}
          isRemoving={(id) => removingId === id}
        />
        {removeMutation.isError && (
          <p className="mt-2 text-sm text-red-600">
            Couldn't remove that ingredient. Please try again.
          </p>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-white p-5">
        <label htmlFor="constraint" className="block text-sm font-medium text-stone-700">
          Anything I should consider?
        </label>
        <input
          id="constraint"
          value={constraint}
          onChange={(e) => setConstraint(e.target.value)}
          placeholder="e.g. No spicy food, only 15 minutes…"
          maxLength={300}
          className="mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:border-amber-500"
        />

        <button
          type="button"
          onClick={() => generateMutation.mutate(constraint.trim() || undefined)}
          disabled={ingredients.length === 0 || generateMutation.isPending}
          className="mt-4 w-full rounded-xl bg-amber-600 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
        >
          {generateMutation.isPending ? 'Thinking of something delicious…' : 'What can I cook?'}
        </button>
      </section>

      <section className="mt-8">
        {generateMutation.isPending && (
          <p className="text-center text-stone-500">Thinking of something delicious…</p>
        )}

        {generateMutation.isError && (
          <ErrorBanner onRetry={() => generateMutation.mutate(constraint.trim() || undefined)} />
        )}

        {result && !result.ok && result.reason === 'ai_error' && (
          <ErrorBanner onRetry={() => generateMutation.mutate(constraint.trim() || undefined)} />
        )}

        {result && !result.ok && result.reason === 'empty_pantry' && (
          <p className="text-center text-stone-500">Add some ingredients first.</p>
        )}

        {result && result.ok && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              AI Suggestions
            </h2>
            {result.suggestions.map((suggestion) => (
              <MealCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
      <p className="text-red-700">
        Something went wrong while coming up with ideas. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-xl bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  )
}
