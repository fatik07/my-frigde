import { Link } from '@tanstack/react-router'
import type { SavedSuggestion } from '~/lib/schemas'

const DIFFICULTY_LABEL: Record<SavedSuggestion['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export function MealCard({ suggestion }: { suggestion: SavedSuggestion }) {
  return (
    <Link
      to="/recipe/$id"
      params={{ id: suggestion.id }}
      className="block rounded-2xl border border-amber-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-stone-900">{suggestion.name}</h3>
      <p className="mt-1 text-sm text-stone-600">{suggestion.description}</p>

      <div className="mt-3 flex gap-3 text-sm text-stone-500">
        <span>⏱ {suggestion.time_minutes} min</span>
        <span>•</span>
        <span>{DIFFICULTY_LABEL[suggestion.difficulty]}</span>
      </div>

      {suggestion.ingredients_used.length > 0 && (
        <p className="mt-3 text-sm text-stone-600">
          Uses: {suggestion.ingredients_used.join(', ')}
        </p>
      )}

      {suggestion.missing_ingredients.length > 0 && (
        <p className="mt-1 text-sm text-amber-700">
          Missing: {suggestion.missing_ingredients.join(', ')}
        </p>
      )}
    </Link>
  )
}
