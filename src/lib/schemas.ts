import { z } from 'zod'

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  created_at: z.string(),
})
export type Ingredient = z.infer<typeof IngredientSchema>

export const NewIngredientSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  quantity: z.coerce.number().positive().max(100000).nullable().optional(),
  unit: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .optional()
    .transform((v) => (v ? v : null)),
})
export type NewIngredient = z.infer<typeof NewIngredientSchema>

export const ConstraintTextSchema = z.string().trim().max(300).optional()

export const DifficultySchema = z.enum(['easy', 'medium', 'hard'])

export const MealSuggestionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  time_minutes: z.number().int().positive().max(600),
  difficulty: DifficultySchema,
  ingredients_used: z.array(z.string().min(1)).max(30),
  missing_ingredients: z.array(z.string().min(1)).max(30),
  steps: z.array(z.string().min(1)).max(20),
})
export type MealSuggestion = z.infer<typeof MealSuggestionSchema>

export const AiSuggestionsResponseSchema = z.object({
  suggestions: z.array(MealSuggestionSchema).min(1).max(5),
})
export type AiSuggestionsResponse = z.infer<typeof AiSuggestionsResponseSchema>

export const SavedSuggestionSchema = MealSuggestionSchema.extend({
  id: z.string(),
  created_at: z.string(),
})
export type SavedSuggestion = z.infer<typeof SavedSuggestionSchema>
