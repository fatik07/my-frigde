import { getServerSupabase } from './client'
import { SavedSuggestionSchema, type MealSuggestion, type SavedSuggestion } from '~/lib/schemas'

export async function saveSuggestions(
  suggestions: Array<MealSuggestion>,
): Promise<Array<SavedSuggestion>> {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('suggestions')
    .insert(
      suggestions.map((s) => ({
        name: s.name,
        description: s.description,
        time_minutes: s.time_minutes,
        difficulty: s.difficulty,
        ingredients_used: s.ingredients_used,
        missing_ingredients: s.missing_ingredients,
        steps: s.steps,
      })),
    )
    .select('id, name, description, time_minutes, difficulty, ingredients_used, missing_ingredients, steps, created_at')

  if (error) throw new Error(`Failed to save suggestions: ${error.message}`)
  return data.map((row) => SavedSuggestionSchema.parse(row))
}

export async function getSuggestionById(id: string): Promise<SavedSuggestion | null> {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('suggestions')
    .select('id, name, description, time_minutes, difficulty, ingredients_used, missing_ingredients, steps, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(`Failed to load suggestion: ${error.message}`)
  if (!data) return null
  return SavedSuggestionSchema.parse(data)
}
