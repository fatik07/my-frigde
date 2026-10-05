import { getServerSupabase } from './client'
import { IngredientSchema, type Ingredient, type NewIngredient } from '~/lib/schemas'

export async function listIngredients(): Promise<Array<Ingredient>> {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('ingredients')
    .select('id, name, quantity, unit, created_at')
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Failed to load ingredients: ${error.message}`)
  return data.map((row) => IngredientSchema.parse(row))
}

export async function addIngredient(input: NewIngredient): Promise<Ingredient> {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('ingredients')
    .insert({
      name: input.name,
      quantity: input.quantity ?? null,
      unit: input.unit ?? null,
    })
    .select('id, name, quantity, unit, created_at')
    .single()

  if (error) throw new Error(`Failed to add ingredient: ${error.message}`)
  return IngredientSchema.parse(data)
}

export async function removeIngredient(id: string): Promise<void> {
  const supabase = getServerSupabase()
  const { error } = await supabase.from('ingredients').delete().eq('id', id)
  if (error) throw new Error(`Failed to remove ingredient: ${error.message}`)
}
