import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { NewIngredientSchema } from '~/lib/schemas'
import { addIngredient, listIngredients, removeIngredient } from '~/server/db/ingredients'
import { withSanitizedErrors } from '~/server/sanitizeError'

export const getIngredientsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return withSanitizedErrors('Unable to load your pantry right now.', () => listIngredients())
})

export const addIngredientFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => NewIngredientSchema.parse(input))
  .handler(async ({ data }) => {
    return withSanitizedErrors('Unable to add that ingredient right now.', () =>
      addIngredient(data),
    )
  })

export const removeIngredientFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => z.object({ id: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    await withSanitizedErrors('Unable to remove that ingredient right now.', () =>
      removeIngredient(data.id),
    )
    return { id: data.id }
  })
