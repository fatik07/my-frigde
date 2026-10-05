import { useState, type FormEvent } from 'react'

interface AddIngredientFormProps {
  onAdd: (input: { name: string; quantity: number | null; unit: string | null }) => Promise<unknown>
  isAdding: boolean
}

export function AddIngredientForm({ onAdd, isAdding }: AddIngredientFormProps) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    if (quantity.trim() && Number.isNaN(Number(quantity))) {
      setError('Quantity must be a number.')
      return
    }

    setError(null)
    try {
      await onAdd({
        name: trimmedName,
        quantity: quantity.trim() ? Number(quantity) : null,
        unit: unit.trim() || null,
      })
      setName('')
      setQuantity('')
      setUnit('')
    } catch {
      setError("Couldn't add that ingredient. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div className="flex-1 min-w-[140px]">
        <label htmlFor="ingredient-name" className="sr-only">
          Ingredient name
        </label>
        <input
          id="ingredient-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Eggs"
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-amber-500"
          maxLength={80}
        />
      </div>
      <div className="w-20">
        <label htmlFor="ingredient-qty" className="sr-only">
          Quantity
        </label>
        <input
          id="ingredient-qty"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          inputMode="decimal"
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-amber-500"
        />
      </div>
      <div className="w-24">
        <label htmlFor="ingredient-unit" className="sr-only">
          Unit
        </label>
        <input
          id="ingredient-unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unit"
          maxLength={20}
          className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-amber-500"
        />
      </div>
      <button
        type="submit"
        disabled={isAdding || !name.trim()}
        className="rounded-xl bg-amber-600 px-4 py-2 font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
      >
        {isAdding ? 'Adding…' : 'Add ingredient'}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  )
}
