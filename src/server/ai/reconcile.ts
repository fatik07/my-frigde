import type { MealSuggestion } from '~/lib/schemas'

function singularForms(name: string): Set<string> {
  const lower = name.trim().toLowerCase()
  const forms = new Set([lower])
  if (lower.endsWith('es')) forms.add(lower.slice(0, -2))
  if (lower.endsWith('s')) forms.add(lower.slice(0, -1))
  return forms
}

function matches(a: string, b: string): boolean {
  const formsA = singularForms(a)
  const formsB = singularForms(b)
  for (const form of formsA) if (formsB.has(form)) return true
  return false
}

/**
 * Defends against the AI claiming an ingredient is available when it
 * isn't: any entry in ingredients_used that doesn't match something
 * actually in the pantry is moved into missing_ingredients instead.
 */
export function reconcileWithPantry(
  suggestion: MealSuggestion,
  pantryNames: Array<string>,
): MealSuggestion {
  const confirmedUsed: Array<string> = []
  const demoted: Array<string> = []

  for (const item of suggestion.ingredients_used) {
    if (pantryNames.some((pantryItem) => matches(item, pantryItem))) {
      confirmedUsed.push(item)
    } else {
      demoted.push(item)
    }
  }

  const missing = new Set(suggestion.missing_ingredients.map((m) => m.trim()))
  for (const item of demoted) missing.add(item.trim())

  return {
    ...suggestion,
    ingredients_used: confirmedUsed,
    missing_ingredients: Array.from(missing),
  }
}
