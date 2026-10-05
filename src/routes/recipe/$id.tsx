import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getSuggestionFn } from '~/server/functions/suggestions'

export const Route = createFileRoute('/recipe/$id')({
  component: RecipeDetail,
  loader: async ({ params }) => {
    const suggestion = await getSuggestionFn({ data: { id: params.id } })
    if (!suggestion) throw notFound()
    return suggestion
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-10 text-center">
      <p className="text-stone-600">We couldn't find that recipe.</p>
      <Link to="/" className="mt-3 inline-block text-amber-700 hover:underline">
        ← Back to your fridge
      </Link>
    </main>
  ),
  errorComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">We couldn't load that recipe right now.</p>
        <Link to="/" className="mt-3 inline-block text-amber-700 hover:underline">
          ← Back to your fridge
        </Link>
      </div>
    </main>
  ),
})

function RecipeDetail() {
  const suggestion = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/" className="text-sm text-amber-700 hover:underline">
        ← Back to your fridge
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-stone-900">{suggestion.name}</h1>
      <p className="mt-2 text-stone-600">{suggestion.description}</p>

      <div className="mt-4 flex gap-3 text-sm text-stone-500">
        <span>⏱ {suggestion.time_minutes} min</span>
        <span>•</span>
        <span className="capitalize">{suggestion.difficulty}</span>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Ingredients you have
          </h2>
          <ul className="mt-2 space-y-1 text-stone-800">
            {suggestion.ingredients_used.map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
        </div>

        {suggestion.missing_ingredients.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              You'll also need
            </h2>
            <ul className="mt-2 space-y-1 text-amber-700">
              {suggestion.missing_ingredients.map((item) => (
                <li key={item}>+ {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {suggestion.steps.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">Steps</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-stone-800">
            {suggestion.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </main>
  )
}
