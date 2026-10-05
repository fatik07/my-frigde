import { chat } from '@tanstack/ai'
import { getMealSuggestionAdapter } from './adapter'
import { buildMealSuggestionPrompt } from './prompt'
import { reconcileWithPantry } from './reconcile'
import { AiSuggestionsResponseSchema, type Ingredient, type MealSuggestion } from '~/lib/schemas'

export class AiGenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AiGenerationError'
  }
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fenced ? fenced[1] : trimmed
}

async function requestStructured(prompt: string) {
  const adapter = getMealSuggestionAdapter()
  return await chat({
    adapter,
    messages: [{ role: 'user', content: prompt }],
    outputSchema: AiSuggestionsResponseSchema,
    stream: false,
  })
}

async function requestPlainTextFallback(prompt: string) {
  const adapter = getMealSuggestionAdapter()
  const text = await chat({
    adapter,
    messages: [
      {
        role: 'user',
        content: `${prompt}\n\nRespond with ONLY a single JSON object matching this shape, no markdown fences, no extra text:\n{"suggestions":[{"name":string,"description":string,"time_minutes":number,"difficulty":"easy"|"medium"|"hard","ingredients_used":string[],"missing_ingredients":string[],"steps":string[]}]}`,
      },
    ],
    stream: false,
  })

  const parsed = JSON.parse(stripCodeFence(text))
  return AiSuggestionsResponseSchema.parse(parsed)
}

export async function generateMealSuggestions(
  ingredients: Array<Ingredient>,
  constraint: string | undefined,
): Promise<Array<MealSuggestion>> {
  const prompt = buildMealSuggestionPrompt(ingredients, constraint)

  let result
  try {
    result = await requestStructured(prompt)
  } catch {
    try {
      result = await requestPlainTextFallback(prompt)
    } catch (fallbackError) {
      throw new AiGenerationError(
        `AI did not return valid structured output: ${(fallbackError as Error).message}`,
      )
    }
  }

  const pantryNames = ingredients.map((i) => i.name)
  return result.suggestions.map((s) => reconcileWithPantry(s, pantryNames))
}
