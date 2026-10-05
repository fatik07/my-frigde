import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { ConstraintTextSchema, type SavedSuggestion } from '~/lib/schemas'
import { listIngredients } from '~/server/db/ingredients'
import { getSuggestionById, saveSuggestions } from '~/server/db/suggestions'
import { generateMealSuggestions } from '~/server/ai/generate'
import { withSanitizedErrors } from '~/server/sanitizeError'

const GenerateInputSchema = z.object({ constraint: ConstraintTextSchema })

export type GenerateSuggestionsResult =
  | { ok: true; suggestions: Array<SavedSuggestion> }
  | { ok: false; reason: 'empty_pantry' | 'ai_error' }

export const generateSuggestionsFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => GenerateInputSchema.parse(input))
  .handler(async ({ data }): Promise<GenerateSuggestionsResult> => {
    try {
      const ingredients = await listIngredients()
      if (ingredients.length === 0) {
        return { ok: false, reason: 'empty_pantry' }
      }

      const suggestions = await generateMealSuggestions(ingredients, data.constraint)
      const saved = await saveSuggestions(suggestions)
      return { ok: true, suggestions: saved }
    } catch (error) {
      console.error('Meal suggestion generation failed:', error)
      return { ok: false, reason: 'ai_error' }
    }
  })

export const getSuggestionFn = createServerFn({ method: 'GET' })
  .validator((input: unknown) => z.object({ id: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    return withSanitizedErrors('Unable to load that recipe right now.', () =>
      getSuggestionById(data.id),
    )
  })
