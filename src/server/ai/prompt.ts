import type { Ingredient } from '~/lib/schemas'

export function formatIngredient(ingredient: Ingredient): string {
  const parts = [ingredient.name]
  if (ingredient.quantity) parts.push(String(ingredient.quantity))
  if (ingredient.unit) parts.push(ingredient.unit)
  return parts.join(' ')
}

export function buildMealSuggestionPrompt(
  ingredients: Array<Ingredient>,
  constraint: string | undefined,
): string {
  const ingredientList = ingredients.map((i) => `- ${formatIngredient(i)}`).join('\n')

  return `You are a practical home cooking assistant. The user has the following ingredients available in their kitchen:

${ingredientList}

${constraint ? `The user also asked you to consider this: "${constraint}"\n` : ''}
Suggest approximately 3 realistic, practical meals the user can cook.

Rules you must follow:
- Prioritize using the ingredients the user already has.
- Minimize the number of additional ingredients required.
- Do not suggest meals that need ingredients that are obviously hard to get or unrealistic given what the user has.
- Keep recipes realistic for a home cook and keep cooking times reasonable.
- For each meal, clearly separate "ingredients_used" (ingredients from the user's list that this meal uses) from "missing_ingredients" (anything else needed that the user did not list).
- Never list an ingredient in "ingredients_used" unless it is genuinely in the user's list above.
- In "ingredients_used", copy each ingredient's name exactly as written in the user's list above (e.g. write "Chicken", not "chicken breast" or "diced chicken").
- Respect any user constraint given above (e.g. dietary restrictions, budget, time limits, available equipment).
- Return only the structured output requested, with no extra commentary.`
}
