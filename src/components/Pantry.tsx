import type { Ingredient } from '~/lib/schemas'
import { ingredientIcon } from '~/lib/ingredientIcon'

interface PantryProps {
  ingredients: Array<Ingredient>
  onRemove: (id: string) => void
  isRemoving: (id: string) => boolean
}

export function Pantry({ ingredients, onRemove, isRemoving }: PantryProps) {
  if (ingredients.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-10 text-center">
        <p className="text-lg font-medium text-amber-900">Your fridge is empty.</p>
        <p className="mt-1 text-amber-700">
          Add a few ingredients and let's see what you can make.
        </p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-amber-100 rounded-2xl border border-amber-200 bg-white">
      {ingredients.map((ingredient) => (
        <li
          key={ingredient.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <span className="flex items-center gap-2 text-stone-800">
            <span aria-hidden="true">{ingredientIcon(ingredient.name)}</span>
            <span className="font-medium">{ingredient.name}</span>
            {(ingredient.quantity || ingredient.unit) && (
              <span className="text-stone-500">
                × {ingredient.quantity ?? ''} {ingredient.unit ?? ''}
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => onRemove(ingredient.id)}
            disabled={isRemoving(ingredient.id)}
            className="rounded-full px-3 py-1 text-sm text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label={`Remove ${ingredient.name}`}
          >
            {isRemoving(ingredient.id) ? '…' : '✕'}
          </button>
        </li>
      ))}
    </ul>
  )
}
